// app/components/Footer.js
"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="z-[-1] mrnd-footer">

      {/* Footer content */}
      <div className="container">
        <div className="grid">
          <nav>
            <div className="label">Explore</div>
            <ul>
              <li><a href="/cities">Cities</a></li>
              
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

          <form className="newsletter" onSubmit={(e)=>{e.preventDefault(); alert("Thanks for joining!"); e.target.reset();}}>
            <div className="label">Stay in the loop</div>
            <div className="join">
              <input type="email" placeholder="email@domain" required aria-label="Email" />
              <button type="submit">Join</button>
            </div>
            <p className="fine">By joining you agree to our terms.</p>
          </form>
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
