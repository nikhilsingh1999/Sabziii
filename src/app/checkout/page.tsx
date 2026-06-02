"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { useStore } from "@/store/useStore";
import { 
  ShoppingBag, 
  CheckCircle, 
  CreditCard, 
  Wallet, 
  Truck, 
  User, 
  Phone, 
  MapPin, 
  Calendar,
  IndianRupee,
  AlertCircle
} from "lucide-react";

export default function Checkout() {
  const { cart, placeOrder, addresses } = useApp();
  const user = useStore((state) => state.user);

  // Form states
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  // Flow control states
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const delivery = subtotal >= 300 ? 0 : 19;
  const total = subtotal + delivery;

  const validate = () => {
    const newErrors: any = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!address.trim()) newErrors.address = "Delivery address is required";
    if (!city.trim()) newErrors.city = "City name is required";
    if (!zipCode.trim() || zipCode.length < 5) newErrors.zipCode = "Valid Zip code is required";
    if (!phone.trim() || phone.length < 10) newErrors.phone = "Valid 10-digit phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const orderDetails = await placeOrder(
        { fullName, address, city, zipCode, phone },
        paymentMethod
      );
      setPlacedOrder(orderDetails);
    } catch (err: any) {
      console.error(err);
      setErrors({ submit: err.message || "Failed to place order. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was placed, render Order Confirmed Screen
  if (placedOrder) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 space-y-8 text-center animate-fade-in">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-full mx-auto flex items-center justify-center border border-emerald-500/20">
          <CheckCircle className="w-10 h-10 animate-bounce" />
        </div>

        {/* Confirmation Headings */}
        <div className="space-y-2">
          <h1 className="font-sans font-extrabold text-3xl text-foreground">Order Confirmed!</h1>
          <p className="text-secondary text-sm">
            Thank you for shopping with Sabziii. Your order has been sent to our local farms!
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-surface rounded-lg p-6 border border-border-color/30 text-left space-y-4 shadow-organic">
          <div className="flex justify-between items-center border-b border-border-color/20 pb-3">
            <div>
              <p className="text-xs text-secondary/60 uppercase font-extrabold tracking-wider">Order ID</p>
              <h3 className="font-sans font-extrabold text-base text-foreground">{placedOrder.id}</h3>
            </div>
            <div className="text-right">
              <p className="text-xs text-secondary/60 uppercase font-extrabold tracking-wider">Date</p>
              <h3 className="font-sans font-semibold text-sm text-foreground">{placedOrder.date}</h3>
            </div>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-sans font-bold text-sm text-foreground">Delivery Summary</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-secondary">
              <div className="flex gap-1.5 items-center">
                <User className="w-3.5 h-3.5 text-primary" />
                <span>{placedOrder.shippingAddress.fullName}</span>
              </div>
              <div className="flex gap-1.5 items-center">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>{placedOrder.shippingAddress.phone}</span>
              </div>
              <div className="flex gap-1.5 items-center sm:col-span-2">
                <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>{placedOrder.shippingAddress.address}, {placedOrder.shippingAddress.city} - {placedOrder.shippingAddress.zipCode}</span>
              </div>
              <div className="flex gap-1.5 items-center">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>Estimated Arrival: <b>Today, within 2-3 hours</b></span>
              </div>
              <div className="flex gap-1.5 items-center">
                <IndianRupee className="w-3.5 h-3.5 text-primary" />
                <span>Payment: <b>{placedOrder.paymentMethod}</b></span>
              </div>
            </div>
          </div>

          {/* Ordered items compact list */}
          <div className="border-t border-border-color/20 pt-4 space-y-2">
            <h4 className="font-sans font-bold text-xs text-foreground uppercase tracking-wider">Items ordered</h4>
            <div className="divide-y divide-border-color/10">
              {placedOrder.items.map((item: any) => (
                <div key={item.product.id} className="flex justify-between items-center py-2 text-sm">
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
                    <span>
                      {item.product.name}
                      {(item.product.price === 0 || item.product.isFreebie) && (
                        <span className="ml-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-emerald-500/10">
                          FREE
                        </span>
                      )}
                      <b className="text-foreground text-xs ml-1">x{item.quantity}</b>
                    </span>
                  </span>
                  <span className="font-semibold text-foreground">
                    {item.product.price === 0 || item.product.isFreebie ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${item.product.price * item.quantity}`
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border-color/20 pt-4 flex justify-between font-extrabold text-foreground">
            <span>Total Paid</span>
            <span className="text-primary text-lg">₹{placedOrder.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/dashboard"
            className="px-6 py-3 rounded-full border border-border-color/30 hover:bg-surface-hover font-bold text-sm"
          >
            Go to Dashboard
          </Link>
          <Link 
            href="/shop"
            className="px-6 py-3 rounded-full bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-container"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    );
  }

  // If cart is empty and no order placed
  if (cart.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <span className="text-6xl block">🥬</span>
        <h1 className="font-sans font-extrabold text-2xl text-foreground">Basket is Empty</h1>
        <p className="text-secondary text-sm">You must add items to your basket before checking out.</p>
        <Link href="/shop" className="inline-block px-5 py-2.5 bg-primary text-white font-bold rounded-full">
          Shop Produce
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title */}
      <div>
        <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-foreground">
          Checkout
        </h1>
        <p className="text-secondary text-sm">
          Provide your shipping details and complete your mock transaction.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Shipping Form & Payment Section */}
        <form onSubmit={handlePlaceOrderSubmit} className="lg:col-span-8 space-y-6">
          
          {/* Shipping details */}
          <div className="bg-surface p-6 border border-border-color/30 rounded-lg shadow-organic space-y-4 text-left">
            <h2 className="font-sans font-extrabold text-base text-foreground flex items-center gap-2 border-b border-border-color/20 pb-3">
              <Truck className="w-4 h-4 text-primary" />
              <span>1. Delivery Address</span>
            </h2>

            {addresses && addresses.length > 0 && (
              <div className="space-y-2 pb-2 border-b border-border-color/10">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                  Quick Select Saved Address
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addresses.map((addr: any) => (
                    <div
                      key={addr.id}
                      onClick={() => {
                        setFullName(addr.name || "");
                        setAddress(addr.address || "");
                        setCity(addr.city || "");
                        setZipCode(addr.zip || "");
                        setPhone(addr.phone || "");
                      }}
                      className="border border-border-color/30 hover:border-primary/50 cursor-pointer rounded-lg p-3 bg-surface-hover/20 hover:bg-surface-hover/40 transition-all text-xs space-y-1.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-[9px] uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {addr.type || "Address"}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-foreground">{addr.name}</h4>
                        <p className="text-secondary/80 line-clamp-1">{addr.address}</p>
                        <p className="text-secondary/80">{addr.city} - {addr.zip}</p>
                        <p className="text-secondary/80 font-semibold mt-1">Phone: {addr.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1 sm:col-span-2">
                <label htmlFor="fullName" className="text-xs font-bold text-secondary uppercase tracking-wider block">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="e.g. Nikhil Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded border ${errors.fullName ? "border-red-500" : "border-border-color/50"} bg-surface focus:outline-none focus:border-primary text-sm`}
                />
                {errors.fullName && <p className="text-[10px] text-red-500 font-bold">{errors.fullName}</p>}
              </div>

              {/* Address */}
              <div className="space-y-1 sm:col-span-2">
                <label htmlFor="address" className="text-xs font-bold text-secondary uppercase tracking-wider block">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  placeholder="House No, Apartment Name, Street Name"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded border ${errors.address ? "border-red-500" : "border-border-color/50"} bg-surface focus:outline-none focus:border-primary text-sm`}
                />
                {errors.address && <p className="text-[10px] text-red-500 font-bold">{errors.address}</p>}
              </div>

              {/* City */}
              <div className="space-y-1">
                <label htmlFor="city" className="text-xs font-bold text-secondary uppercase tracking-wider block">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  placeholder="e.g. New Delhi"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded border ${errors.city ? "border-red-500" : "border-border-color/50"} bg-surface focus:outline-none focus:border-primary text-sm`}
                />
                {errors.city && <p className="text-[10px] text-red-500 font-bold">{errors.city}</p>}
              </div>

              {/* Zip Code */}
              <div className="space-y-1">
                <label htmlFor="zipCode" className="text-xs font-bold text-secondary uppercase tracking-wider block">
                  Zip/Postal Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  placeholder="e.g. 110001"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded border ${errors.zipCode ? "border-red-500" : "border-border-color/50"} bg-surface focus:outline-none focus:border-primary text-sm`}
                />
                {errors.zipCode && <p className="text-[10px] text-red-500 font-bold">{errors.zipCode}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1 sm:col-span-2">
                <label htmlFor="phone" className="text-xs font-bold text-secondary uppercase tracking-wider block">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded border ${errors.phone ? "border-red-500" : "border-border-color/50"} bg-surface focus:outline-none focus:border-primary text-sm`}
                />
                {errors.phone && <p className="text-[10px] text-red-500 font-bold">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-surface p-6 border border-border-color/30 rounded-lg shadow-organic space-y-4">
            <h2 className="font-sans font-extrabold text-base text-foreground flex items-center gap-2 border-b border-border-color/20 pb-3">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>2. Payment Option</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Cash On Delivery */}
              <label 
                className={`p-4 rounded-lg border-2 flex flex-col gap-2 items-center text-center cursor-pointer transition-all duration-200 ${
                  paymentMethod === "cod" 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-border-color/40 bg-surface hover:bg-surface-hover text-secondary"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="sr-only"
                />
                <Truck className="w-6 h-6" />
                <span className="font-sans font-bold text-xs">Cash on Delivery</span>
                <span className="text-[10px] opacity-80">Pay on parcel arrival</span>
              </label>

              {/* UPI */}
              <label 
                className={`p-4 rounded-lg border-2 flex flex-col gap-2 items-center text-center cursor-pointer transition-all duration-200 ${
                  paymentMethod === "upi" 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-border-color/40 bg-surface hover:bg-surface-hover text-secondary"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                  className="sr-only"
                />
                <Wallet className="w-6 h-6" />
                <span className="font-sans font-bold text-xs">UPI (Google Pay/PhonePe)</span>
                <span className="text-[10px] opacity-80">Instant verification</span>
              </label>

              {/* Card */}
              <label 
                className={`p-4 rounded-lg border-2 flex flex-col gap-2 items-center text-center cursor-pointer transition-all duration-200 ${
                  paymentMethod === "card" 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-border-color/40 bg-surface hover:bg-surface-hover text-secondary"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="sr-only"
                />
                <CreditCard className="w-6 h-6" />
                <span className="font-sans font-bold text-xs">Credit / Debit Card</span>
                <span className="text-[10px] opacity-80">Secure Checkout</span>
              </label>

            </div>
          </div>
        </form>

        {/* Compact Items Summary Review Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface p-6 border border-border-color/30 rounded-lg shadow-organic space-y-6">
            <h2 className="font-sans font-extrabold text-base text-foreground border-b border-border-color/20 pb-3 flex items-center justify-between">
              <span>Review Order</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                {cart.length} Items
              </span>
            </h2>

            {/* List */}
            <div className="max-h-48 overflow-y-auto divide-y divide-border-color/10 pr-2">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center py-2 text-sm">
                  <div className="flex gap-2 items-center">
                    <div className="relative w-8 h-8 overflow-hidden rounded border border-border-color/10 flex-shrink-0 flex items-center justify-center">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="32px"
                        className="object-contain p-0.5"
                      />
                    </div>
                    <div className="flex flex-col text-xs leading-normal">
                      <span className="font-bold text-foreground line-clamp-1">{item.product.name}</span>
                      <span className="text-secondary/70">Qty: {item.quantity} • {item.product.unit}</span>
                    </div>
                  </div>
                  <span className="font-bold text-foreground">₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

             {/* Summary figures */}
            <div className="border-t border-border-color/20 pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-secondary">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Delivery charges</span>
                <span className="font-semibold text-foreground">
                  {delivery === 0 ? "FREE" : `₹${delivery}`}
                </span>
              </div>
              <div className="border-t border-border-color/20 pt-3 flex justify-between text-sm font-extrabold text-foreground">
                <span>Total Amount</span>
                <span className="text-primary text-lg">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 flex items-start gap-2 text-[11px] text-red-600 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-semibold leading-normal">{errors.submit}</span>
              </div>
            )}

            {/* Submit Button */}
            {subtotal < 200 ? (
              <div className="space-y-3">
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-[10px] font-semibold text-center">
                  ⚠️ Minimum order value of <b>₹200</b> is required.
                </div>
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <span>Confirm & Place Order</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handlePlaceOrderSubmit}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary-container/90 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-75"
              >
                <span>{isSubmitting ? "Processing Order..." : "Confirm & Place Order"}</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
