"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function ContactPage() {
  // views: splash -> form -> logo
  const [view, setView] = useState("splash");

  // typewriter on final screen
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  // form UX
  const [isLoading, setIsLoading] = useState(false);

  // persisted form data
  const [formData, setFormData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("formData");
      if (saved) return JSON.parse(saved);
    }
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      instagram: "",
      tiktok: "",
      roles: [],
      otherRole: "",
    };
  });

  // message sent typewriter
  useEffect(() => {
    if (view !== "logo") return;
    const text = " ACCESS GRANTED";
    let i = 0;
    setTypedText("");
    setShowCursor(true);

    const tick = () => {
      if (i < text.length) {
        setTypedText((p) => p + text.charAt(i));
        i += 1;
        setTimeout(tick, 100);
      } else {
        setTimeout(() => setShowCursor(false), 1000);
      }
    };
    tick();
    return () => setShowCursor(false);
  }, [view]);

  // lock scroll except when form is visible
  useEffect(() => {
    document.body.style.overflow = view === "form" ? "auto" : "hidden";
  }, [view]);

  // persist form data
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("formData", JSON.stringify(formData));
    }
  }, [formData]);

  // set view from query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam === 'logo') {
      setView('logo');
    }
  }, []);

  // checkbox toggle
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      roles: checked
        ? [...prev.roles, value]
        : prev.roles.filter((r) => r !== value),
      otherRole: value === "Other" && !checked ? "" : prev.otherRole,
    }));
  };

  // input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digits = value.replace(/\D/g, "");
      let f = digits.slice(0, 3);
      if (digits.length > 3) f += "-" + digits.slice(3, 6);
      if (digits.length > 6) f += "-" + digits.slice(6, 10);
      setFormData((p) => ({ ...p, phone: f }));
    } else if (name === "instagram" || name === "tiktok") {
      const pref = value ? (value.startsWith("@") ? value : "@" + value) : "";
      setFormData((p) => ({ ...p, [name]: pref }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  /**
   * Uses the global .load-grid from ClientLayout:
   * cover -> swap view -> uncover
   */
  const performTransition = (nextView) =>
    new Promise((resolve) => {
      gsap.set(".load-grid", { display: "grid" });
      gsap.to(".load-grid-item", {
        opacity: 1,
        duration: 0.001,
        ease: "none",
        stagger: { amount: 0.5, from: "random" },
        onComplete: () => {
          setView(nextView);
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

  const handleSplashClick = async () => {
    await performTransition("form");
  };

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

    setIsLoading(true);

    const scriptURL =
      "https://script.google.com/macros/s/AKfycbwbBQyWZcz61Wp6pCRqCfEYFqbPXzS1FNiolnQrfO1FwAF_LabcWPfG4gEPaWLWY5qXoQ/exec"; // <-- your Apps Script endpoint
    const payload = new FormData();
    Object.entries({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      state: formData.state,
      instagram: formData.instagram,
      tiktok: formData.tiktok,
      roles: formData.roles.join(", "),
      otherRole: formData.otherRole,
    }).forEach(([k, v]) => payload.append(k, v));

    try {
      await fetch(scriptURL, { method: "POST", body: payload });
      localStorage.removeItem("formData");
      await new Promise((r) => setTimeout(r, 1000));
      await performTransition("logo");
    } catch (err) {
      console.error("Submit error:", err);
      alert("There was an error submitting your form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* SPLASH */}
      {view === "splash" && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 cursor-pointer bg-white"
          onClick={handleSplashClick}
          style={{ width: "100vw", height: "100vh" }}
        >
          <Image
            src="/MRND TP.png"
            alt="MRND Logo"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "90%", height: "auto", maxWidth: "800px" }}
            priority
            draggable="false"
          />
        </div>
      )}

      {/* FORM */}
      {view === "form" && (
        <div className="flex items-center justify-center min-h-screen p-8 bg-white overflow-x-hidden">
          <div className="w-13/16 max-w-3xl">
            <form onSubmit={handleSubmit}>
              {/* Names */}
              <div className="my-5">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-[48%]">
                    <label htmlFor="firstName" className="block font-bold mb-2">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label htmlFor="lastName" className="block font-bold mb-2">
                      Last Name
                    </label>
                    <input
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

              {/* Email */}
              <div className="my-5">
                <label htmlFor="email" className="block font-bold mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              {/* Phone */}
              <div className="my-5">
                <label htmlFor="phone" className="block font-bold mb-2">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              {/* City / State */}
              <div className="my-5">
                <label htmlFor="city" className="block font-bold mb-2">
                  City
                </label>
                <input
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
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              {/* Socials */}
              <div className="my-5">
                <label htmlFor="instagram" className="block font-bold mb-2">
                  Instagram
                </label>
                <input
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
                  id="tiktok"
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              {/* Roles */}
              <div className="my-5">
                <label className="block font-bold mb-2">
                  Roles (select at least one)
                </label>
                <div className="flex flex-wrap gap-4">
                  {[
                    "Musician",
                    "Visual Artist",
                    "Actor",
                    "Dancer",
                    "Poet",
                    "Photographer",
                    "Videographer",
                    "Model",
                    "Stylist",
                    "Creative Director",
                    "Organizer",
                    "Business Owner",
                    "Supporter",
                    "Other",
                  ].map((role) => (
                    <div
                      key={role}
                      className="checkbox-wrapper inline-flex items-center"
                    >
                      <input
                        type="checkbox"
                        id={`role-${role.toLowerCase().replace(/\s+/g, "-")}`}
                        className="check"
                        name="roles"
                        value={role}
                        checked={formData.roles.includes(role)}
                        onChange={handleCheckboxChange}
                      />
                      <label
                        htmlFor={`role-${role.toLowerCase().replace(/\s+/g, "-")}`}
                        className="label inline-flex items-center"
                      >
                        <svg width="45" height="45" viewBox="0 0 95 95">
                          <rect
                            x="30"
                            y="20"
                            width="50"
                            height="50"
                            stroke="black"
                            fill="white"
                          />
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
                        <span className="ml-2">{role}</span>
                      </label>
                    </div>
                  ))}
                </div>

                {formData.roles.includes("Other") && (
                  <div className="mt-4">
                    <label htmlFor="otherRole" className="block font-bold mb-2">
                      Please specify:
                    </label>
                    <input
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

              {/* Submit */}
              <div className="text-center mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 border border-gray-400 rounded font-bold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="pulsing-dots">
                      <span>•</span>
                      <span>•</span>
                      <span>•</span>
                    </span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FINAL LOGO + PASSWORD */}
      {view === "logo" && (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-white"
          style={{ width: "100vw", height: "100vh" }}
        >
          <div
            className="text-center text-4xl mb-8"
            style={{ fontFamily: "Dogica, cursive" }}
          >
            {typedText}
            {showCursor && <span className="blinking-cursor">|</span>}
          </div>

          <Image
            src="/MRND TP.png"
            alt="MRND Logo"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "90%", height: "auto", maxWidth: "800px" }}
            priority
            draggable="false"
          />
        </div>
      )}
    </>
  );
}
