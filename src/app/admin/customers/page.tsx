"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpDown,
  ShoppingBag,
  DollarSign,
  Award
} from "lucide-react";

import { useAdminStore } from "@/store/useAdminStore";
import { TableSkeleton } from "@/components/Skeletons";

interface Customer {
  userId: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpending: number;
}

type SortField = "name" | "totalOrders" | "totalSpending";
type SortOrder = "asc" | "desc";

export default function CustomersPage() {
  const adminStore = useAdminStore();
  const loading = adminStore.loadingCustomers;
  const customers = adminStore.customers;
  const [error, setError] = useState<string | null>(null);

  // Search & Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("totalSpending");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        await adminStore.fetchCustomers();
      } catch (err: any) {
        setError(err.message || "Failed to load customers.");
      }
    };
    load();
  }, []);

  // Sort toggle handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc"); // Default to desc for numeric, can toggle
    }
  };

  // Filter and sort customer list
  const processedCustomers = customers
    .filter((cust) => {
      return (
        cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cust.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cust.phone.includes(searchQuery)
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else {
        comparison = a[sortField] - b[sortField];
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Calculate quick metrics
  const totalCustomerCount = processedCustomers.length;
  const totalRevenue = processedCustomers.reduce((acc, c) => acc + c.totalSpending, 0);
  const averageSpend = totalCustomerCount > 0 ? parseFloat((totalRevenue / totalCustomerCount).toFixed(2)) : 0;
  
  // Find top spending customer
  const topSpender = processedCustomers.length > 0 
    ? [...processedCustomers].sort((a, b) => b.totalSpending - a.totalSpending)[0]
    : null;

  if (loading && customers.length === 0) {
    return <TableSkeleton rows={5} cols={5} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-left">
      
      {/* Errors notice */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-sm text-red-600">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="font-medium leading-relaxed">{error}</span>
        </div>
      )}

      {/* Title Header */}
      <section className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
        <h3 className="font-sans font-extrabold text-base text-slate-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <span>Customer Registry</span>
        </h3>
        <p className="text-slate-400 text-xs font-medium mt-0.5">Analyze customer purchasing profiles, order counts, and values</p>
      </section>

      {/* Aggregate Cards */}
      <section className="grid sm:grid-cols-3 gap-4">
        {/* Total Registered Customers */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Customer Base</span>
            <span className="font-sans font-extrabold text-2xl text-slate-800">{totalCustomerCount}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Avg Spend per Customer */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Average Cust Value (LTV)</span>
            <span className="font-sans font-extrabold text-2xl text-slate-800">₹{averageSpend}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Top Spender */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1 overflow-hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block truncate">Premium Shopper</span>
            <span className="font-sans font-extrabold text-sm text-slate-800 truncate block">
              {topSpender ? `${topSpender.name} (₹${topSpender.totalSpending})` : "None"}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center font-bold text-sm shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Search Input Bar */}
      <section className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by customer name, email or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-slate-200 focus:outline-none focus:border-primary bg-slate-50/50"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>
      </section>

      {/* Customer Database List */}
      <section className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto border border-slate-100 rounded-lg">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100 select-none">
              <tr>
                <th className="px-5 py-3.5">Customer Name</th>
                <th className="px-5 py-3.5">Contact coordinates</th>
                
                {/* Sortable Header: Orders */}
                <th 
                  className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort("totalOrders")}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Total Orders</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>

                {/* Sortable Header: Spendings */}
                <th 
                  className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort("totalSpending")}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Total Spending</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>

                <th className="px-5 py-3.5">Average Order Value (AOV)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                      <span>Loading customer list...</span>
                    </div>
                  </td>
                </tr>
              ) : processedCustomers.length > 0 ? (
                processedCustomers.map((cust) => {
                  const initials = cust.name ? cust.name.substring(0, 2).toUpperCase() : "US";
                  const aov = cust.totalOrders > 0 ? parseFloat((cust.totalSpending / cust.totalOrders).toFixed(2)) : 0;
                  
                  return (
                    <tr key={cust.userId} className="hover:bg-slate-50/40 transition-colors">
                      {/* Avatar Profile name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                            {initials}
                          </div>
                          <div className="font-sans font-bold text-slate-700">{cust.name || "Anonymous"}</div>
                        </div>
                      </td>
                      
                      {/* Email and phone */}
                      <td className="px-5 py-4">
                        <div className="text-slate-600 font-semibold">{cust.phone || "N/A"}</div>
                        {cust.email && <div className="text-[10px] text-slate-400 font-mono">{cust.email}</div>}
                      </td>

                      {/* Orders */}
                      <td className="px-5 py-4 font-mono font-bold text-slate-600">
                        {cust.totalOrders}
                      </td>

                      {/* Total Spending */}
                      <td className="px-5 py-4 font-bold text-slate-700">
                        ₹{cust.totalSpending}
                      </td>

                      {/* Calculated AOV */}
                      <td className="px-5 py-4 font-bold text-slate-500">
                        ₹{aov}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    No customers found matching the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
