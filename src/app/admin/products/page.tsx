"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CldUploadWidget } from "next-cloudinary";
import { 
  ShoppingBag, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Loader2, 
  AlertCircle, 
  X, 
  CheckCircle2, 
  ImageIcon, 
  Filter,
  Eye,
  DollarSign,
  Package
} from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";
import { TableSkeleton } from "@/components/Skeletons";

// Product Type matching ProductData in admin-service
interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  description: string;
  price: number;
  discountPrice: number;
  stock: number;
  unit: string;
  imageUrl: string;
  active: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  active: boolean;
}

// Zod Schema
const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  description: z.string().optional(),
  price: z.number().min(0.01, "Price must be greater than 0"),
  discountPrice: z.number().min(0, "Discount price cannot be negative"),
  stock: z.number().min(0, "Stock cannot be negative"),
  unit: z.string().min(1, "Unit is required (e.g., kg, g, pack, piece)"),
  imageUrl: z.string().min(1, "Please upload or provide an image URL"),
  active: z.boolean()
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const adminStore = useAdminStore();

  // Modal Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");

  // React Hook Form Configuration
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      categoryId: "",
      description: "",
      price: 0,
      discountPrice: 0,
      stock: 0,
      unit: "kg",
      imageUrl: "",
      active: true
    }
  });

  const watchName = watch("name");
  const watchImageUrl = watch("imageUrl");

  // Fetch initial data
  const loadData = async (force = false) => {
    try {
      setLoading(true);
      setError(null);

      // Load products and categories concurrently using cache store
      const [prodData, catData] = await Promise.all([
        adminStore.fetchProducts(force),
        adminStore.fetchCategories(force)
      ]);

      setProducts(prodData || []);
      setCategories(catData || []);
    } catch (err: any) {
      console.error("Fetch data error:", err);
      setError(err.message || "Failed to retrieve database entries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auto-generate slug from name
  useEffect(() => {
    if (watchName && !editingProduct) {
      const generatedSlug = watchName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [watchName, editingProduct, setValue]);

  // Open modal to create a new product
  const handleCreateOpen = () => {
    setEditingProduct(null);
    reset({
      name: "",
      slug: "",
      categoryId: categories.length > 0 ? categories[0].id : "",
      description: "",
      price: 0,
      discountPrice: 0,
      stock: 0,
      unit: "kg",
      imageUrl: "",
      active: true
    });
    setIsModalOpen(true);
    setError(null);
  };

  // Open modal to edit an existing product
  const handleEditOpen = (product: Product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      slug: product.slug,
      categoryId: product.categoryId,
      description: product.description || "",
      price: product.price,
      discountPrice: product.discountPrice || 0,
      stock: product.stock || 0,
      unit: product.unit || "kg",
      imageUrl: product.imageUrl || "",
      active: product.active
    });
    setIsModalOpen(true);
    setError(null);
  };

  // Form submit handler
  const onSubmitForm = async (values: ProductFormValues) => {
    setError(null);
    setSuccess(null);

    // Fetch the category name to store in the product document
    const selectedCategory = categories.find(c => c.id === values.categoryId);
    const categoryName = selectedCategory ? selectedCategory.name : "";

    const payload = {
      ...values,
      categoryName,
      // If editing, append the ID
      ...(editingProduct && { id: editingProduct.id })
    };

    try {
      const response = await fetch("/api/products", {
        method: editingProduct ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(editingProduct ? "Product updated successfully!" : "Product created successfully!");
        setIsModalOpen(false);
        adminStore.invalidateProducts();
        loadData(true);
      } else {
        setError(data.error || "Failed to save product.");
      }
    } catch (err) {
      console.error("Save product error:", err);
      setError("Failed to process API request.");
    }
  };

  // Delete product handler
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action is permanent and cannot be undone.")) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("Product deleted successfully!");
        adminStore.invalidateProducts();
        loadData(true);
      } else {
        setError(data.error || "Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete product error:", err);
      setError("Failed to execute product deletion API request.");
    }
  };

  // Filtered Products List
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategoryFilter === "all" || prod.categoryId === selectedCategoryFilter;
    
    const matchesStatus = selectedStatusFilter === "all" || 
                          (selectedStatusFilter === "active" && prod.active) || 
                          (selectedStatusFilter === "inactive" && !prod.active);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-left">
      
      {/* Alert Notices */}
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

      {/* Control Actions Header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
        <div>
          <h3 className="font-sans font-extrabold text-base text-slate-800 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <span>Product Catalog</span>
          </h3>
          <p className="text-slate-400 text-xs font-medium mt-0.5">Manage products, pricing, stock levels, and active offerings</p>
        </div>
        <button
          onClick={handleCreateOpen}
          className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all duration-300 cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add New Product</span>
        </button>
      </section>

      {/* Filter and Search Section */}
      <section className="grid md:grid-cols-12 gap-4 items-center bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <input
            type="text"
            placeholder="Search by name, slug or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-slate-200 focus:outline-none focus:border-primary bg-slate-50/50"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>

        {/* Category Filter */}
        <div className="md:col-span-3">
          <div className="relative">
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-full border border-slate-200 focus:outline-none focus:border-primary bg-slate-50/50 appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <Filter className="absolute right-3.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <div className="relative">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-full border border-slate-200 focus:outline-none focus:border-primary bg-slate-50/50 appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
            <Filter className="absolute right-3.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Products Table Display */}
      <section className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm overflow-hidden">
        {loading ? (
          <TableSkeleton rows={8} cols={6} />
        ) : (
          <div className="overflow-x-auto border border-slate-100 rounded-lg">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">Product Details</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Price & Unit</th>
                  <th className="px-5 py-3.5">Stock</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/40 transition-colors">
                      {/* Details with image */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-100 border border-slate-150 rounded-lg overflow-hidden shrink-0 relative flex items-center justify-center">
                            {prod.imageUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img 
                                src={prod.imageUrl} 
                                alt={prod.name} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="font-sans font-bold text-slate-700 truncate max-w-[180px] sm:max-w-xs">{prod.name}</h4>
                            <span className="text-[10px] text-slate-400 font-mono truncate block">{prod.slug}</span>
                          </div>
                        </div>
                      </td>
                      {/* Category name */}
                      <td className="px-5 py-3.5 text-slate-600 font-semibold">{prod.categoryName || "Unassigned"}</td>
                      {/* Price and units */}
                      <td className="px-5 py-3.5">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-700">₹{prod.discountPrice || prod.price}</span>
                          {prod.discountPrice > 0 && prod.discountPrice < prod.price && (
                            <span className="text-[10px] text-slate-400 line-through ml-1">₹{prod.price}</span>
                          )}
                          <span className="text-[10px] text-slate-400 block font-medium">per {prod.unit}</span>
                        </div>
                      </td>
                      {/* Stock */}
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-600">
                        {prod.stock} <span className="text-[10px] font-sans font-normal text-slate-400">{prod.unit}</span>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${
                          prod.active 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-slate-50 text-slate-500 border-slate-100"
                        }`}>
                          {prod.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    {/* Action buttons */}
                    <td className="px-5 py-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => handleEditOpen(prod)}
                        className="p-1.5 rounded-lg border border-slate-100 hover:bg-primary/5 hover:text-primary text-slate-500 transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 rounded-lg border border-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-500 transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    No products found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Create / Edit Slide-over Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          
          {/* Modal content shell */}
          <aside className="w-full max-w-lg bg-white h-full flex flex-col shadow-2xl animate-slide-right overflow-hidden">
            
            {/* Modal Header */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
              <h3 className="font-sans font-extrabold text-sm uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <ShoppingBag className="w-4.5 h-4.5 text-primary" />
                <span>{editingProduct ? "Modify Product Details" : "Create New Product"}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSubmit(onSubmitForm)} className="flex-grow flex flex-col justify-between overflow-hidden">
              <div className="flex-grow p-6 overflow-y-auto space-y-4">
                
                {/* Product Name */}
                <div className="space-y-1">
                  <label htmlFor="prod-name" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="prod-name"
                    placeholder="e.g. Fresh Red Onions"
                    {...register("name")}
                    className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary bg-slate-50/50 ${
                      errors.name ? "border-red-300 focus:border-red-500" : "border-slate-200"
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-[10px] font-bold">{errors.name.message}</p>}
                </div>

                {/* Slug */}
                <div className="space-y-1">
                  <label htmlFor="prod-slug" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    URL Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="prod-slug"
                    placeholder="e.g. fresh-red-onions"
                    {...register("slug")}
                    className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary bg-slate-50/50 ${
                      errors.slug ? "border-red-300 focus:border-red-500" : "border-slate-200"
                    }`}
                  />
                  {errors.slug && <p className="text-red-500 text-[10px] font-bold">{errors.slug.message}</p>}
                </div>

                {/* Category & Unit (Flex Row) */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Category Selector */}
                  <div className="space-y-1">
                    <label htmlFor="prod-category" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="prod-category"
                      {...register("categoryId")}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary bg-slate-50/50 cursor-pointer ${
                        errors.categoryId ? "border-red-300 focus:border-red-500" : "border-slate-200"
                      }`}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {errors.categoryId && <p className="text-red-500 text-[10px] font-bold">{errors.categoryId.message}</p>}
                  </div>

                  {/* Pricing Unit */}
                  <div className="space-y-1">
                    <label htmlFor="prod-unit" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Pricing Unit <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="prod-unit"
                      placeholder="e.g. kg, g, pack, bundle"
                      {...register("unit")}
                      className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary bg-slate-50/50 ${
                        errors.unit ? "border-red-300 focus:border-red-500" : "border-slate-200"
                      }`}
                    />
                    {errors.unit && <p className="text-red-500 text-[10px] font-bold">{errors.unit.message}</p>}
                  </div>
                </div>

                {/* Price, Discount Price, Stock (Three columns) */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Regular Price */}
                  <div className="space-y-1">
                    <label htmlFor="prod-price" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        id="prod-price"
                        placeholder="0.00"
                        {...register("price", { valueAsNumber: true })}
                        className={`w-full pl-6 pr-2 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary bg-slate-50/50 ${
                          errors.price ? "border-red-300 focus:border-red-500" : "border-slate-200"
                        }`}
                      />
                      <span className="absolute left-2.5 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                    </div>
                    {errors.price && <p className="text-red-500 text-[10px] font-bold">{errors.price.message}</p>}
                  </div>

                  {/* Discount Price */}
                  <div className="space-y-1">
                    <label htmlFor="prod-discount" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Discount Price
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        id="prod-discount"
                        placeholder="0.00"
                        {...register("discountPrice", { valueAsNumber: true })}
                        className={`w-full pl-6 pr-2 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary bg-slate-50/50 ${
                          errors.discountPrice ? "border-red-300 focus:border-red-500" : "border-slate-200"
                        }`}
                      />
                      <span className="absolute left-2.5 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                    </div>
                    {errors.discountPrice && <p className="text-red-500 text-[10px] font-bold">{errors.discountPrice.message}</p>}
                  </div>

                  {/* Current Stock */}
                  <div className="space-y-1">
                    <label htmlFor="prod-stock" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Initial Stock
                    </label>
                    <input
                      type="number"
                      id="prod-stock"
                      placeholder="0"
                      {...register("stock", { valueAsNumber: true })}
                      className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary bg-slate-50/50 ${
                        errors.stock ? "border-red-300 focus:border-red-500" : "border-slate-200"
                      }`}
                    />
                    {errors.stock && <p className="text-red-500 text-[10px] font-bold">{errors.stock.message}</p>}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label htmlFor="prod-desc" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Product Description
                  </label>
                  <textarea
                    id="prod-desc"
                    placeholder="Provide details about the source, freshness, weight details..."
                    rows={3}
                    {...register("description")}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary bg-slate-50/50"
                  />
                </div>

                {/* Image Section (Cloudinary and Fallback Manual Input) */}
                <div className="space-y-3 bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    Product Image Selection
                  </span>
                  
                  <div className="flex gap-4 items-center">
                    {/* Current preview */}
                    <div className="w-20 h-20 bg-white border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center shrink-0 relative">
                      {watchImageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img 
                          src={watchImageUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                      )}
                    </div>

                    {/* Uploader Widget Button */}
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
                            className="px-4 py-2 rounded-full border border-slate-300 hover:border-primary hover:text-primary bg-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                          >
                            <ImageIcon className="w-4 h-4 text-slate-500" />
                            <span>Upload via Cloudinary</span>
                          </button>
                        )}
                      </CldUploadWidget>
                      <p className="text-[10px] text-slate-400 font-medium">Or type/paste a custom image web URL below:</p>
                    </div>
                  </div>

                  {/* Manual URL entry field */}
                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="https://example.com/image.jpg"
                      {...register("imageUrl")}
                      className={`w-full px-3.5 py-1.5 text-xs border rounded-lg focus:outline-none focus:border-primary bg-white ${
                        errors.imageUrl ? "border-red-300 focus:border-red-500" : "border-slate-200"
                      }`}
                    />
                    {errors.imageUrl && <p className="text-red-500 text-[10px] font-bold">{errors.imageUrl.message}</p>}
                  </div>
                </div>

                {/* Active check toggle */}
                <div className="flex items-center gap-2.5 py-1">
                  <input
                    type="checkbox"
                    id="prod-active"
                    {...register("active")}
                    className="w-5 h-5 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                  />
                  <label htmlFor="prod-active" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                    Publish immediately (Show on Storefront)
                  </label>
                </div>

              </div>

              {/* Form Actions Footer */}
              <footer className="p-6 border-t border-slate-100 bg-slate-50 flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-grow py-2.5 rounded-full border border-slate-200 bg-white text-slate-600 text-xs font-bold text-center hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
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
                      <span>{editingProduct ? "Update Product" : "Create Product"}</span>
                    </>
                  )}
                </button>
              </footer>
            </form>
          </aside>

          {/* Backdrop click closer */}
          <div className="flex-grow h-full" onClick={() => setIsModalOpen(false)} />
        </div>
      )}

    </div>
  );
}
