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
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl rounded-3xl shadow-2xl shadow-blue-900/60 p-6 md:p-8 space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                MERN Pipeline CRUD
              </h1>
            </div>
            <p className="text-xs md:text-sm text-slate-400">
              Manage your tasks with a React UI, Express API and MongoDB.
            </p>
          </div>
          <div className="flex flex-col items-start justify-end gap-2 text-xs md:items-end">
            <div className="inline-flex items-center gap-2 text-emerald-300">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.45)]" />
              Live API
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[11px] text-slate-200">
                Total: <span className="font-semibold">{totalCount}</span>
              </span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-400/60 px-2 py-0.5 text-[11px] text-emerald-200">
                Completed:{" "}
                <span className="font-semibold">{completedCount}</span>
              </span>
              <span className="rounded-full bg-amber-500/10 border border-amber-400/60 px-2 py-0.5 text-[11px] text-amber-200">
                Pending: <span className="font-semibold">{pendingCount}</span>
              </span>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-[1.05fr_minmax(0,1fr)] gap-4 md:gap-6">
          {/* Form */}
          <section className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 md:p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-medium">
                  {activeId ? "Edit item" : "Add new item"}
                </h2>
                
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full border border-emerald-400/50 text-emerald-200 bg-emerald-500/10">
                Form
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Title <span className="text-rose-300">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Ship the next feature..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm outline-none ring-0 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Add a bit more context for your task."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm outline-none ring-0 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded-full border border-slate-600/80">
                  Mode: {activeId ? "Edit existing" : "Create new"}
                </span>
                {saving && (
                  <div className="inline-flex items-center gap-1.5 text-slate-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                    Saving…
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                {activeId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center rounded-full border border-slate-600 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800/90 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-lg shadow-blue-900/50 hover:from-blue-400 hover:to-emerald-300 disabled:opacity-70 cursor-pointer"
                >
                  {activeId ? "Update item" : "Add item"}
                </button>
              </div>
            </form>

            {error && (
              <p className="text-xs text-rose-300 bg-rose-950/40 border border-rose-500/40 rounded-xl px-3 py-2 mt-1">
                {error}
              </p>
            )}
          </section>

          {/* List */}
          <section className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 md:p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-medium">Items</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Tap a row to edit. Use actions on the right to complete or
                  delete.
                </p>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full border border-sky-400/60 text-sky-200 bg-sky-500/10">
                MongoDB
              </span>
            </div>

            <div className="space-y-2 mt-2 max-h-[360px] overflow-y-auto pr-1">
              {loading && (
                <div className="text-xs text-slate-400 py-4 text-center">
                  Loading items…
                </div>
              )}
              {!loading && items.length === 0 && (
                <div className="text-xs text-slate-400 py-4 text-center border border-dashed border-slate-700 rounded-xl">
                  No items yet. Create your first task on the left.
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
                      type="button"
                      onClick={() => handleSelect(item)}
                      className={`w-full text-left rounded-xl border px-3 py-2.5 flex gap-3 items-start transition ${
                        active
                          ? "border-emerald-400/80 bg-emerald-500/10"
                          : "border-slate-700 bg-slate-900/70 hover:border-blue-400/80 hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-medium truncate ${
                              item.completed
                                ? "line-through text-slate-400"
                                : "text-slate-50"
                            }`}
                          >
                            {item.title}
                          </p>
                        </div>
                        {item.description && (
                          <p className="mt-0.5 text-xs text-slate-400 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border ${
                              item.completed
                                ? "border-emerald-400/80 text-emerald-200 bg-emerald-500/10"
                                : "border-slate-500/80 text-slate-200 bg-slate-800/80"
                            }`}
                          >
                            {item.completed ? "Completed" : "Pending"}
                          </span>
                          {created && (
                            <span className="text-[10px] text-slate-400">
                              Created{" "}
                              {created.toLocaleDateString()}{" "}
                              {created.toLocaleTimeString()}
                            </span>
                          )}
                          {updated && (
                            <span className="text-[10px] text-slate-500">
                              • Updated{" "}
                              {updated.toLocaleDateString()}{" "}
                              {updated.toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleToggle(item, e)}
                          className="text-[11px] rounded-full border border-slate-600 bg-slate-900/80 px-2.5 py-1 text-slate-100 hover:bg-slate-800/90 cursor-pointer"
                        >
                          {item.completed ? "Reopen" : "Done"}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(item._id, e)}
                          className="text-[11px] rounded-full border border-rose-500/70 bg-rose-500/10 px-2.5 py-1 text-rose-100 hover:bg-rose-500/20 cursor-pointer"
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
      </div>
    </div>
  );
}

export default App;
