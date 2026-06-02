"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useStore } from "@/store/useStore";
import { 
  User as UserIcon, 
  ShoppingBag, 
  MapPin, 
  LogOut, 
  Package, 
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { 
    orders, 
    addresses, 
    fetchUserAddresses, 
    addUserAddress, 
    updateUserAddress, 
    deleteUserAddress 
  } = useApp();
  
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const updateUserProfile = useStore((state) => state.updateUserProfile);
  
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses">("profile");

  // Profile Edit States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Address Form States
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState("");
  
  // Address Field States
  const [addrType, setAddrType] = useState("Home");
  const [addrName, setAddrName] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrZip, setAddrZip] = useState("");
  const [addrPhone, setAddrPhone] = useState("");

  // Sync profile details when user is fetched
  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfilePhone((user as any).phone || "");
      fetchUserAddresses(user.uid);
    }
  }, [user, fetchUserAddresses]);

  // Redirect to login if user session is lost
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-secondary text-sm font-semibold">Redirecting to login portal...</p>
      </div>
    );
  }

  const customerUser = {
    name: user.name || "Customer User",
    email: user.email || "",
    phone: (user as any).phone || "",
    memberSince: "June 2026",
    avatar: user.name ? user.name.substring(0, 2).toUpperCase() : "NK"
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    if (!profileName.trim()) {
      setProfileMessage({ type: "error", text: "Name cannot be empty" });
      return;
    }
    if (!profilePhone.trim() || !/^\d{10}$/.test(profilePhone.trim())) {
      setProfileMessage({ type: "error", text: "Please enter a valid 10-digit mobile number" });
      return;
    }

    setProfileLoading(true);
    try {
      await updateUserProfile(user.uid, {
        name: profileName.trim(),
        phone: profilePhone.trim()
      });
      setProfileMessage({ type: "success", text: "Profile details updated successfully!" });
      setIsEditingProfile(false);
    } catch (err: any) {
      console.error(err);
      setProfileMessage({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setProfileLoading(false);
    }
  };

  const resetAddressForm = () => {
    setAddrType("Home");
    setAddrName(user?.name || "");
    setAddrStreet("");
    setAddrCity("");
    setAddrZip("");
    setAddrPhone((user as any)?.phone || "");
    setEditingAddressId(null);
    setAddressError("");
  };

  const handleEditAddressClick = (addr: any) => {
    setAddrType(addr.type || "Home");
    setAddrName(addr.name || "");
    setAddrStreet(addr.address || "");
    setAddrCity(addr.city || "");
    setAddrZip(addr.zip || "");
    setAddrPhone(addr.phone || "");
    setEditingAddressId(addr.id);
    setAddressFormOpen(true);
    setAddressError("");
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError("");
    
    if (!addrName.trim()) {
      setAddressError("Name is required");
      return;
    }
    if (!addrStreet.trim()) {
      setAddressError("Street address is required");
      return;
    }
    if (!addrCity.trim()) {
      setAddressError("City is required");
      return;
    }
    if (!addrZip.trim() || addrZip.length < 5) {
      setAddressError("Valid zip code is required");
      return;
    }
    if (!addrPhone.trim() || !/^\d{10}$/.test(addrPhone.trim())) {
      setAddressError("Valid 10-digit phone number is required");
      return;
    }

    setAddressLoading(true);
    const addressData = {
      type: addrType,
      name: addrName.trim(),
      address: addrStreet.trim(),
      city: addrCity.trim(),
      zip: addrZip.trim(),
      phone: addrPhone.trim()
    };

    try {
      if (editingAddressId) {
        await updateUserAddress(user.uid, editingAddressId, addressData);
      } else {
        await addUserAddress(user.uid, addressData);
      }
      setAddressFormOpen(false);
      resetAddressForm();
    } catch (err: any) {
      console.error(err);
      setAddressError(err.message || "Failed to save address.");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleDeleteAddressClick = async (addressId: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteUserAddress(user.uid, addressId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="space-y-8 pb-12 text-left">
      
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
              {customerUser.avatar}
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm text-foreground leading-none">{customerUser.name}</h3>
              <span className="text-[10px] text-secondary font-medium mt-1 inline-block">Member since {customerUser.memberSince}</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-2.5 rounded font-sans text-sm font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
              activeTab === "profile"
                ? "bg-primary text-white"
                : "text-secondary hover:bg-surface-hover hover:text-primary"
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left px-4 py-2.5 rounded font-sans text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
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
            className={`w-full text-left px-4 py-2.5 rounded font-sans text-sm font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
              activeTab === "addresses"
                ? "bg-primary text-white"
                : "text-secondary hover:bg-surface-hover hover:text-primary"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>

          <button
            onClick={handleLogoutClick}
            className="w-full text-left px-4 py-2.5 rounded font-sans text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2.5 border-t border-border-color/10 mt-4 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </aside>

        {/* Right Side Content Area */}
        <div className="lg:col-span-9 bg-surface border border-border-color/30 rounded-lg p-6 sm:p-8 shadow-organic min-h-[400px] transition-colors">
          
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center border-b border-border-color/20 pb-3">
                <h2 className="font-sans font-extrabold text-lg text-foreground">
                  Profile Details
                </h2>
                {!isEditingProfile && (
                  <button
                    onClick={() => {
                      setIsEditingProfile(true);
                      setProfileMessage(null);
                    }}
                    className="text-xs font-bold text-primary hover:underline cursor-pointer"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {profileMessage && (
                <div className={`p-3 rounded border text-xs font-bold ${
                  profileMessage.type === "success" 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-950/30 dark:text-emerald-400" 
                    : "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/20 dark:border-red-950/30 dark:text-red-400"
                }`}>
                  {profileMessage.text}
                </div>
              )}
              
              {isEditingProfile ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Full Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-surface border border-border-color/50 rounded focus:outline-none focus:border-primary text-foreground"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Email Address</label>
                      <input
                        type="email"
                        value={customerUser.email}
                        className="w-full px-3 py-2 text-sm bg-surface-hover border border-border-color/10 rounded focus:outline-none text-secondary cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Phone Number</label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full px-3 py-2 text-sm bg-surface border border-border-color/50 rounded focus:outline-none focus:border-primary text-foreground"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Language Preference</label>
                      <input
                        type="text"
                        value="English (India)"
                        className="w-full px-3 py-2 text-sm bg-surface-hover border border-border-color/10 rounded focus:outline-none text-secondary cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary-container transition-all cursor-pointer disabled:opacity-50"
                    >
                      {profileLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setProfileName(user.name || "");
                        setProfilePhone((user as any).phone || "");
                        setProfileMessage(null);
                      }}
                      className="px-4 py-2 border border-border-color/30 text-secondary hover:bg-surface-hover text-xs font-bold rounded-full transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Full Name</span>
                    <p className="font-sans font-semibold text-sm text-foreground bg-surface-hover p-2.5 rounded border border-border-color/10">
                      {customerUser.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Email Address</span>
                    <p className="font-sans font-semibold text-sm text-foreground bg-surface-hover p-2.5 rounded border border-border-color/10">
                      {customerUser.email}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Phone Number</span>
                    <p className="font-sans font-semibold text-sm text-foreground bg-surface-hover p-2.5 rounded border border-border-color/10">
                      {customerUser.phone || "No phone number added"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Language Preference</span>
                    <p className="font-sans font-semibold text-sm text-foreground bg-surface-hover p-2.5 rounded border border-border-color/10">
                      English (India)
                    </p>
                  </div>
                </div>
              )}
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
                    You haven't placed any orders yet.
                  </p>
                  <Link href="/shop" className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-full cursor-pointer">
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
                {!addressFormOpen && (
                  <button
                    onClick={() => {
                      resetAddressForm();
                      setAddressFormOpen(true);
                    }}
                    className="text-xs font-bold text-primary hover:underline cursor-pointer"
                  >
                    + Add New Address
                  </button>
                )}
              </div>

              {addressFormOpen && (
                <form onSubmit={handleAddressSubmit} className="bg-surface-hover/30 border border-border-color/30 rounded-lg p-5 space-y-4 text-left">
                  <h3 className="font-sans font-bold text-sm text-foreground">
                    {editingAddressId ? "Modify Saved Address" : "Register New Delivery Address"}
                  </h3>
                  
                  {addressError && (
                    <p className="text-xs text-red-500 font-semibold">{addressError}</p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Address Tag (e.g. Home, Office)</label>
                      <select
                        value={addrType}
                        onChange={(e) => setAddrType(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-surface border border-border-color/50 rounded focus:outline-none focus:border-primary text-foreground"
                      >
                        <option value="Home">Home 🏠</option>
                        <option value="Office">Office 🏢</option>
                        <option value="Other">Other 📍</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Receiver's Name</label>
                      <input
                        type="text"
                        value={addrName}
                        onChange={(e) => setAddrName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full px-3 py-2 text-sm bg-surface border border-border-color/50 rounded focus:outline-none focus:border-primary text-foreground"
                        required
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Street Address</label>
                      <input
                        type="text"
                        value={addrStreet}
                        onChange={(e) => setAddrStreet(e.target.value)}
                        placeholder="House/Flat No, Apartment, Street name"
                        className="w-full px-3 py-2 text-sm bg-surface border border-border-color/50 rounded focus:outline-none focus:border-primary text-foreground"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">City</label>
                      <input
                        type="text"
                        value={addrCity}
                        onChange={(e) => setAddrCity(e.target.value)}
                        placeholder="City"
                        className="w-full px-3 py-2 text-sm bg-surface border border-border-color/50 rounded focus:outline-none focus:border-primary text-foreground"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Zip/Postal Code</label>
                      <input
                        type="text"
                        value={addrZip}
                        onChange={(e) => setAddrZip(e.target.value)}
                        placeholder="6-digit Zip Code"
                        className="w-full px-3 py-2 text-sm bg-surface border border-border-color/50 rounded focus:outline-none focus:border-primary text-foreground"
                        required
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Receiver's Contact Number</label>
                      <input
                        type="tel"
                        value={addrPhone}
                        onChange={(e) => setAddrPhone(e.target.value)}
                        placeholder="10-digit Mobile Number"
                        className="w-full px-3 py-2 text-sm bg-surface border border-border-color/50 rounded focus:outline-none focus:border-primary text-foreground"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={addressLoading}
                      className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary-container transition-all cursor-pointer disabled:opacity-50"
                    >
                      {addressLoading ? "Saving..." : (editingAddressId ? "Update Address" : "Save Address")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAddressFormOpen(false);
                        resetAddressForm();
                      }}
                      className="px-4 py-2 border border-border-color/30 text-secondary hover:bg-surface-hover text-xs font-bold rounded-full transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {addresses.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-border-color/40 rounded-lg space-y-2">
                  <p className="text-secondary text-sm font-semibold">No saved shipping locations found.</p>
                  <p className="text-secondary/70 text-xs">Add your address to expedite checkout during grocery delivery.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr: any) => (
                    <div 
                      key={addr.id} 
                      className="border border-border-color/30 rounded-lg p-4 space-y-3 relative bg-surface-hover/20 hover:border-primary/20 transition-all duration-300 text-left"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-extrabold px-2 py-0.5 bg-primary/10 text-primary rounded">
                          {addr.type}
                        </span>
                        <div className="flex gap-2 text-[10px] font-bold text-secondary">
                          <button
                            onClick={() => handleEditAddressClick(addr)}
                            className="hover:text-primary cursor-pointer"
                          >
                            Edit
                          </button>
                          <span>|</span>
                          <button
                            onClick={() => handleDeleteAddressClick(addr.id)}
                            className="hover:text-red-500 cursor-pointer"
                          >
                            Delete
                          </button>
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
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

// Inline fallback loader helper
const Loader2 = ({ className }: { className?: string }) => (
  <svg 
    className={`animate-spin ${className}`} 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4"
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
