"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  LogOut, 
  Package, 
  Calendar,
  CheckCircle,
  Truck,
  ArrowRight
} from "lucide-react";

export default function Dashboard() {
  const { orders } = useApp();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses">("profile");

  const mockUser = {
    name: "Nikhil Kumar",
    email: "nikhil@example.com",
    phone: "+91 98765 43210",
    memberSince: "May 2026",
    avatar: "NK"
  };

  const mockAddresses = [
    { id: 1, type: "Home", name: "Nikhil Kumar", address: "Flat 405, Green Heights, Sector 45", city: "Gurugram", zip: "122003", phone: "+91 98765 43210" },
    { id: 2, type: "Office", name: "Nikhil Kumar", address: "Tower B, 10th Floor, Tech Park, Phase 2", city: "Gurugram", zip: "122008", phone: "+91 98765 43210" }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title */}
      <div>
        <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-foreground">
          My Account
        </h1>
        <p className="text-secondary text-sm">
          Manage your organic grocery delivery profile, previous order histories, and shipping locations.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Navigation Tabs */}
        <aside className="lg:col-span-3 bg-surface p-4 border border-border-color/30 rounded-lg shadow-organic space-y-2">
          
          {/* User Brief header */}
          <div className="p-3 border-b border-border-color/20 flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary text-white font-sans font-bold flex items-center justify-center text-sm shadow-md">
              {mockUser.avatar}
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm text-foreground leading-none">{mockUser.name}</h3>
              <span className="text-[10px] text-secondary font-medium mt-1 inline-block">Member since {mockUser.memberSince}</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-2.5 rounded font-sans text-sm font-bold transition-all flex items-center gap-2.5 ${
              activeTab === "profile"
                ? "bg-primary text-white"
                : "text-secondary hover:bg-surface-hover hover:text-primary"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left px-4 py-2.5 rounded font-sans text-sm font-bold transition-all flex items-center justify-between ${
              activeTab === "orders"
                ? "bg-primary text-white"
                : "text-secondary hover:bg-surface-hover hover:text-primary"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4" />
              <span>Order History</span>
            </div>
            {orders.length > 0 && (
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${activeTab === "orders" ? "bg-white text-primary" : "bg-primary/10 text-primary"}`}>
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`w-full text-left px-4 py-2.5 rounded font-sans text-sm font-bold transition-all flex items-center gap-2.5 ${
              activeTab === "addresses"
                ? "bg-primary text-white"
                : "text-secondary hover:bg-surface-hover hover:text-primary"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>

          <Link
            href="/login"
            className="w-full text-left px-4 py-2.5 rounded font-sans text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2.5 border-t border-border-color/10 mt-4"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </Link>
        </aside>

        {/* Right Side Content Area */}
        <div className="lg:col-span-9 bg-surface border border-border-color/30 rounded-lg p-6 sm:p-8 shadow-organic min-h-[400px] transition-colors">
          
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="font-sans font-extrabold text-lg text-foreground border-b border-border-color/20 pb-3">
                Profile Details
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Full Name</span>
                  <p className="font-sans font-semibold text-sm text-foreground bg-surface-hover p-2.5 rounded border border-border-color/10">
                    {mockUser.name}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Email Address</span>
                  <p className="font-sans font-semibold text-sm text-foreground bg-surface-hover p-2.5 rounded border border-border-color/10">
                    {mockUser.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Phone Number</span>
                  <p className="font-sans font-semibold text-sm text-foreground bg-surface-hover p-2.5 rounded border border-border-color/10">
                    {mockUser.phone}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Language Preference</span>
                  <p className="font-sans font-semibold text-sm text-foreground bg-surface-hover p-2.5 rounded border border-border-color/10">
                    English (India)
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-border-color/20">
                <button className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-full shadow hover:bg-primary-container">
                  Edit Profile Details
                </button>
              </div>
            </div>
          )}

          {/* Orders History Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="font-sans font-extrabold text-lg text-foreground border-b border-border-color/20 pb-3">
                Previous Orders
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <Package className="w-12 h-12 text-secondary/40 mx-auto" />
                  <h3 className="font-sans font-bold text-sm text-foreground">No Orders Found</h3>
                  <p className="text-secondary text-xs max-w-xs mx-auto">
                    You haven't placed any orders yet during this session.
                  </p>
                  <Link href="/shop" className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-full">
                    <span>Shop Fresh Crops</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div 
                      key={order.id} 
                      className="border border-border-color/30 rounded-lg p-5 bg-surface-hover/20 space-y-4 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-color/10 pb-3 text-xs">
                        <div className="flex gap-4">
                          <div>
                            <span className="text-secondary/70">Order ID:</span>
                            <span className="font-bold text-foreground ml-1">{order.id}</span>
                          </div>
                          <div>
                            <span className="text-secondary/70">Date:</span>
                            <span className="font-semibold text-foreground ml-1">{order.date}</span>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          <CheckCircle className="w-3 h-3" />
                          <span>{order.status}</span>
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.product.id} className="flex justify-between items-center text-xs">
                            <span className="text-secondary flex items-center gap-1.5">
                              <span className="relative w-6 h-6 overflow-hidden rounded border border-border-color/10 flex-shrink-0 flex items-center justify-center">
                                <Image
                                  src={item.product.image}
                                  alt={item.product.name}
                                  fill
                                  sizes="24px"
                                  className="object-contain p-0.5"
                                />
                              </span>
                              <span>{item.product.name} <b className="text-foreground ml-1">x{item.quantity}</b></span>
                            </span>
                            <span className="font-semibold text-foreground">₹{item.product.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center border-t border-border-color/10 pt-3 text-xs">
                        <span className="text-secondary/70">Payment: <b>{order.paymentMethod}</b></span>
                        <span className="text-sm font-extrabold text-foreground">
                          Total Paid: <b className="text-primary text-base">₹{order.total.toFixed(2)}</b>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-border-color/20 pb-3">
                <h2 className="font-sans font-extrabold text-lg text-foreground">
                  Saved Shipping Addresses
                </h2>
                <button className="text-xs font-bold text-primary hover:underline">
                  + Add New Address
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockAddresses.map((addr) => (
                  <div 
                    key={addr.id} 
                    className="border border-border-color/30 rounded-lg p-4 space-y-3 relative bg-surface-hover/20 hover:border-primary/20 transition-all duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold px-2 py-0.5 bg-primary/10 text-primary rounded">
                        {addr.type}
                      </span>
                      <div className="flex gap-2 text-[10px] font-bold text-secondary">
                        <button className="hover:text-primary">Edit</button>
                        <span>|</span>
                        <button className="hover:text-red-500">Delete</button>
                      </div>
                    </div>
                    <div className="text-xs space-y-1">
                      <h4 className="font-sans font-bold text-foreground text-sm">{addr.name}</h4>
                      <p className="text-secondary/80">{addr.address}</p>
                      <p className="text-secondary/80">{addr.city} - {addr.zip}</p>
                      <p className="text-secondary/80 mt-1">Phone: {addr.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
