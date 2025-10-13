"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription,
} from "../../components/ui/sheet";

export default function MobileHUD() {
  const [open, setOpen] = useState(false);

  return (
    <div className="laptop:hidden sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-white/15">
      <div className="flex items-center justify-between px-4 py-3">
        <button aria-label="Open menu" className="p-2 border border-white/30" onClick={() => setOpen(true)}>
          <Menu size={18} />
        </button>
        <Link href="/" className="text-xs uppercase tracking-[0.3em]">MRND</Link>
        <div className="w-9" />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="hidden" />
        <SheetContent side="left" className="bg-black text-white border-white/20 w-[85vw]">
          <SheetHeader>
            <SheetTitle className="text-xs uppercase tracking-[0.3em]">Navigation</SheetTitle>
            <SheetDescription className="sr-only">Main navigation</SheetDescription>
          </SheetHeader>
          <nav className="mt-4 space-y-2 text-sm uppercase tracking-[0.25em]">
            <Link onClick={() => setOpen(false)} className="block border border-white/20 px-3 py-2" href="/">Home</Link>
            <Link onClick={() => setOpen(false)} className="block border border-white/20 px-3 py-2" href="/cities">Cities</Link>
            <Link onClick={() => setOpen(false)} className="block border border-white/20 px-3 py-2" href="/works">Works</Link>
            <Link onClick={() => setOpen(false)} className="block border border-white/20 px-3 py-2" href="/contact">Contact</Link>
            <div className="opacity-70 pt-3 text-[10px]">Admin</div>
            <Link onClick={() => setOpen(false)} className="block border border-white/20 px-3 py-2" href="/admin">Dashboard</Link>
            <Link onClick={() => setOpen(false)} className="block border border-white/20 px-3 py-2" href="/admin/talents/new">+ Talent</Link>
            <Link onClick={() => setOpen(false)} className="block border border-white/20 px-3 py-2" href="/admin/works/new">+ Work</Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
