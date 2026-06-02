"use client";

import React, { useEffect, useState } from "react";
import { 
  Tag, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Loader2, 
  AlertCircle,
  X,
  CheckCircle2
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = async () => {
    try {
      setError(null);
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (response.ok && data.success) {
        setCategories(data.categories || []);
      } else {
        setError(data.error || "Failed to load categories.");
      }
    } catch (err: any) {
      setError("Failed to communicate with categories API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  const handleEditClick = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setActive(cat.active);
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setActive(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required fields.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const url = "/api/categories";
      const method = editingId ? "PUT" : "POST";
      const payload = editingId 
        ? { id: editingId, name, slug, active, description }
        : { name, slug, active, description };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(editingId ? "Category updated successfully!" : "Category created successfully!");
        handleCancelEdit();
        fetchCategories();
      } else {
        setError(data.error || "Failed to save category.");
      }
    } catch (err) {
      setError("Failed to execute category API request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This will not delete associated products, but they will be unassigned.")) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      const response = await fetch(`/api/categories?id=${id}`, {
        method: "DELETE"
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("Category deleted successfully!");
        fetchCategories();
      } else {
        setError(data.error || "Failed to delete category.");
      }
    } catch (err) {
      setError("Failed to execute delete request.");
    }
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-sm text-red-600">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="font-medium leading-relaxed">{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-sm text-emerald-600">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="font-medium leading-relaxed">{success}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Editor Form Sidebar */}
        <section className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-sans font-extrabold text-sm uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Tag className="w-4.5 h-4.5 text-primary" />
              <span>{editingId ? "Edit Category" : "Create Category"}</span>
            </h3>
            {editingId && (
              <button 
                onClick={handleCancelEdit}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Cancel edit"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Category Name */}
            <div className="space-y-1">
              <label htmlFor="cat-name" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Category Name
              </label>
              <input
                type="text"
                id="cat-name"
                placeholder="e.g. Fresh Herbs"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary bg-slate-50/50"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1">
              <label htmlFor="cat-slug" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                URL Slug
              </label>
              <input
                type="text"
                id="cat-slug"
                placeholder="e.g. fresh-herbs"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary bg-slate-50/50"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label htmlFor="cat-desc" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Description
              </label>
              <textarea
                id="cat-desc"
                placeholder="Brief description about this category..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={submitting}
                rows={3}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary bg-slate-50/50"
              />
            </div>

            {/* Status (Active Checkbox) */}
            <div className="flex items-center gap-2 py-1.5">
              <input
                type="checkbox"
                id="cat-active"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                disabled={submitting}
                className="w-4.5 h-4.5 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
              />
              <label htmlFor="cat-active" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                Active & Enabled
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-grow py-2.5 rounded-full bg-primary hover:bg-primary-container text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all duration-300 disabled:opacity-75 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4.5 h-4.5" />
                    <span>{editingId ? "Update Category" : "Add Category"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Data Table list (8 Columns) */}
        <section className="lg:col-span-8 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="text-left">
              <h3 className="font-sans font-extrabold text-base text-slate-800">Category Catalog</h3>
              <p className="text-slate-400 text-xs font-medium">All item categories currently defined</p>
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full border border-slate-200 focus:outline-none focus:border-primary bg-slate-50/50"
              />
              <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-lg">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">Category Name</th>
                  <th className="px-5 py-3.5">Description</th>
                  <th className="px-5 py-3.5">Slug</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4.5 h-4.5 text-primary animate-spin" />
                        <span>Loading category records...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 font-sans font-bold text-slate-700">{cat.name}</td>
                      <td className="px-5 py-4 text-slate-500 max-w-[200px] truncate">{cat.description || "-"}</td>
                      <td className="px-5 py-4 text-slate-500 font-mono text-[11px]">{cat.slug}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${
                          cat.active 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-slate-50 text-slate-500 border-slate-100"
                        }`}>
                          {cat.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right space-x-1.5 shrink-0">
                        <button
                          onClick={() => handleEditClick(cat)}
                          className="p-1.5 rounded-lg border border-slate-100 hover:bg-primary/5 hover:text-primary text-slate-500 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(cat.id)}
                          className="p-1.5 rounded-lg border border-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-500 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                      No categories found matching your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>

    </div>
  );
}
