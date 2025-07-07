"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function FormPage() {
  const [view, setView] = useState("splash");
  const passInputRef = useRef(null); // Ref for the password input
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    instagram: "",
    tiktok: "", // New TikTok field
    roles: [],
    otherRole: ""
  });

  // Automatically focus the input when the logo view is active
  useEffect(() => {
    if (view === "logo" && passInputRef.current) {
      passInputRef.current.focus();
    }
  }, [view]);

  // Disable scrolling on body except when the form is visible
  useEffect(() => {
    document.body.style.overflow = view === "form" ? "auto" : "hidden";
  }, [view]);

  // Unified checkbox handler
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      roles: checked
        ? [...prev.roles, value]
        : prev.roles.filter((r) => r !== value),
      otherRole: value === "Other" && !checked ? "" : prev.otherRole
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digits = value.replace(/\D/g, "");
      let f = digits.slice(0, 3);
      if (digits.length > 3) f += "-" + digits.slice(3, 6);
      if (digits.length > 6) f += "-" + digits.slice(6, 10);
      setFormData((p) => ({ ...p, phone: f }));
    } else if (name === "instagram" || name === "tiktok") {
      // Add @ prefix if not present
      const prefixedValue = value.startsWith("@") ? value : "@" + value;
      setFormData((p) => ({ ...p, [name]: prefixedValue }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  /**
   * Runs a full screen transition:
   * 1. Fades in a grid to cover the screen.
   * 2. Swaps the view content.
   * 3. Fades out the grid to reveal the new view.
   * Returns a Promise that resolves when the transition is complete.
   */
  const performTransition = (newView) => {
    return new Promise((resolve) => {
      // 1. Cover screen
      gsap.set(".load-grid", { display: "grid" });
      gsap.to(".load-grid-item", {
        opacity: 1,
        duration: 0.001,
        ease: "none",
        stagger: { amount: 0.5, from: "random" },
        onComplete: () => {
          // 2. Swap view
          setView(newView);
          // 3. Uncover screen
          gsap.to(".load-grid-item", {
            opacity: 0,
            duration: 0.001,
            ease: "none",
            stagger: { amount: 0.5, from: "random" },
            onComplete: () => {
              gsap.set(".load-grid", { display: "none" });
              resolve();
            },
          });
        },
      });
    });
  };

  // Splash click: transition to form
  const handleSplashClick = async () => {
    await performTransition("form");
  };

  // Form submit: validate, then transition to logo
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.roles.length === 0) {
      alert("Please select at least one role.");
      return;
    }
    if (formData.phone.replace(/\D/g, "").length !== 10) {
      alert("Please enter a 10-digit phone number.");
      return;
    }

    const scriptURL = "https://script.google.com/macros/s/AKfycbwbBQyWZcz61Wp6pCRqCfEYFqbPXzS1FNiolnQrfO1FwAF_LabcWPfG4gEPaWLWY5qXoQ/exec"; // ❗️ PASTE YOUR URL HERE
    const formDataToSend = new FormData();

    // Append all your form fields
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('city', formData.city);
    formDataToSend.append('state', formData.state);
    formDataToSend.append('instagram', formData.instagram);
    formDataToSend.append('tiktok', formData.tiktok); // Add the new tiktok field
    formDataToSend.append('roles', formData.roles.join(', ')); // Convert array to a string
    formDataToSend.append('otherRole', formData.otherRole);

    try {
      // Send the data to your script
      await fetch(scriptURL, { method: 'POST', body: formDataToSend });
      // Proceed with the transition after successful submission
      await performTransition("logo");
    } catch (error) {
      console.error('Error submitting to Google Sheet!', error.message);
      alert('There was an error submitting your form. Please try again.');
    }
  };

  const gridItems = Array.from({ length: 12 * 8 });

  return (
    <>
      {/* SPLASH */}
      {view === "splash" && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 cursor-pointer"
          onClick={handleSplashClick}
          style={{ width: "100vw", height: "100vh" }}
        >
          <Image
            src="/MRND TP.png"
            alt="MRND Logo"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '90%', height: 'auto', maxWidth: '800px' }}
            priority
          />
        </div>
      )}

      {/* FORM */}
      {view === "form" && (
            <div className="flex items-center justify-center min-h-screen p-8 overflow-x-hidden">
          <div className="w-10/12 max-w-3xl">
            <form onSubmit={handleSubmit}>
              <div className="my-5">
                <div className="flex -mx-2">
                  <div className="px-2 w-1/2">
                    <label htmlFor="firstName" className="block font-bold mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="px-2 w-1/2">
                    <label htmlFor="lastName" className="block font-bold mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="my-5">
                <label htmlFor="email" className="block font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <div className="my-5">
                <label htmlFor="phone" className="block font-bold mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="my-5">
                <label htmlFor="city" className="block font-bold mb-2">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="my-5">
                <label htmlFor="state" className="block font-bold mb-2">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="my-5">
                <label htmlFor="instagram" className="block font-bold mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="my-5">
                <label htmlFor="tiktok" className="block font-bold mb-2">
                  TikTok
                </label>
                <input
                  type="text"
                  id="tiktok"
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="my-5">
                <label className="block font-bold mb-2">
                  Roles (select at least one)
                </label>
                <div className="flex flex-wrap gap-4">
                  {/* Music Artist / Musician */}
                  <div className="checkbox-wrapper inline-flex items-center">
                    <input
                      type="checkbox"
                      id="role-music-artist"
                      className="check"
                      name="roles"
                      value="Musician"
                      checked={formData.roles.includes('Musician')}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="role-music-artist" className="label inline-flex items-center">
                      <svg width="45" height="45" viewBox="0 0 95 95">
                        <rect x="30" y="20" width="50" height="50" stroke="black" fill="white" />
                        <g transform="translate(0,-952.36222)">
                          <path
                            d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                            stroke="black"
                            strokeWidth="3"
                            fill="none"
                            className="path1"
                          />
                        </g>
                      </svg>
                      <span className="ml-2">Musician</span>
                    </label>
                  </div>
                  {/* Visual Artist (painter, illustrator, etc.) */}
                  <div className="checkbox-wrapper inline-flex items-center">
                    <input
                      type="checkbox"
                      id="role-visual-artist"
                      className="check"
                      name="roles"
                      value="Visual Artist"
                      checked={formData.roles.includes('Visual Artist')}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="role-visual-artist" className="label inline-flex items-center">
                      <svg width="45" height="45" viewBox="0 0 95 95">
                        <rect x="30" y="20" width="50" height="50" stroke="black" fill="white" />
                        <g transform="translate(0,-952.36222)">
                          <path
                            d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                            stroke="black"
                            strokeWidth="3"
                            fill="none"
                            className="path1"
                          />
                        </g>
                      </svg>
                      <span className="ml-2">Visual Artist</span>
                    </label>
                  </div>
                  {/* Actor */}
                  <div className="checkbox-wrapper inline-flex items-center">
                    <input
                      type="checkbox"
                      id="role-actor"
                      className="check"
                      name="roles"
                      value="Actor"
                      checked={formData.roles.includes('Actor')}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="role-actor" className="label inline-flex items-center">
                      <svg width="45" height="45" viewBox="0 0 95 95">
                        <rect x="30" y="20" width="50" height="50" stroke="black" fill="white" />
                        <g transform="translate(0,-952.36222)">
                          <path
                            d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                            stroke="black"
                            strokeWidth="3"
                            fill="none"
                            className="path1"
                          />
                        </g>
                      </svg>
                      <span className="ml-2">Actor</span>
                    </label>
                  </div>
                  {/* Dancer */}
                  <div className="checkbox-wrapper inline-flex items-center">
                    <input
                      type="checkbox"
                      id="role-dancer"
                      className="check"
                      name="roles"
                      value="Dancer"
                      checked={formData.roles.includes('Dancer')}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="role-dancer" className="label inline-flex items-center">
                      <svg width="45" height="45" viewBox="0 0 95 95">
                        <rect x="30" y="20" width="50" height="50" stroke="black" fill="white" />
                        <g transform="translate(0,-952.36222)">
                          <path
                            d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                            stroke="black"
                            strokeWidth="3"
                            fill="none"
                            className="path1"
                          />
                        </g>
                      </svg>
                      <span className="ml-2">Dancer</span>
                    </label>
                  </div>
                  {/* Poet */}
                  <div className="checkbox-wrapper inline-flex items-center">
                    <input
                      type="checkbox"
                      id="role-poet"
                      className="check"
                      name="roles"
                      value="Poet"
                      checked={formData.roles.includes('Poet')}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="role-poet" className="label inline-flex items-center">
                      <svg width="45" height="45" viewBox="0 0 95 95">
                        <rect x="30" y="20" width="50" height="50" stroke="black" fill="white" />
                        <g transform="translate(0,-952.36222)">
                          <path
                            d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                            stroke="black"
                            strokeWidth="3"
                            fill="none"
                            className="path1"
                          />
                        </g>
                      </svg>
                      <span className="ml-2">Poet</span>
                    </label>
                  </div>
                  {/* Photographer */}
                  <div className="checkbox-wrapper inline-flex items-center">
                    <input
                      type="checkbox"
                      id="role-photographer"
                      className="check"
                      name="roles"
                      value="Photographer"
                      checked={formData.roles.includes('Photographer')}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="role-photographer" className="label inline-flex items-center">
                      <svg width="45" height="45" viewBox="0 0 95 95">
                        <rect x="30" y="20" width="50" height="50" stroke="black" fill="white" />
                        <g transform="translate(0,-952.36222)">
                          <path
                            d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                            stroke="black"
                            strokeWidth="3"
                            fill="none"
                            className="path1"
                          />
                        </g>
                      </svg>
                      <span className="ml-2">Photographer</span>
                    </label>
                  </div>
                  {/* Videographer */}
                  <div className="checkbox-wrapper inline-flex items-center">
                    <input
                      type="checkbox"
                      id="role-videographer"
                      className="check"
                      name="roles"
                      value="Videographer"
                      checked={formData.roles.includes('Videographer')}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="role-videographer" className="label inline-flex items-center">
                      <svg width="45" height="45" viewBox="0 0 95 95">
                        <rect x="30" y="20" width="50" height="50" stroke="black" fill="white" />
                        <g transform="translate(0,-952.36222)">
                          <path
                            d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                            stroke="black"
                            strokeWidth="3"
                            fill="none"
                            className="path1"
                          />
                        </g>
                      </svg>
                      <span className="ml-2">Videographer</span>
                    </label>
                  </div>
                  {/* Model */}
                  <div className="checkbox-wrapper inline-flex items-center">
                    <input
                      type="checkbox"
                      id="role-model"
                      className="check"
                      name="roles"
                      value="Model"
                      checked={formData.roles.includes('Model')}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="role-model" className="label inline-flex items-center">
                      <svg width="45" height="45" viewBox="0 0 95 95">
                        <rect x="30" y="20" width="50" height="50" stroke="black" fill="white" />
                        <g transform="translate(0,-952.36222)">
                          <path
                            d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                            stroke="black"
                            strokeWidth="3"
                            fill="none"
                            className="path1"
                          />
                        </g>
                      </svg>
                      <span className="ml-2">Model</span>
                    </label>
                  </div>
                  {/* Stylist */}
                  <div className="checkbox-wrapper inline-flex items-center">
                    <input
                      type="checkbox"
                      id="role-stylist"
                      className="check"
                      name="roles"
                      value="Stylist"
                      checked={formData.roles.includes('Stylist')}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="role-stylist" className="label inline-flex items-center">
                      <svg width="45" height="45" viewBox="0 0 95 95">
                        <rect x="30" y="20" width="50" height="50" stroke="black" fill="white" />
                        <g transform="translate(0,-952.36222)">
                          <path
                            d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                            stroke="black"
                            strokeWidth="3"
                            fill="none"
                            className="path1"
                          />
                        </g>
                      </svg>
                      <span className="ml-2">Stylist</span>
                    </label>
                  </div>
                  {/* Creative Director */}
                  <div className="checkbox-wrapper inline-flex items-center">
                    <input
                      type="checkbox"
                      id="role-creative-director"
                      className="check"
                      name="roles"
                      value="Creative Director"
                      checked={formData.roles.includes('Creative Director')}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="role-creative-director" className="label inline-flex items-center">
                      <svg width="45" height="45" viewBox="0 0 95 95">
                        <rect x="30" y="20" width="50" height="50" stroke="black" fill="white" />
                        <g transform="translate(0,-952.36222)">
                          <path
                            d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                            stroke="black"
                            strokeWidth="3"
                            fill="none"
                            className="path1"
                          />
                        </g>
                      </svg>
                      <span className="ml-2">Creative Director</span>
                    </label>
                  </div>
                  {/* Organizer / Event Planner */}
                  <div className="checkbox-wrapper inline-flex items-center">
                    <input
                      type="checkbox"
                      id="role-organizer-event-planner"
                      className="check"
                      name="roles"
                      value="Organizer"
                      checked={formData.roles.includes('Organizer')}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="role-organizer-event-planner" className="label inline-flex items-center">
                      <svg width="45" height="45" viewBox="0 0 95 95">
                        <rect x="30" y="20" width="50" height="50" stroke="black" fill="white" />
                        <g transform="translate(0,-952.36222)">
                          <path
                            d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                            stroke="black"
                            strokeWidth="3"
                            fill="none"
                            className="path1"
                          />
                        </g>
                      </svg>
                      <span className="ml-2">Organizer</span>
                    </label>
                  </div>
                  {/* Business Owner */}
                  <div className="checkbox-wrapper inline-flex items-center">
                    <input
                      type="checkbox"
                      id="role-business-owner"
                      className="check"
                      name="roles"
                      value="Business Owner"
                      checked={formData.roles.includes('Business Owner')}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="role-business-owner" className="label inline-flex items-center">
                      <svg width="45" height="45" viewBox="0 0 95 95">
                        <rect x="30" y="20" width="50" height="50" stroke="black" fill="white" />
                        <g transform="translate(0,-952.36222)">
                          <path
                            d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                            stroke="black"
                            strokeWidth="3"
                            fill="none"
                            className="path1"
                          />
                        </g>
                      </svg>
                      <span className="ml-2">Business Owner</span>
                    </label>
                  </div>
                  {/* Supporter / Community Member */}
                  <div className="checkbox-wrapper inline-flex items-center">
                    <input
                      type="checkbox"
                      id="role-supporter-community-member"
                      className="check"
                      name="roles"
                      value="Supporter"
                      checked={formData.roles.includes('Supporter')}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="role-supporter-community-member" className="label inline-flex items-center">
                      <svg width="45" height="45" viewBox="0 0 95 95">
                        <rect x="30" y="20" width="50" height="50" stroke="black" fill="white" />
                        <g transform="translate(0,-952.36222)">
                          <path
                            d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                            stroke="black"
                            strokeWidth="3"
                            fill="none"
                            className="path1"
                          />
                        </g>
                      </svg>
                      <span className="ml-2">Supporter</span>
                    </label>
                  </div>
                  {/* Other */}
                  <div className="checkbox-wrapper inline-flex items-center">
                    <input
                      type="checkbox"
                      id="role-other"
                      className="check"
                      name="roles"
                      value="Other"
                      checked={formData.roles.includes('Other')}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="role-other" className="label inline-flex items-center">
                      <svg width="45" height="45" viewBox="0 0 95 95">
                        <rect x="30" y="20" width="50" height="50" stroke="black" fill="white" />
                        <g transform="translate(0,-952.36222)">
                          <path
                            d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                            stroke="black"
                            strokeWidth="3"
                            fill="none"
                            className="path1"
                          />
                        </g>
                      </svg>
                      <span className="ml-2">Other</span>
                    </label>
                  </div>
                </div>
                {formData.roles.includes('Other') && (
                  <div className="mt-4">
                    <label htmlFor="otherRole" className="block font-bold mb-2">
                      Please specify:
                    </label>
                    <input
                      type="text"
                      id="otherRole"
                      name="otherRole"
                      value={formData.otherRole}
                      onChange={handleChange}
                      className="w-full"
                      required
                    />
                  </div>
                )}
              </div>
              <div className="text-center mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 border border-gray-400 rounded font-bold"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOGO */}
      {view === "logo" && (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center z-50"
          style={{ width: "100vw", height: "100vh" }}
        >
          <Image
            src="/MRND TP.png"
            alt="MRND Logo"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '90%', height: 'auto', maxWidth: '800px' }}
            priority
          />
          <div className="mt-8">
            <input
              ref={passInputRef}
              type="password"
              id="pass"
              name="pass"
              maxLength={6}
              required
              className="w-full"
              onBlur={() => passInputRef.current.focus()}
            />
          </div>
        </div>
      )}

      {/* PIXEL GRID OVERLAY */}
      <div className="load-grid">
        {gridItems.map((_, i) => (
          <div key={i} className="load-grid-item" />
        ))}
      </div>
    </>
  );
}