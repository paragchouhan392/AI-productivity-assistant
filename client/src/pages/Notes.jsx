import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  FileText,
  Trash2,
  X,
  Save,
  RotateCcw,
  Clock,
  StickyNote,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Set VITE_API_URL in your .env file.
// Example: VITE_API_URL=http://localhost:5000/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

const emptyNote = {
  title: "",
  content: "",
};

function getNoteId(note) {
  return note.note_id ?? note.id;
}

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [formData, setFormData] = useState(emptyNote);
  const [savedSnapshot, setSavedSnapshot] = useState(emptyNote);

  const isNewNote = !selectedNote;

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notes");

      const data = response.data.data ?? response.data;

      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError(err.response?.data?.message || "Unable to load your notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Open modal for a new note
  const handleAddNote = () => {
    setSelectedNote(null);
    setFormData({ ...emptyNote });
    setSavedSnapshot({ ...emptyNote });
    setIsModalOpen(true);
  };

  // Open modal for an existing note
  const handleOpenNote = (note) => {
    const data = {
      title: note.title || "",
      content: note.content || "",
    };

    setSelectedNote(note);
    setFormData(data);
    setSavedSnapshot({ ...data });
    setIsModalOpen(true);
  };

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Check for unsaved changes
  const isDirty =
    formData.title !== savedSnapshot.title ||
    formData.content !== savedSnapshot.content;

  // Close editor without saving
  const handleDiscard = () => {
    if (isDirty && !window.confirm("You have unsaved changes. Discard them?")) {
      return;
    }

    setIsModalOpen(false);
    setSelectedNote(null);
    setFormData(emptyNote);
  };

  // Reset form to last saved version
  const handleReset = () => {
    setFormData({ ...savedSnapshot });
  };

  // Save a new note or update an existing note
  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError("Please enter a note title.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        title: formData.title.trim(),
        content: formData.content,
      };

      let response;

      if (isNewNote) {
        response = await api.post("/notes", payload);
      } else {
        response = await api.put(`/notes/${getNoteId(selectedNote)}`, payload);
      }

      const savedNote = response.data.data ?? response.data;

      if (isNewNote) {
        setNotes((prev) => [savedNote, ...prev]);
      } else {
        setNotes((prev) =>
          prev.map((note) =>
            getNoteId(note) === getNoteId(selectedNote) ? savedNote : note,
          ),
        );
      }

      setSelectedNote(savedNote);
      setSavedSnapshot({ ...payload });
      setFormData({ ...payload });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving note:", err);
      setError(err.response?.data?.message || "Unable to save your note.");
    } finally {
      setSaving(false);
    }
  };

  // Delete a note
  const handleDelete = async (e, note) => {
    e?.stopPropagation();

    const confirmed = window.confirm(
      `Are you sure you want to delete "${note.title}"?`,
    );

    if (!confirmed) return;

    try {
      await api.delete(`/notes/${getNoteId(note)}`);

      setNotes((prev) =>
        prev.filter((item) => getNoteId(item) !== getNoteId(note)),
      );

      if (selectedNote && getNoteId(selectedNote) === getNoteId(note)) {
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error deleting note:", err);
      setError(err.response?.data?.message || "Unable to delete note.");
    }
  };

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const query = search.toLowerCase();

    return (
      note.title?.toLowerCase().includes(query) ||
      note.content?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-8 text-slate-800 md:px-8">
      {/* Header */}
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-blue-600">
              <StickyNote size={20} />
              <span className="text-sm font-semibold tracking-wide">
                YOUR WORKSPACE
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              My Notes
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Keep your thoughts, ideas and important information organized.
            </p>
          </div>

          <button
            onClick={handleAddNote}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md active:scale-95"
          >
            <Plus size={19} />
            Create Note
          </button>
        </div>

        {/* Search and note count */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search your notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <p className="text-sm text-slate-500">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <AlertCircle size={18} />
            {error}
            <button
              onClick={() => setError("")}
              className="ml-auto"
              aria-label="Dismiss error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : filteredNotes.length === 0 ? (
          /* Empty state */
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 text-center">
            <div className="mb-4 rounded-2xl bg-blue-50 p-5 text-blue-600">
              <FileText size={34} />
            </div>

            <h2 className="text-xl font-semibold text-slate-800">
              {search ? "No matching notes" : "No notes yet"}
            </h2>

            <p className="mt-2 max-w-sm text-sm text-slate-500">
              {search
                ? "Try searching with another title or keyword."
                : "Start collecting your ideas and thoughts in one place."}
            </p>

            {!search && (
              <button
                onClick={handleAddNote}
                className="mt-5 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <Plus size={17} />
                Create your first note
              </button>
            )}
          </div>
        ) : (
          /* Notes Grid */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredNotes.map((note) => (
              <div
                key={getNoteId(note)}
                onClick={() => handleOpenNote(note)}
                className="group relative flex min-h-56 cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                    <FileText size={20} />
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, note)}
                    className="rounded-lg p-2 text-slate-400 opacity-100 transition hover:bg-red-50 hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100"
                    title="Delete note"
                    aria-label={`Delete ${note.title}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-slate-800">
                  {note.title || "Untitled note"}
                </h3>

                <p className="flex-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-500 line-clamp-5">
                  {note.content || "No content added yet..."}
                </p>

                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400">
                  <Clock size={14} />
                  {formatDate(note.updated_at || note.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-3 backdrop-blur-md sm:p-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleDiscard();
            }
          }}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isNewNote ? "Create a new note" : "Edit note"}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {isNewNote
                    ? "Capture your thoughts and ideas."
                    : `Last saved: ${formatDate(selectedNote?.updated_at || selectedNote?.created_at)}`}
                </p>
              </div>

              <button
                onClick={handleDiscard}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close editor"
              >
                <X size={21} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
              <div>
                <label
                  htmlFor="note-title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Note title
                </label>

                <input
                  id="note-title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Give your note a title..."
                  maxLength={200}
                  autoFocus
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-1 flex-col">
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="note-content"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Content
                  </label>

                  <span className="text-xs text-slate-400">
                    {formData.content.length} characters
                  </span>
                </div>

                <textarea
                  id="note-content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Start writing your thoughts here..."
                  className="min-h-[300px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                {!isNewNote && (
                  <button
                    onClick={(e) => handleDelete(e, selectedNote)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}

                <button
                  onClick={handleReset}
                  disabled={!isDirty || saving}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={handleDiscard}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  Discard changes
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving || !formData.title.trim() || !isDirty}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}

                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
