"use client";

import React, { useEffect, useState } from "react";
import { 
  Receipt, 
  Search, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  X, 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  Clock, 
  Check, 
  Truck, 
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";
import { TableSkeleton } from "@/components/Skeletons";

// Order Interface matching backend
interface OrderItem {
  product: {
    id: number | string;
    name: string;
    price: number;
    unit: string;
    image?: string;
    isFreebie?: boolean;
  };
  quantity: number;
  isFreebie?: boolean;
}

interface Order {
  id: string;
  orderId: string;
  userId: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: "COD" | "UPI";
  paymentStatus: "Pending" | "Paid";
  orderStatus: "Pending" | "Confirmed" | "Packed" | "Out For Delivery" | "Delivered" | "Cancelled";
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  } | string | Date;
}

const statusOptions = [
  { value: "Pending", label: "Pending", color: "bg-amber-50 text-amber-600 border-amber-100" },
  { value: "Confirmed", label: "Confirmed", color: "bg-blue-50 text-blue-600 border-blue-100" },
  { value: "Packed", label: "Packed", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { value: "Out For Delivery", label: "Out For Delivery", color: "bg-purple-50 text-purple-600 border-purple-100" },
  { value: "Delivered", label: "Delivered", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { value: "Cancelled", label: "Cancelled", color: "bg-red-50 text-red-600 border-red-100" }
];

export default function OrdersPage() {
  const adminStore = useAdminStore();
  const orders = adminStore.orders;
  const loading = adminStore.loadingOrders;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>("All");

  // Selected Order for Details View Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadOrders = async (force = false) => {
    try {
      setError(null);
      await adminStore.fetchOrders(force);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to retrieve order records.");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Update Status handler
  const handleUpdateStatus = async (orderId: string, nextStatus: Order["orderStatus"], paymentStatus?: Order["paymentStatus"]) => {
    setUpdatingStatus(true);
    setError(null);
    setSuccess(null);

    const payload: any = { orderId, orderStatus: nextStatus };
    if (paymentStatus) {
      payload.paymentStatus = paymentStatus;
    } else if (nextStatus === "Delivered") {
      // Automatically make it Paid on delivery
      payload.paymentStatus = "Paid";
    }

    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(`Order ${orderId} updated to ${nextStatus}!`);
        adminStore.invalidateOrders();
        adminStore.invalidateStats();
        loadOrders(true);

        // Update selected order view details
        if (selectedOrder && selectedOrder.orderId === orderId) {
          setSelectedOrder((prev) => 
            prev 
              ? { 
                  ...prev, 
                  orderStatus: nextStatus, 
                  paymentStatus: payload.paymentStatus || prev.paymentStatus 
                } 
              : null
          );
        }
      } else {
        setError(data.error || "Failed to update order status.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to execute status change request.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery);

    const matchesStatus = selectedStatusTab === "All" || order.orderStatus === selectedStatusTab;

    return matchesSearch && matchesStatus;
  });

  // Date Formatter
  const formatOrderDate = (timeObj: any) => {
    if (!timeObj) return "N/A";
    if (timeObj._seconds !== undefined) {
      return new Date(timeObj._seconds * 1000).toLocaleString("en-IN");
    }
    return new Date(timeObj).toLocaleString("en-IN");
  };

  // Quick next status logic
  const getNextStatusOptions = (current: Order["orderStatus"]) => {
    switch (current) {
      case "Pending":
        return [{ target: "Confirmed" as const, label: "Confirm Order" }];
      case "Confirmed":
        return [{ target: "Packed" as const, label: "Mark as Packed" }];
      case "Packed":
        return [{ target: "Out For Delivery" as const, label: "Dispatch Order" }];
      case "Out For Delivery":
        return [{ target: "Delivered" as const, label: "Mark as Delivered" }];
      default:
        return [];
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

      {/* Title Header */}
      <section className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
        <h3 className="font-sans font-extrabold text-base text-slate-800 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" />
          <span>Order Management</span>
        </h3>
        <p className="text-slate-400 text-xs font-medium mt-0.5">Fulfill, dispatch, and check payment status of customer orders</p>
      </section>

      {/* Orders Filter Pipeline & Search */}
      <section className="space-y-4 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
        
        {/* Search */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by Order ID, Client Name or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-slate-200 focus:outline-none focus:border-primary bg-slate-50/50"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>

        {/* Status Horizontal Tabs */}
        <div className="flex border-b border-slate-100 overflow-x-auto pb-1 scrollbar-thin">
          {["All", "Pending", "Confirmed", "Packed", "Out For Delivery", "Delivered", "Cancelled"].map((status) => {
            const isActive = selectedStatusTab === status;
            const count = status === "All" 
              ? orders.length 
              : orders.filter(o => o.orderStatus === status).length;

            return (
              <button
                key={status}
                onClick={() => setSelectedStatusTab(status)}
                className={`py-2 px-4 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  isActive 
                    ? "border-primary text-primary" 
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {status} <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-500">{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Orders Data Table */}
      <section className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm overflow-hidden">
        {loading && orders.length === 0 ? (
          <TableSkeleton rows={5} cols={7} />
        ) : (
          <div className="overflow-x-auto border border-slate-100 rounded-lg">
            <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-5 py-3.5">Placed On</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Total Amount</th>
                <th className="px-5 py-3.5">Payment</th>
                <th className="px-5 py-3.5">Fulfillment</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                      <span>Retrieving customer orders...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const statusInfo = statusOptions.find(s => s.value === order.orderStatus);
                  const isPaid = order.paymentStatus === "Paid";
                  
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-slate-700">{order.orderId}</td>
                      <td className="px-5 py-4 text-slate-500 font-medium font-mono text-[10px]">
                        {formatOrderDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-slate-700 font-bold">{order.customerName}</div>
                        <div className="text-[10px] text-slate-400">{order.phone}</div>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-700">₹{order.totalAmount}</td>
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            isPaid ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                          }`}>
                            {order.paymentStatus}
                          </span>
                          <span className="text-[9px] text-slate-400 block font-medium">via {order.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold ${
                          statusInfo?.color || "bg-slate-50 text-slate-500"
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg border border-slate-100 hover:bg-primary/5 hover:text-primary text-slate-500 transition-colors cursor-pointer inline-flex items-center gap-1 font-bold text-[10px]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Detail</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    No orders matching pipeline filter.
                  </td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Order Details Slide-over Drawer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          
          <aside className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-right overflow-hidden text-left">
            
            {/* Modal Header */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
              <div className="text-left">
                <h3 className="font-sans font-extrabold text-sm uppercase tracking-wider text-slate-800">
                  Order Details
                </h3>
                <span className="font-mono text-xs font-bold text-slate-400">{selectedOrder.orderId}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Scrollable details body */}
            <div className="flex-grow p-6 overflow-y-auto space-y-6">
              
              {/* Customer Coordinates */}
              <div className="space-y-2 bg-slate-50 border border-slate-105 rounded-xl p-4">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Customer Details</span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-bold">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium">{selectedOrder.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-700">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{selectedOrder.address}</span>
                  </div>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Items Purchased</span>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white">
                  {selectedOrder.items?.map((item, idx) => {
                    const isFreebie = item.isFreebie || item.product?.isFreebie || String(item.product?.id) === "freebie-dhaniya-mirch" || item.product?.price === 0;
                    return (
                      <div key={idx} className="flex justify-between items-center p-3 text-xs">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-slate-700">{item.product.name}</h4>
                            {isFreebie && (
                              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 px-1.5 py-0.5 rounded text-[8px] font-bold">
                                FREE
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {isFreebie ? "Complimentary Item" : `₹${item.product.price} / ${item.product.unit}`}
                          </p>
                        </div>
                        <div className="text-right font-mono font-bold text-slate-600">
                          <span>{item.quantity} × </span>
                          <span className={isFreebie ? "text-emerald-600 font-bold" : "text-slate-800"}>
                            {isFreebie ? "FREE" : `₹${item.product.price * item.quantity}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order pricing summary */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500 font-semibold">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-semibold">
                  <span>Delivery Charge</span>
                  <span>₹{selectedOrder.deliveryCharge}</span>
                </div>
                <div className="h-px bg-slate-200/60 my-1" />
                <div className="flex justify-between text-sm font-extrabold text-slate-800">
                  <span>Total Amount</span>
                  <span>₹{selectedOrder.totalAmount}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="flex justify-between items-center text-xs p-4 border border-slate-100 rounded-xl bg-white">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span className="font-bold text-slate-600">Payment:</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-700 mr-2">{selectedOrder.paymentMethod}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedOrder.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                  }`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Status progression actions */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Fulfillment Actions</span>
                
                {/* Next Quick Action buttons */}
                {selectedOrder.orderStatus !== "Delivered" && selectedOrder.orderStatus !== "Cancelled" ? (
                  <div className="space-y-2">
                    {getNextStatusOptions(selectedOrder.orderStatus).map((opt) => (
                      <button
                        key={opt.target}
                        onClick={() => handleUpdateStatus(selectedOrder.orderId, opt.target)}
                        disabled={updatingStatus}
                        className="w-full py-2.5 rounded-full bg-primary hover:bg-primary-container text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        {updatingStatus ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <span>{opt.label}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    ))}
                    
                    {/* Secondary helper statuses */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {/* Mark paid manually */}
                      {selectedOrder.paymentStatus !== "Paid" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(selectedOrder.orderId, selectedOrder.orderStatus, "Paid")}
                          disabled={updatingStatus}
                          className="py-2 rounded-full border border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Paid</span>
                        </button>
                      )}
                      
                      {/* Cancel order button */}
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(selectedOrder.orderId, "Cancelled")}
                        disabled={updatingStatus}
                        className="py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer ml-auto w-full"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Cancel Order</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-3 bg-slate-50 rounded-xl">
                    <span className="text-xs font-bold text-slate-500">
                      Order is complete with status: <span className="text-primary">{selectedOrder.orderStatus}</span>
                    </span>
                  </div>
                )}
              </div>

            </div>

          </aside>

          {/* Backdrop closer click */}
          <div className="flex-grow h-full" onClick={() => setSelectedOrder(null)} />
        </div>
      )}

    </div>
  );
}
