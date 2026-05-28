"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useApp();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = promoApplied ? subtotal * 0.15 : 0; // 15% discount
  const remainingForFreeDelivery = 299 - subtotal;
  const deliveryCharges = subtotal === 0 ? 0 : (subtotal - discount) > 299 ? 0 : 40;
  const tax = (subtotal - discount) * 0.05; // 5% VAT
  const total = subtotal - discount + deliveryCharges + tax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "FRESH15") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid code. Try FRESH15");
      setPromoApplied(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center text-4xl">
          🛒
        </div>
        <h1 className="font-sans font-extrabold text-2xl text-foreground">Your Basket is Empty</h1>
        <p className="text-secondary text-sm max-w-sm mx-auto">
          Looks like you haven't added any fresh organic produce to your basket yet. Let's explore our local farm harvests!
        </p>
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold shadow-md hover:bg-primary-container/90 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shop Fresh Produce</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title */}
      <div>
        <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-foreground">
          Shopping Basket
        </h1>
        <p className="text-secondary text-sm">
          Review your healthy food selections before checkout.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Free Delivery Banner */}
          {remainingForFreeDelivery > 0 ? (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 p-4 rounded-lg text-sm font-semibold flex items-center justify-between">
              <span>Add <b>₹{remainingForFreeDelivery}</b> more to qualify for <b>FREE EXPRESS DELIVERY</b>!</span>
              <Link href="/shop" className="underline text-xs hover:text-amber-600 font-extrabold">Shop more</Link>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 p-4 rounded-lg text-sm font-semibold">
              🎉 Congratulations! Your order qualifies for <b>FREE EXPRESS DELIVERY</b>!
            </div>
          )}

          {/* Table Container */}
          <div className="bg-surface border border-border-color/30 rounded-lg overflow-hidden shadow-organic">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-surface-hover/50 border-b border-border-color/20 text-xs font-extrabold text-secondary uppercase tracking-wider">
              <div className="col-span-6">Product details</div>
              <div className="col-span-2 text-center">Unit Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>

            <div className="divide-y divide-border-color/20">
              {cart.map((item) => (
                <div key={item.product.id} className="grid grid-cols-12 gap-4 items-center p-4">
                  {/* Info Column */}
                  <div className="col-span-12 sm:col-span-6 flex gap-4 items-center">
                    <div className={`w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center relative overflow-hidden ${item.product.color} border border-border-color/10`}>
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="56px"
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <Link href={`/product/${item.product.id}`} className="font-sans font-bold text-sm text-foreground hover:text-primary transition-colors">
                        {item.product.name}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-secondary/80">
                        <span>{item.product.category}</span>
                        <span>•</span>
                        <span>{item.product.unit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Column */}
                  <div className="col-span-4 sm:col-span-2 sm:text-center flex sm:flex-col justify-between items-center sm:justify-center border-t border-border-color/10 sm:border-t-0 pt-2 sm:pt-0">
                    <span className="text-xs text-secondary/60 sm:hidden">Unit Price:</span>
                    <span className="text-sm font-bold text-foreground">₹{item.product.price}</span>
                  </div>

                  {/* Quantity Stepper Column */}
                  <div className="col-span-4 sm:col-span-2 flex sm:justify-center items-center border-t border-border-color/10 sm:border-t-0 pt-2 sm:pt-0">
                    <div className="flex items-center bg-primary-container text-white h-8 rounded-full overflow-hidden border border-primary/20 mx-auto">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="h-full px-2.5 text-white hover:bg-primary/20 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-1.5 font-sans font-extrabold text-xs min-w-[16px] text-center select-none text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="h-full px-2.5 text-white hover:bg-primary/20 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal & Delete Column */}
                  <div className="col-span-4 sm:col-span-2 text-right flex sm:flex-col justify-between items-center sm:items-end border-t border-border-color/10 sm:border-t-0 pt-2 sm:pt-0">
                    <span className="text-xs text-secondary/60 sm:hidden">Total:</span>
                    <div className="flex items-center gap-2.5 justify-end">
                      <span className="text-sm font-bold text-foreground">
                        ₹{item.product.price * item.quantity}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-secondary/60 hover:text-red-500 p-1.5 rounded-full hover:bg-red-500/10 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Clear Basket Bar */}
            <div className="p-4 bg-surface-hover/30 border-t border-border-color/20 flex justify-between items-center">
              <Link 
                href="/shop" 
                className="text-xs font-bold text-primary hover:underline"
              >
                ← Continue Shopping
              </Link>
              <button 
                onClick={clearCart}
                className="text-xs font-bold text-secondary hover:text-red-500 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Basket</span>
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Summary Box */}
          <div className="bg-surface p-6 border border-border-color/30 rounded-lg shadow-organic space-y-6">
            <h2 className="font-sans font-extrabold text-base text-foreground border-b border-border-color/20 pb-3">
              Order Summary
            </h2>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-secondary">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">₹{subtotal}</span>
              </div>

              {promoApplied && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>15% Promo Discount</span>
                  <span className="font-semibold">-₹{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-secondary">
                <span>Delivery charges</span>
                <span className="font-semibold text-foreground">
                  {deliveryCharges === 0 ? "FREE" : `₹${deliveryCharges}`}
                </span>
              </div>

              <div className="flex justify-between text-secondary">
                <span>Estimated VAT (5%)</span>
                <span className="font-semibold text-foreground">₹{tax.toFixed(2)}</span>
              </div>

              <div className="border-t border-border-color/20 pt-4 flex justify-between text-base font-extrabold text-foreground">
                <span>Grand Total</span>
                <span className="text-primary text-xl font-black">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="space-y-2.5">
              <label htmlFor="promo" className="block text-xs font-bold text-secondary uppercase tracking-wider">
                Have a coupon code?
              </label>
              {promoApplied ? (
                <div className="text-xs text-emerald-600 font-bold bg-emerald-500/10 p-2 rounded flex justify-between items-center">
                  <span>Discount code Applied!</span>
                  <button 
                    type="button" 
                    onClick={() => setPromoApplied(false)}
                    className="underline text-red-500 font-normal hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="promo"
                    placeholder="Enter FLASH15"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-grow px-3.5 py-2 text-xs rounded border border-border-color/40 bg-surface focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded hover:bg-primary transition-all duration-300"
                  >
                    Apply
                  </button>
                </div>
              )}
              {promoError && <p className="text-[10px] text-red-500 font-bold">{promoError}</p>}
            </form>

            <Link
              href="/checkout"
              className="w-full py-3.5 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary-container/90 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2.5 justify-center text-xs text-secondary/70 pt-2 border-t border-border-color/10">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Secure Payments & Guarantee</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
