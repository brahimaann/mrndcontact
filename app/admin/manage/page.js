"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import CloudinaryImage from "../../components/media/CloudinaryImage";

export default function AdminManagePage() {
  const [activeTab, setActiveTab] = useState("works");
  const [editingWork, setEditingWork] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  // Data queries
  const works = useQuery(api.works.listAllWorks, { limit: 500 }) || [];
  const events = useQuery(api.events.listAllEvents, { limit: 500 }) || [];

  // Mutations
  const deleteWork = useMutation(api.works.deleteWork);
  const deleteEvent = useMutation(api.events.deleteEvent);
  const updateWork = useMutation(api.works.updateWork);
  const updateEvent = useMutation(api.events.updateEvent);

  const handleDeleteWork = async (id) => {
    if (confirm("Are you sure you want to delete this work?")) {
      try {
        await deleteWork({ id });
      } catch (error) {
        alert("Failed to delete work: " + error.message);
      }
    }
  };

  const handleDeleteEvent = async (id) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent({ id });
      } catch (error) {
        alert("Failed to delete event: " + error.message);
      }
    }
  };

  return (
    <>
      <div className="flex justify-center pt-5 mb-4 min-[550px]:hidden">
        <Link href="/" className="block" aria-label="Go to Home">
          <Image
            src="/MRND%20TP.png"
            alt="Modern Renaissance — Home"
            width={160}
            height={60}
            priority
            className="mx-auto h-12 w-auto object-center hover:opacity-90 transition"
          />
        </Link>
      </div>

      <main className="bg-black text-white min-h-screen">
        <div className="ml-[calc(6rem+1in)] max-[550px]:ml-[calc(6rem)] lg:mr-[22rem] px-6 md:px-10 py-10">
          <header className="mb-6">
            <h1 className="text-[1rem] md:text-4xl font-[var(--font-dogica,monospace)] tracking-[0.25em]">
              [ ADMIN · MANAGE ]
            </h1>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] opacity-80">
              works · events · calendar
            </p>
          </header>

          {/* Tabs */}
          <div className="mb-6 flex gap-4 border-b border-white/20">
            <button
              onClick={() => setActiveTab("works")}
              className={`px-4 py-2 text-sm uppercase tracking-[0.2em] border-b-2 transition ${
                activeTab === "works"
                  ? "border-white text-white"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              Works ({works.length})
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-4 py-2 text-sm uppercase tracking-[0.2em] border-b-2 transition ${
                activeTab === "events"
                  ? "border-white text-white"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              Events ({events.length})
            </button>
          </div>

          {/* Works Tab */}
          {activeTab === "works" && (
            <section className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm uppercase tracking-[0.3em]">All Works</h2>
                <Link
                  href="/admin/works/new"
                  className="px-4 py-2 border border-white/40 hover:bg-white/10 transition text-xs uppercase tracking-[0.2em]"
                >
                  + Add Work
                </Link>
              </div>

              <div className="space-y-3">
                {works.map((work) => (
                  <WorkItem
                    key={work._id}
                    work={work}
                    onDelete={handleDeleteWork}
                    onUpdate={updateWork}
                    editing={editingWork === work._id}
                    setEditing={setEditingWork}
                  />
                ))}
                {works.length === 0 && (
                  <div className="border border-white/40 p-4 text-xs opacity-70 text-center">
                    [ No works yet ]
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <section className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm uppercase tracking-[0.3em]">All Events</h2>
                <Link
                  href="/calander"
                  className="px-4 py-2 border border-white/40 hover:bg-white/10 transition text-xs uppercase tracking-[0.2em]"
                >
                  + Add Event
                </Link>
              </div>

              <div className="space-y-3">
                {events.map((event) => (
                  <EventItem
                    key={event._id}
                    event={event}
                    onDelete={handleDeleteEvent}
                    onUpdate={updateEvent}
                    editing={editingEvent === event._id}
                    setEditing={setEditingEvent}
                  />
                ))}
                {events.length === 0 && (
                  <div className="border border-white/40 p-4 text-xs opacity-70 text-center">
                    [ No events yet ]
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

function WorkItem({ work, onDelete, onUpdate, editing, setEditing }) {
  const [title, setTitle] = useState(work.title);
  const [description, setDescription] = useState(work.description || "");
  const [type, setType] = useState(work.type);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate({
        id: work._id,
        title,
        description: description || undefined,
        type,
      });
      setEditing(null);
    } catch (error) {
      alert("Failed to update: " + (error?.message || error || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="border border-white/40 p-4">
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black border border-white/40 px-3 py-2 text-sm"
            placeholder="Title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-black border border-white/40 px-3 py-2 text-sm min-h-[100px]"
            placeholder="Description"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-black border border-white/40 px-3 py-2 text-sm"
          >
            <option value="photo">Photo</option>
            <option value="writing">Writing</option>
            <option value="performance">Performance</option>
            <option value="video">Video</option>
            <option value="other">Other</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 border border-white/40 hover:bg-white/10 transition text-xs uppercase tracking-[0.2em] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-4 py-2 border border-white/40 hover:bg-white/10 transition text-xs uppercase tracking-[0.2em]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-white/40 p-4 flex items-start gap-4">
      {work.coverPublicId && (
        <div className="w-24 h-24 flex-shrink-0">
          <CloudinaryImage publicId={work.coverPublicId} alt={work.title} aspect="aspect-square" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm uppercase tracking-[0.2em] mb-1">{work.title}</div>
        <div className="text-xs opacity-70 mb-2">{work.type} · {work.talentSlug}</div>
        {work.description && (
          <div className="text-xs opacity-60 line-clamp-2 mb-2">{work.description}</div>
        )}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setEditing(work._id)}
            className="px-3 py-1 border border-white/40 hover:bg-white/10 transition text-[10px] uppercase tracking-[0.2em]"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(work._id)}
            className="px-3 py-1 border border-red-500/40 hover:bg-red-500/10 transition text-[10px] uppercase tracking-[0.2em] text-red-400"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function EventItem({ event, onDelete, onUpdate, editing, setEditing }) {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description || "");
  const [location, setLocation] = useState(event.location || "");
  const [start, setStart] = useState(new Date(event.start).toISOString().slice(0, 16));
  const [end, setEnd] = useState(new Date(event.end).toISOString().slice(0, 16));
  const [allDay, setAllDay] = useState(event.allDay || false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate({
        id: event._id,
        title,
        description: description || undefined,
        location: location || undefined,
        start: new Date(start).getTime(),
        end: new Date(end).getTime(),
        allDay,
      });
      setEditing(null);
    } catch (error) {
      alert("Failed to update: " + (error?.message || error || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="border border-white/40 p-4">
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black border border-white/40 px-3 py-2 text-sm"
            placeholder="Title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-black border border-white/40 px-3 py-2 text-sm min-h-[100px]"
            placeholder="Description"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-black border border-white/40 px-3 py-2 text-sm"
            placeholder="Location"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs opacity-70 block mb-1">Start</label>
              <input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full bg-black border border-white/40 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs opacity-70 block mb-1">End</label>
              <input
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full bg-black border border-white/40 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="w-4 h-4"
            />
            All Day Event
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 border border-white/40 hover:bg-white/10 transition text-xs uppercase tracking-[0.2em] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-4 py-2 border border-white/40 hover:bg-white/10 transition text-xs uppercase tracking-[0.2em]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const startDate = new Date(event.start);
  const endDate = new Date(event.end);

  return (
    <div className="border border-white/40 p-4">
      <div className="text-sm uppercase tracking-[0.2em] mb-1">{event.title}</div>
      <div className="text-xs opacity-70 mb-2">
        {startDate.toLocaleDateString()} {!event.allDay && startDate.toLocaleTimeString()} - {endDate.toLocaleDateString()} {!event.allDay && endDate.toLocaleTimeString()}
        {event.location && ` · ${event.location}`}
      </div>
      {event.description && (
        <div className="text-xs opacity-60 mb-2 line-clamp-2">{event.description}</div>
      )}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setEditing(event._id)}
          className="px-3 py-1 border border-white/40 hover:bg-white/10 transition text-[10px] uppercase tracking-[0.2em]"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(event._id)}
          className="px-3 py-1 border border-red-500/40 hover:bg-red-500/10 transition text-[10px] uppercase tracking-[0.2em] text-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
