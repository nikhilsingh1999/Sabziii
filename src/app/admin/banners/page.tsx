"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CldUploadWidget } from "next-cloudinary";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Loader2, 
  AlertCircle, 
  X, 
  CheckCircle2, 
  ImageIcon, 
  Link as LinkIcon,
  Image as LucideImage
} from "lucide-react";

interface Banner {
  id: string;
  title: string;
  link: string;
  imageUrl: string;
  active: boolean;
}

// Zod Schema for validation
const bannerSchema = z.object({
  title: z.string().min(2, "Banner title must be at least 2 characters"),
  link: z.string().min(1, "Target link is required (e.g., /shop)"),
  imageUrl: z.string().min(1, "Please upload or specify an image URL"),
  active: z.boolean()
});

type BannerFormValues = z.infer<typeof bannerSchema>;

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form edit state controller
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "",
      link: "/shop",
      imageUrl: "",
      active: true
    }
  });

  const watchImageUrl = watch("imageUrl");

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/banners");
      const data = await res.json();
      if (res.ok && data.success) {
        setBanners(data.banners || []);
      } else {
        throw new Error(data.error || "Failed to load banners");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to retrieve banner catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleEditClick = (banner: Banner) => {
    setEditingBanner(banner);
    reset({
      title: banner.title,
      link: banner.link,
      imageUrl: banner.imageUrl,
      active: banner.active
    });
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setEditingBanner(null);
    reset({
      title: "",
      link: "/shop",
      imageUrl: "",
      active: true
    });
  };

  const onSubmitForm = async (values: BannerFormValues) => {
    setError(null);
    setSuccess(null);

    const payload = {
      ...values,
      ...(editingBanner && { id: editingBanner.id })
    };

    try {
      const response = await fetch("/api/banners", {
        method: editingBanner ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(editingBanner ? "Banner updated successfully!" : "Banner created successfully!");
        handleCancelEdit();
        fetchBanners();
      } else {
        setError(data.error || "Failed to save banner details.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to execute request.");
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero banner? This action is irreversible.")) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/banners?id=${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("Banner deleted successfully!");
        fetchBanners();
      } else {
        setError(data.error || "Failed to delete banner.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to execute delete request.");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-left">
      
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
        
        {/* Editor Form Panel (4 Columns) */}
        <section className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-sans font-extrabold text-sm uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <LucideImage className="w-4.5 h-4.5 text-primary" />
              <span>{editingBanner ? "Edit Hero Banner" : "Create Hero Banner"}</span>
            </h3>
            {editingBanner && (
              <button 
                onClick={handleCancelEdit}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Cancel edit"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            {/* Banner Title */}
            <div className="space-y-1">
              <label htmlFor="banner-title" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Banner Title
              </label>
              <input
                type="text"
                id="banner-title"
                placeholder="e.g. Free Dhaniya with every order"
                {...register("title")}
                className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary bg-slate-50/50 ${
                  errors.title ? "border-red-300 focus:border-red-500" : "border-slate-200"
                }`}
              />
              {errors.title && <p className="text-red-500 text-[10px] font-bold">{errors.title.message}</p>}
            </div>

            {/* Target Link */}
            <div className="space-y-1">
              <label htmlFor="banner-link" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Navigation Link (Click target)
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="banner-link"
                  placeholder="/shop or /categories/vegetables"
                  {...register("link")}
                  className={`w-full pl-8 pr-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary bg-slate-50/50 ${
                    errors.link ? "border-red-300 focus:border-red-500" : "border-slate-200"
                  }`}
                />
                <LinkIcon className="absolute left-2.5 top-3 w-4 h-4 text-slate-400" />
              </div>
              {errors.link && <p className="text-red-500 text-[10px] font-bold">{errors.link.message}</p>}
            </div>

            {/* Cloudinary Image Picker */}
            <div className="space-y-3 bg-slate-50 border border-slate-200/60 rounded-xl p-4">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Select Slide Image
              </span>
              
              <div className="flex gap-4 items-center">
                {/* Preview Thumbnail */}
                <div className="w-20 h-14 bg-white border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center shrink-0 relative">
                  {watchImageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={watchImageUrl} 
                      alt="Slide preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-300" />
                  )}
                </div>

                {/* Cloudinary Upload Trigger */}
                <div className="space-y-1 text-left flex-grow">
                  <CldUploadWidget
                    uploadPreset="products"
                    onSuccess={(result: any) => {
                      if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
                        setValue("imageUrl", result.info.secure_url, { shouldValidate: true });
                      }
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="px-3 py-1.5 rounded-full border border-slate-300 hover:border-primary hover:text-primary bg-white text-[10px] font-extrabold flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                        <span>Upload Image</span>
                      </button>
                    )}
                  </CldUploadWidget>
                </div>
              </div>

              {/* Manual URL fallback */}
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="https://example.com/banner.jpg"
                  {...register("imageUrl")}
                  className={`w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none focus:border-primary bg-white ${
                    errors.imageUrl ? "border-red-300 focus:border-red-500" : "border-slate-200"
                  }`}
                />
                {errors.imageUrl && <p className="text-red-500 text-[10px] font-bold">{errors.imageUrl.message}</p>}
              </div>
            </div>

            {/* Active Toggle Switch */}
            <div className="flex items-center gap-2 py-1.5">
              <input
                type="checkbox"
                id="banner-active"
                {...register("active")}
                className="w-4.5 h-4.5 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
              />
              <label htmlFor="banner-active" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                Active & Enabled (Visible on Homepage)
              </label>
            </div>

            {/* CTA Submit Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-grow py-2.5 rounded-full bg-primary hover:bg-primary-container text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all duration-300 disabled:opacity-75 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4.5 h-4.5" />
                    <span>{editingBanner ? "Update Slide" : "Add Slide"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Banners Grid List (8 Columns) */}
        <section className="lg:col-span-8 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-sans font-extrabold text-base text-slate-800">Banner Slider Assets</h3>
            <p className="text-slate-400 text-xs font-medium">Banners currently available for the storefront homepage carousel</p>
          </div>

          {/* Table list */}
          <div className="overflow-x-auto border border-slate-100 rounded-lg">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">Slide Image Preview</th>
                  <th className="px-5 py-3.5">Title</th>
                  <th className="px-5 py-3.5">Target link</th>
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
                        <span>Loading banners catalog...</span>
                      </div>
                    </td>
                  </tr>
                ) : banners.length > 0 ? (
                  banners.map((ban) => (
                    <tr key={ban.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Image Thumbnail */}
                      <td className="px-5 py-3">
                        <div className="w-24 h-12 bg-slate-100 border border-slate-200 rounded overflow-hidden relative flex items-center justify-center">
                          {ban.imageUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img 
                              src={ban.imageUrl} 
                              alt={ban.title} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </td>

                      {/* Title */}
                      <td className="px-5 py-4 font-sans font-bold text-slate-700 max-w-[150px] truncate">{ban.title}</td>
                      
                      {/* Link */}
                      <td className="px-5 py-4 font-mono text-[10px] text-slate-500">{ban.link}</td>
                      
                      {/* Status badge */}
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${
                          ban.active 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-slate-50 text-slate-500 border-slate-100"
                        }`}>
                          {ban.active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="px-5 py-4 text-right space-x-1.5 shrink-0">
                        <button
                          onClick={() => handleEditClick(ban)}
                          className="p-1.5 rounded-lg border border-slate-100 hover:bg-primary/5 hover:text-primary text-slate-500 transition-colors cursor-pointer"
                          title="Edit Banner"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(ban.id)}
                          className="p-1.5 rounded-lg border border-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-500 transition-colors cursor-pointer"
                          title="Delete Banner"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                      No banners found in the collection. Add a new hero slide!
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
