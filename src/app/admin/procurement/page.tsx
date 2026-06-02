"use client";

import React, { useEffect, useState } from "react";
import { 
  FileSpreadsheet, 
  Search, 
  AlertCircle, 
  Download, 
  ArrowUpDown
} from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";
import { TableSkeleton } from "@/components/Skeletons";

interface OrderItem {
  product: {
    id: number | string;
    name: string;
    price?: number;
    unit?: string;
    isFreebie?: boolean;
  };
  quantity: number;
  isFreebie?: boolean;
}

interface Order {
  id: string;
  orderStatus: string;
  items: OrderItem[];
}

interface ProcurementItem {
  name: string;
  quantity: number;
  unit: string;
}

export default function ProcurementReportPage() {
  const adminStore = useAdminStore();
  const loading = adminStore.loadingOrders;
  const orders = adminStore.orders;
  const [error, setError] = useState<string | null>(null);
  
  // Search & Sorting state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"name" | "quantity">("quantity");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        await adminStore.fetchOrders();
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load procurement report.");
      }
    };

    fetchData();
  }, []);

  // Filter orders: Include ONLY Pending, Confirmed, Packed, Out for Delivery
  // Exclude: Delivered, Cancelled
  const activeStatuses = ["Pending", "Confirmed", "Packed", "Out For Delivery"];
  const activeOrders = orders.filter((o) => activeStatuses.includes(o.orderStatus));
  
  const productTotals: { [key: string]: ProcurementItem } = {};

  activeOrders.forEach((order) => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item) => {
        if (!item.product || !item.product.name) return;
        
        const name = item.product.name;
        const quantity = Number(item.quantity || 0);
        const unit = item.product.unit || "kg";

        // Exclude freebies (Dhaniya, Pudina, isFreebie=true, price=0)
        const isFreebie = item.isFreebie || 
                          item.product.isFreebie || 
                          String(item.product.id) === "freebie-dhaniya-mirch" ||
                          item.product.price === 0 ||
                          name.toLowerCase().includes("dhaniya") || 
                          name.toLowerCase().includes("pudina") ||
                          name.toLowerCase().includes("complimentary") ||
                          name.toLowerCase().includes("free");

        if (isFreebie) return;

        if (productTotals[name]) {
          productTotals[name].quantity += quantity;
        } else {
          productTotals[name] = {
            name,
            quantity,
            unit
          };
        }
      });
    }
  });

  const procurementData = Object.values(productTotals);

  // Filter & Sort Procurement Data
  const filteredData = procurementData
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "quantity") {
        comparison = a.quantity - b.quantity;
      }
      return sortAsc ? comparison : -comparison;
    });

  // Export report to CSV
  const handleDownloadCSV = () => {
    if (filteredData.length === 0) return;

    const headers = ["Product Name", "Total Required Quantity"];
    const csvRows = filteredData.map((item) => [
      item.name,
      `${item.quantity} ${item.unit}`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...csvRows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `procurement_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export report to Excel
  const handleDownloadExcel = () => {
    if (filteredData.length === 0) return;

    const excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Procurement Report</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          th { background-color: #f1f5f9; font-weight: bold; text-align: left; }
          td, th { border: 1px solid #e2e8f0; padding: 8px; font-family: sans-serif; }
        </style>
      </head>
      <body>
        <h2>Procurement Required Quantities Report</h2>
        <p>Generated on: ${new Date().toLocaleString("en-IN")}</p>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Total Required Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity} ${item.unit}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `procurement_report_${new Date().toISOString().split("T")[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (field: "name" | "quantity") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-left">
      
      {/* Errors */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-sm text-red-600">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="font-medium leading-relaxed">{error}</span>
        </div>
      )}

      {/* Header card */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-extrabold text-base text-slate-800">Procurement Report</h3>
            <p className="text-slate-400 text-xs font-medium">Cumulative quantity of each product across all active (non-delivered) orders</p>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleDownloadCSV}
            disabled={loading || filteredData.length === 0}
            className="flex-1 sm:flex-none px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-full flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
          
          <button
            onClick={handleDownloadExcel}
            disabled={loading || filteredData.length === 0}
            className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
        </div>
      </section>

      {/* Search Bar */}
      <section className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Search report by product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-slate-200 focus:outline-none focus:border-primary bg-slate-50/50"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>
      </section>

      {/* Report Table Card */}
      <section className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm overflow-hidden">
        {loading && orders.length === 0 ? (
          <TableSkeleton rows={5} cols={2} />
        ) : (
          <div className="overflow-x-auto border border-slate-100 rounded-lg">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100 select-none">
                <tr>
                  <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-1.5">
                      <span>Product Name</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort("quantity")}>
                    <div className="flex items-center gap-1.5">
                      <span>Total Required Quantity</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.name} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-5 py-4 font-sans font-bold text-slate-700">{item.name}</td>
                      <td className="px-5 py-4 font-mono font-bold text-slate-600 text-sm">
                        {item.quantity} <span className="text-[10px] text-slate-400 font-sans font-normal">{item.unit}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-5 py-12 text-center text-slate-400">
                      No active orders found to compile.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
      
    </div>
  );
}
