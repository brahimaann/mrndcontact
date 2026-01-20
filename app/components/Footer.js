// app/components/Footer.js
"use client";
import { useState } from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  const FORM_ID = '1FAIpQLSfv_AyQv4BJovhvsslneFWzMxb7_k7dMrzejFZzcp9Hpi-mZQ';
  const ENTRY_ID = '778048420';

  const [submitted, setSubmitted] = useState(false);

  return (
    <footer className=" mrnd-footer">

      {/* Footer content */}
      <div className="container">
        <div className="grid">
          <nav>
            <div className="label">Explore</div>
            <ul>
              <li><a href="/projects">Projects</a></li>
              
            </ul>
          </nav>

          <div>
            <div className="label">Follow</div>
            <ul className="socials">
              <li><a target="_blank" rel="noopener" href="https://instagram.com">IG</a></li>
              <li><a target="_blank" rel="noopener" href="https://x.com">X</a></li>
              <li><a target="_blank" rel="noopener" href="https://youtube.com">YT</a></li>
              <li><a target="_blank" rel="noopener" href="https://tiktok.com">TT</a></li>
            </ul>
          </div>

      <form
            className="newsletter max-[970px]:hidden"
            action={`https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`}
            method="POST"
            target="gform_iframe"
            onSubmit={() => setSubmitted(true)}
          >
            <div className="label">Stay in the loop</div>
            <div className="join">
              {/* Name must be entry.<ENTRY_ID> */}
              <input
                type="email"
                name={`entry.${ENTRY_ID}`}
                placeholder="email@domain"
                required
                aria-label="Email"
              />
              <button type="submit">Join</button>
            </div>
            <p className="fine">By joining you agree to our terms.</p>

            {/* Optional spam honeypot (kept hidden) */}
            <input
              type="text"
              name="honeypot"
              tabIndex="-1"
              autoComplete="off"
              style={{ display: "none" }}
            />
          </form>

          {/* Hidden iframe to swallow Google redirect so we stay on-page */}
          <iframe
            title="gform_iframe"
            name="gform_iframe"
            style={{ display: "none" }}
          />

          {/* Thanks state */}
          {submitted && (
            <p className="fine" role="status">
              Thanks for joining! Check your inbox soon.
            </p>
          )}
        </div>
      </div>

      <div className="bottom">
        <div className="container row">
          <small>© {year} MRND. All rights reserved.</small>

        </div>
      </div>
    </footer>
  );
}
