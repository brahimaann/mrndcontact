export default function AppShell({ children }) {
  return (
    <div
      className={[
        // mobile: no left gutter; comfy padding
        "px-4 sm:px-6 py-8",
        // add left HUD gutter on md+; right rail on lg+ if used
        "md:ml-[var(--hud-left-md)]",
        "lg:mr-[var(--hud-right-lg)]",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
