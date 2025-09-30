export default function CRTFrame({ children }){
  return (
    <main className="min-h-screen">
      <div className="scanlines absolute inset-0 pointer-events-none" />
      {children}
    </main>
  );
}
