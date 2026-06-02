"use client";

import React, { useEffect, useState } from "react";
import { 
  Warehouse, 
  Search, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Minus, 
  History, 
  X,
  TrendingUp,
  TrendingDown,
  Filter
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  stock: number;
  unit: string;
  imageUrl: string;
  active: boolean;
}

interface StockHistoryRecord {
  id: string;
  productId: string;
  productName: string;
  adjustment: number;
  previousStock: number;
  newStock: number;
  reason: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  } | string | Date;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [history, setHistory] = useState<StockHistoryRecord[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<"stock" | "history">("stock");

  // Adjustment Modal
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustType, setAdjustType] = useState<"add" | "subtract">("add");
  const [adjustQty, setAdjustQty] = useState<string>("");
  const [adjustReason, setAdjustReason] = useState("Restock (Supplier Delivery)");
  const [submittingAdjustment, setSubmittingAdjustment] = useState(false);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "in" | "low" | "out">("all");

  // Fetch initial products data
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      setError(null);
      const res = await fetch("/api/products");
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(data.products || []);
      } else {
        throw new Error(data.error || "Failed to load products");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to retrieve stock list.");
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch history data
  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      setError(null);
      const res = await fetch("/api/admin/inventory");
      const data = await res.json();
      if (res.ok && data.success) {
        setHistory(data.history || []);
      } else {
        throw new Error(data.error || "Failed to load stock history logs");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to retrieve inventory logs.");
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch log history when switching tabs
  const handleTabChange = (tab: "stock" | "history") => {
    setActiveTab(tab);
    if (tab === "history") {
      fetchHistory();
    } else {
      fetchProducts();
    }
  };

  // Open quick adjust modal
  const handleOpenAdjust = (prod: Product) => {
    setSelectedProduct(prod);
    setAdjustQty("");
    setAdjustType("add");
    setAdjustReason("Restock (Supplier Delivery)");
    setIsAdjustModalOpen(true);
    setError(null);
  };

  // Submit Stock Adjustment
  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !adjustQty || isNaN(Number(adjustQty)) || Number(adjustQty) <= 0) {
      setError("Please specify a valid quantity greater than zero.");
      return;
    }

    setSubmittingAdjustment(true);
    setError(null);
    setSuccess(null);

    const quantity = Number(adjustQty);
    const adjustmentValue = adjustType === "add" ? quantity : -quantity;

    try {
      const response = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          adjustment: adjustmentValue,
          reason: adjustReason
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(`Successfully adjusted stock for ${selectedProduct.name}!`);
        setIsAdjustModalOpen(false);
        fetchProducts(); // refresh products list
      } else {
        setError(data.error || "Failed to save stock adjustment.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to execute inventory update API.");
    } finally {
      setSubmittingAdjustment(false);
    }
  };

  // Filter products by search and stock status
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStock = true;
    if (stockFilter === "out") {
      matchesStock = prod.stock === 0;
    } else if (stockFilter === "low") {
      matchesStock = prod.stock > 0 && prod.stock <= 10;
    } else if (stockFilter === "in") {
      matchesStock = prod.stock > 10;
    }

    return matchesSearch && matchesStock;
  });

  // Render Timestamp nicely
  const formatLogDate = (timeObj: any) => {
    if (!timeObj) return "N/A";
    
    // Firestore Timestamp format check
    if (timeObj._seconds !== undefined) {
      return new Date(timeObj._seconds * 1000).toLocaleString("en-IN");
    }
    
    return new Date(timeObj).toLocaleString("en-IN");
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

      {/* Tabs Switcher Header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Warehouse className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-extrabold text-base text-slate-800">Inventory Control</h3>
            <p className="text-slate-400 text-xs font-medium">Monitor product stock levels and verify adjustments history</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-full w-full sm:w-auto">
          <button
            onClick={() => handleTabChange("stock")}
            className={`flex-grow sm:flex-none px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === "stock"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Stock Levels
          </button>
          <button
            onClick={() => handleTabChange("history")}
            className={`flex-grow sm:flex-none px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === "history"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Adjustment History
          </button>
        </div>
      </section>

      {/* STOCK TAB CONTENT */}
      {activeTab === "stock" && (
        <>
          {/* Filters Bar */}
          <section className="grid md:grid-cols-12 gap-4 items-center bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
            <div className="md:col-span-8 relative">
              <input
                type="text"
                placeholder="Search stock catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-slate-200 focus:outline-none focus:border-primary bg-slate-50/50"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>

            <div className="md:col-span-4">
              <div className="relative">
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value as any)}
                  className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 focus:outline-none focus:border-primary bg-slate-50/50 appearance-none cursor-pointer font-bold text-slate-600"
                >
                  <option value="all">All Levels</option>
                  <option value="in">In Stock (10+)</option>
                  <option value="low">Low Stock (1-10)</option>
                  <option value="out">Out of Stock (0)</option>
                </select>
                <Filter className="absolute right-4 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </section>

          {/* Current Stock Levels List */}
          <section className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto border border-slate-100 rounded-lg">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3.5">Product Name</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Current Stock</th>
                    <th className="px-5 py-3.5">Stock Status</th>
                    <th className="px-5 py-3.5 text-right">Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingProducts ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 text-primary animate-spin" />
                          <span>Loading product stock data...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((prod) => {
                      const isOutOfStock = prod.stock === 0;
                      const isLowStock = prod.stock > 0 && prod.stock <= 10;
                      
                      return (
                        <tr key={prod.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="px-5 py-4 font-sans font-bold text-slate-700">{prod.name}</td>
                          <td className="px-5 py-4 text-slate-500 font-semibold">{prod.categoryName || "Unassigned"}</td>
                          <td className="px-5 py-4 font-mono font-bold text-slate-700">
                            {prod.stock} <span className="text-[10px] text-slate-400 font-sans">{prod.unit}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                              isOutOfStock 
                                ? "bg-red-50 text-red-600 border-red-100" 
                                : isLowStock 
                                ? "bg-amber-50 text-amber-600 border-amber-100" 
                                : "bg-emerald-50 text-emerald-600 border-emerald-100"
                            }`}>
                              {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock Alert" : "In Stock"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => handleOpenAdjust(prod)}
                              className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-primary hover:text-primary bg-white text-[10px] font-extrabold shadow-sm transition-all cursor-pointer"
                            >
                              Quick Adjust
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                        No product inventories found matching filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* HISTORY TAB CONTENT */}
      {activeTab === "history" && (
        <section className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-sans font-extrabold text-sm uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <History className="w-4.5 h-4.5 text-primary" />
              <span>Stock Transaction Audit Trail</span>
            </h3>
            <button 
              onClick={fetchHistory}
              className="text-xs text-primary font-bold hover:underline cursor-pointer"
            >
              Refresh Logs
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-lg">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">Timestamp</th>
                  <th className="px-5 py-3.5">Product Name</th>
                  <th className="px-5 py-3.5">Adjustment</th>
                  <th className="px-5 py-3.5">Stock Shift</th>
                  <th className="px-5 py-3.5">Reason / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingHistory ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        <span>Loading audit logs...</span>
                      </div>
                    </td>
                  </tr>
                ) : history.length > 0 ? (
                  history.map((log) => {
                    const isPositive = log.adjustment > 0;
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-5 py-4 text-slate-500 font-medium font-mono text-[10px]">
                          {formatLogDate(log.createdAt)}
                        </td>
                        <td className="px-5 py-4 font-sans font-bold text-slate-700">{log.productName || "Unknown Product"}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 font-bold text-xs ${
                            isPositive ? "text-emerald-600" : "text-red-600"
                          }`}>
                            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                            <span>{isPositive ? `+${log.adjustment}` : log.adjustment}</span>
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500 font-medium">
                          {log.previousStock} → <span className="font-bold text-slate-700">{log.newStock}</span>
                        </td>
                        <td className="px-5 py-4 text-slate-600 italic max-w-xs truncate">{log.reason}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                      No stock adjustments have been recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Quick Adjust Dialog Modal */}
      {isAdjustModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          
          <aside className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-scale-up border border-slate-100 overflow-hidden text-left space-y-4 mx-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-sans font-extrabold text-sm uppercase tracking-wider text-slate-800">
                Adjust Stock: {selectedProduct.name}
              </h3>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick stats indicator */}
            <div className="bg-slate-50 rounded-xl p-3 flex justify-between text-xs font-bold text-slate-600">
              <span>Current Stock:</span>
              <span className="font-mono text-slate-800">{selectedProduct.stock} {selectedProduct.unit}</span>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              
              {/* Type Switcher */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Adjustment Type</span>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setAdjustType("add")}
                    className={`py-2 rounded-md text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      adjustType === "add"
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add/Replenish</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType("subtract")}
                    className={`py-2 rounded-md text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      adjustType === "subtract"
                        ? "bg-white text-red-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Reduce/Wastage</span>
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-1">
                <label htmlFor="adjust-qty" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Quantity ({selectedProduct.unit})
                </label>
                <input
                  type="number"
                  id="adjust-qty"
                  placeholder={`Amount in ${selectedProduct.unit}`}
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  min="1"
                  required
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary bg-slate-50/50"
                />
              </div>

              {/* Predefined Reasons */}
              <div className="space-y-1">
                <label htmlFor="adjust-reason" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Reason for Adjustment
                </label>
                <select
                  id="adjust-reason"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary bg-slate-50/50 cursor-pointer"
                >
                  {adjustType === "add" ? (
                    <>
                      <option value="Restock (Supplier Delivery)">Restock (Supplier Delivery)</option>
                      <option value="Customer Return">Customer Return</option>
                      <option value="Inventory Audit Count correction">Inventory Audit Count correction</option>
                      <option value="Other Addition">Other Addition</option>
                    </>
                  ) : (
                    <>
                      <option value="Wastage (Spoiled/Damaged)">Wastage (Spoiled/Damaged)</option>
                      <option value="Customer Order Fulfillment">Customer Order Fulfillment</option>
                      <option value="Inventory Audit Count correction">Inventory Audit Count correction</option>
                      <option value="Other Reduction">Other Reduction</option>
                    </>
                  )}
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-slate-250 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold text-center transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAdjustment}
                  className={`flex-1 py-2.5 rounded-full text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all duration-300 cursor-pointer ${
                    adjustType === "add" 
                      ? "bg-emerald-600 hover:bg-emerald-700" 
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {submittingAdjustment ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Adjusting...</span>
                    </>
                  ) : (
                    <span>Confirm Adjustment</span>
                  )}
                </button>
              </div>
            </form>
          </aside>

        </div>
      )}

    </div>
  );
}
