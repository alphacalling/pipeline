import { useEffect, useState } from "react";

const API_BASE = "/api/items";

function App() {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setItems(data);
    } catch (e) {
      setError("Failed to load items.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setActiveId(null);
    setForm({ title: "", description: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
    };
    try {
      let res;
      if (activeId) {
        res = await fetch(`${API_BASE}/${activeId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error("Request failed");
      await fetchItems();
      resetForm();
    } catch (e) {
      setError("Failed to save item.");
    } finally {
      setSaving(false);
    }
  }

  function handleSelect(item) {
    setActiveId(item._id);
    setForm({ title: item.title || "", description: item.description || "" });
  }

  async function handleToggle(item, e) {
    e.stopPropagation();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, completed: !item.completed }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      await fetchItems();
    } catch (e) {
      setError("Failed to toggle item.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, e) {
    e.stopPropagation();
    if (!confirm("Delete this item?")) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchItems();
      if (activeId === id) resetForm();
    } catch (e) {
      setError("Failed to delete item.");
    } finally {
      setSaving(false);
    }
  }

  const totalCount = items.length;
  const completedCount = items.filter((item) => item.completed).length;
  const pendingCount = totalCount - completedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl rounded-3xl bg-slate-900/80 border border-slate-700/50 backdrop-blur-xl shadow-2xl shadow-blue-950/40 p-6 md:p-10 space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-700/50">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 shadow-lg shadow-blue-500/25">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  MERN Pipeline CRUD
                </h1>
              </div>
            </div>
            <p className="text-sm text-slate-400 ml-[52px]">
              Manage your tasks with a React UI, Express API and MongoDB.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <div className="inline-flex items-center gap-2 text-emerald-300 text-sm font-medium">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
              Live API Connected
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 border border-slate-600/50 px-3 py-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                <span className="text-xs text-slate-300">Total</span>
                <span className="text-xs font-bold text-slate-100">{totalCount}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-400/40 px-3 py-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-emerald-300">Done</span>
                <span className="text-xs font-bold text-emerald-200">{completedCount}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-400/40 px-3 py-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.828a1 1 0 101.415-1.414L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-amber-300">Pending</span>
                <span className="text-xs font-bold text-amber-200">{pendingCount}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-[1.1fr_1fr] gap-6 md:gap-8">
          {/* Form Section */}
          <section className="rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-5 md:p-6 space-y-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className={`flex items-center justify-center h-8 w-8 rounded-lg ${activeId ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'}`}>
                  {activeId ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <h2 className="text-base font-semibold">
                  {activeId ? "Edit Item" : "Add New Item"}
                </h2>
              </div>
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${activeId ? 'border border-amber-400/50 text-amber-200 bg-amber-500/10' : 'border border-blue-400/50 text-blue-200 bg-blue-500/10'}`}>
                {activeId ? "Editing" : "Creating"}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Title <span className="text-rose-400">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Ship the next feature..."
                  className="w-full rounded-xl border border-slate-600/80 bg-slate-900/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 hover:border-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Add a bit more context for your task..."
                  className="w-full rounded-xl border border-slate-600/80 bg-slate-900/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 hover:border-slate-500 resize-none"
                />
              </div>

              {saving && (
                <div className="flex items-center gap-2 text-xs text-blue-300">
                  <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving changes…
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                {activeId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700/80 hover:border-slate-500 transition-all duration-200 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-400 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-blue-400 hover:to-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                >
                  {activeId ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Update Item
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Item
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-950/40 border border-rose-500/30 rounded-xl px-4 py-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
          </section>

          {/* List Section */}
          <section className="rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-sky-500/15 text-sky-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-semibold">Items</h2>
                  <p className="text-[11px] text-slate-400">
                    Tap a row to edit • Actions on right
                  </p>
                </div>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full border border-sky-400/50 text-sky-200 bg-sky-500/10 font-medium">
                MongoDB
              </span>
            </div>

            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
              {loading && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <svg className="animate-spin h-6 w-6 mb-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-xs">Loading items…</span>
                </div>
              )}
              {!loading && items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 border border-dashed border-slate-700 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-sm font-medium text-slate-500">No items yet</p>
                  <p className="text-xs text-slate-600 mt-1">Create your first task using the form</p>
                </div>
              )}
              {!loading &&
                items.map((item) => {
                  const active = item._id === activeId;
                  const created = item.createdAt
                    ? new Date(item.createdAt)
                    : null;
                  const updated = item.updatedAt
                    ? new Date(item.updatedAt)
                    : null;
                  return (
                    <div
                      key={item._id}
                      onClick={() => handleSelect(item)}
                      className={`group w-full text-left rounded-xl border px-4 py-3.5 flex gap-3 items-start transition-all duration-200 cursor-pointer ${
                        active
                          ? "border-emerald-400/60 bg-emerald-500/10 shadow-md shadow-emerald-500/10"
                          : "border-slate-700/80 bg-slate-900/50 hover:border-blue-400/60 hover:bg-slate-800/70 hover:shadow-md hover:shadow-blue-500/5"
                      }`}
                    >
                      {/* Checkbox indicator */}
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`flex items-center justify-center h-5 w-5 rounded-md border-2 transition-all duration-200 ${
                          item.completed
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-slate-500 group-hover:border-blue-400'
                        }`}>
                          {item.completed && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold truncate ${
                            item.completed
                              ? "line-through text-slate-500"
                              : "text-slate-100"
                          }`}
                        >
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-medium ${
                              item.completed
                                ? "text-emerald-300 bg-emerald-500/15"
                                : "text-amber-300 bg-amber-500/15"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${item.completed ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            {item.completed ? "Completed" : "Pending"}
                          </span>
                          {created && (
                            <span className="text-[10px] text-slate-500">
                              {created.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              {" · "}
                              {created.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleToggle(item, e)}
                          className={`text-[11px] rounded-lg border px-3 py-1.5 font-medium transition-all duration-200 cursor-pointer ${
                            item.completed
                              ? "border-amber-500/50 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
                              : "border-emerald-500/50 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
                          }`}
                        >
                          {item.completed ? "Reopen" : "✓ Done"}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(item._id, e)}
                          className="text-[11px] rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-rose-300 font-medium hover:bg-rose-500/20 hover:border-rose-500/60 transition-all duration-200 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Built with React + Express + MongoDB
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              All systems operational
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;