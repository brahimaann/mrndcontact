"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import CloudinaryUploadButton from "@/app/components/media/CloudinaryUploadButton";
import CloudinaryImage from "@/app/components/media/CloudinaryImage";
import { cn } from "@/app/lib/cn";

const TYPES = ["photo", "writing", "performance", "video", "other"];

export default function AdminNewWorkPage() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();

  // Who can access?
  const email = user?.primaryEmailAddress?.emailAddress || undefined;
  const phone = user?.primaryPhoneNumber?.phoneNumber || undefined;
  const clerkId = user?.id || undefined;
  const isAdmin = useQuery(api.users.isAdmin, { email, phone, clerkId }) || false;

  // Data
  const talents = useQuery(api.works.listTalents, {}) || [];

  // Mutations
  const upsertTalent = useMutation(api.works.upsertTalent);
  const createWork = useMutation(api.works.createWork);
  const attachCover = useMutation(api.works.attachCloudinaryPublicId);

  // Local form state
  const [mode, setMode] = React.useState("select"); // "select" | "create"
  const [selectedTalentSlug, setSelectedTalentSlug] = React.useState("");
  const [newTalentName, setNewTalentName] = React.useState("");

  const [title, setTitle] = React.useState("");
  const [workSlug, setWorkSlug] = React.useState("");
  const [type, setType] = React.useState("photo");
  const [description, setDescription] = React.useState("");
  const [date, setDate] = React.useState("");
  const [youtubeId, setYoutubeId] = React.useState("");
  const [coverPublicId, setCoverPublicId] = React.useState("");

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  const targetTalentSlug = mode === "select" ? selectedTalentSlug : newTalentName.trim();

  const slugify = (s) =>
    (s || "")
      .toLowerCase()
      .trim()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // basic guards
    if (!isSignedIn || !isAdmin) {
      setError("Admins only.");
      return;
    }
    if (!targetTalentSlug) {
      setError("Pick an existing talent or provide a new talent name.");
      return;
    }
    if (!title) {
      setError("Title is required.");
      return;
    }

    setSaving(true);
    try {
      // 1) Ensure talent exists (create if needed)
      let talentSlugFinal = "";
      if (mode === "select" && selectedTalentSlug) {
        talentSlugFinal = selectedTalentSlug;
      } else {
        const name = newTalentName.trim();
        const resp = await upsertTalent({
          name,
          // Let server compute/unique the slug; but pass a candidate
          slug: slugify(name),
          bio: "",
          portraitUrl: "",
          tags: [],
        });
        // server returns _id; but the readable slug comes from name; reuse candidate:
        talentSlugFinal = slugify(name);
      }

      // 2) Create work
      const finalWorkSlug = workSlug ? slugify(workSlug) : slugify(title);
      const metadata = youtubeId ? { youtubeId } : undefined;

      await createWork({
        talentSlug: talentSlugFinal,
        slug: finalWorkSlug,
        title,
        type,
        description: description || undefined,
        coverPublicId: coverPublicId || undefined,
        date: date || undefined,
        credits: [],
        metadata,
      });

      // 3) Attach cover if uploaded after create (noop if already saved above)
      if (coverPublicId) {
        await attachCover({
          talentSlug: talentSlugFinal,
          workSlug: finalWorkSlug,
          publicId: coverPublicId,
        });
      }

      // 4) Route to artist page
      router.push(`/works/${talentSlugFinal}`);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (!isSignedIn) {
    return (
      <main className="bg-black text-white min-h-screen grid place-items-center p-6">
        <div className="border border-white/40 p-6 text-center">
          <div className="text-sm uppercase tracking-[0.3em]">Please sign in</div>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="bg-black text-white min-h-screen grid place-items-center p-6">
        <div className="border border-white/40 p-6 text-center">
          <div className="text-sm uppercase tracking-[0.3em]">Admins only</div>
          <p className="text-xs opacity-70 mt-2">Your account doesn’t have access to this tool.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-black leading-2 text-white min-h-screen">
      <div className="ml-[calc(6rem+1in)] lg:mr-[22rem] px-6 md:px-10 py-10">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-[var(--font-dogica,monospace)] tracking-[0.25em]">
            [ ADMIN · NEW WORK ]
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] opacity-80">
            create · upload cover · document
          </p>
        </header>

        <form onSubmit={onSubmit} className="grid gap-6 max-w-3xl">
          {/* Talent selection */}
          <section className="border border-white/40 p-4">
            <div className="text-xs uppercase tracking-[0.3em] mb-3">Talent</div>

            <div className="flex gap-3 text-xs">
              <button
                type="button"
                onClick={() => setMode("select")}
                className={cn(
                  "px-2 py-1 border border-white/40",
                  mode === "select" ? "bg-white text-black font-bold" : "bg-black text-white"
                )}
              >
                Select existing
              </button>
              <button
                type="button"
                onClick={() => setMode("create")}
                className={cn(
                  "px-2 py-1 border border-white/40",
                  mode === "create" ? "bg-white text-black font-bold" : "bg-black text-white"
                )}
              >
                Create new
              </button>
            </div>

            {mode === "select" ? (
              <div className="mt-3">
                <label className="block text-[11px] uppercase tracking-[0.2em] mb-1">Pick Talent</label>
                <select
                  value={selectedTalentSlug}
                  onChange={(e) => setSelectedTalentSlug(e.target.value)}
                  className="w-full bg-black border border-white/40 p-2 text-sm"
                >
                  <option value="">— Select —</option>
                  {talents.map((t) => (
                    <option key={t._id} value={t.slug || t.name?.toLowerCase()}>
                      {(t.name || "").trim()}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] mb-1">Talent Name</label>
                  <input
                    value={newTalentName}
                    onChange={(e) => setNewTalentName(e.target.value)}
                    placeholder="e.g. Prince Cole"
                    className="w-full bg-black border border-white/40 p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] mb-1">Slug (optional)</label>
                  <input
                    value={newTalentName ? slugify(newTalentName) : ""}
                    disabled
                    className="w-full bg-black/40 border border-white/20 p-2 text-sm opacity-70"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Work meta */}
          <section className="border border-white/40 p-4 grid gap-4">
            <div className="text-xs uppercase tracking-[0.3em]">Work</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] mb-1">Title*</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black border border-white/40 p-2 text-sm"
                  placeholder="e.g. Street Series Vol. 1"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] mb-1">Slug (optional)</label>
                <input
                  value={workSlug}
                  onChange={(e) => setWorkSlug(e.target.value)}
                  placeholder={slugify(title)}
                  className="w-full bg-black border border-white/40 p-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-black border border-white/40 p-2 text-sm"
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] mb-1">Date</label>
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="YYYY-MM-DD"
                  className="w-full bg-black border border-white/40 p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] mb-1">YouTube Id (video)</label>
                <input
                  value={youtubeId}
                  onChange={(e) => setYoutubeId(e.target.value)}
                  placeholder="e.g. dQw4w9WgXcQ"
                  className="w-full bg-black border border-white/40 p-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full bg-black border border-white/40 p-2 text-sm"
                placeholder="Describe the work..."
              />
            </div>
          </section>

          {/* Cover image */}
          <section className="border border-white/40 p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-[0.3em]">Cover Image</div>
              <CloudinaryUploadButton onUploaded={(pid) => setCoverPublicId(pid)} />
            </div>

            <div className="mt-3">
              {coverPublicId ? (
                <CloudinaryImage publicId={coverPublicId} alt="Cover" aspect="aspect-[4/5]" />
              ) : (
                <div className="border border-white/30 bg-black/40 aspect-[4/5] grid place-items-center">
                  <span className="text-[10px] uppercase tracking-[0.2em] opacity-70">No cover uploaded</span>
                </div>
              )}
            </div>
          </section>

          {error && (
            <div className="border border-red-500 text-red-300 p-3 text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 border border-white/50 text-xs uppercase tracking-[0.3em] bg-black hover:bg-white/10"
            >
              {saving ? "Saving…" : "Save Work"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-white/30 text-xs uppercase tracking-[0.3em] bg-black hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
