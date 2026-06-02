"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { 
  Lock, 
  Mail, 
  User, 
  Loader2, 
  ShieldAlert, 
  CheckCircle,
  Database,
  ArrowRight
} from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam === "unauthorized" 
      ? "Access denied. Your account is not registered as an active admin." 
      : errorParam === "failed" 
      ? "Verification failed. Please try again." 
      : null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      let userCredential;
      if (isLogin) {
        // Sign in with Firebase Client SDK
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Create user with Firebase Client SDK (Sign Up mode)
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
      
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      // Trigger HTTP session cookie endpoint
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const authData = await response.json();

      if (response.ok && authData.success) {
        setSuccessMessage("Authentication successful! Redirecting...");
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1000);
      } else {
        // If API fails (e.g. not in admins collection), show error and sign out on client
        setErrorMessage(authData.error || "You are not registered as an active administrator.");
        await signOut(auth);
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Authentication error:", err);
      setErrorMessage(err.message?.replace("Firebase:", "") || "Authentication failed. Check your credentials.");
      setLoading(false);
    }
  };

  // Helper function to seed the current user as an admin in Firestore
  const handleSeedAdmin = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setSeeding(true);

    if (!email || !password) {
      setErrorMessage("Please enter an email and password first to seed the account.");
      setSeeding(false);
      return;
    }

    try {
      // 1. Sign in or Create the Firebase Auth user first
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (signInErr) {
        // If sign in fails, try creating the user
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }

      const user = userCredential.user;
      
      // 2. Call the seed endpoint to add this user in the admins collection
      const seedResponse = await fetch("/api/admin/auth/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          uid: user.uid,
          name: name || "Super Admin",
        }),
      });

      const seedData = await seedResponse.json();

      if (seedResponse.ok && seedData.success) {
        setSuccessMessage("User seeded as active Admin in Firestore! Logging in...");
        
        // 3. Complete administrative cookie authentication
        const idToken = await user.getIdToken();
        const authResponse = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
        
        const authData = await authResponse.json();
        if (authResponse.ok && authData.success) {
          setTimeout(() => {
            router.push("/admin/dashboard");
          }, 1000);
        } else {
          setErrorMessage(authData.error || "Failed to log in after seeding.");
          setSeeding(false);
        }
      } else {
        setErrorMessage(seedData.error || "Failed to seed admin user.");
        setSeeding(false);
      }
    } catch (err: any) {
      console.error("Seeding error:", err);
      setErrorMessage(err.message || "Failed to seed admin account.");
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-lg relative overflow-hidden">
        
        {/* Decorative background gradients */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-tertiary/5 rounded-full blur-2xl -z-10" />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <span className="font-sans font-extrabold text-2xl tracking-tight text-primary">
            Sabziii<span className="text-slate-800"> Store</span>
          </span>
          <h1 className="font-sans font-bold text-slate-800 text-lg">
            {isLogin ? "Administrative Sign In" : "Register Admin Staff"}
          </h1>
          <p className="text-xs text-secondary max-w-xs mx-auto">
            {isLogin 
              ? "Access the product database, stock logs, order pipelines, and marketing analytics." 
              : "Register a new profile to seed administrative permissions."}
          </p>
        </div>

        {/* Error and Success Banner Notification Alerts */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-red-600 animate-fade-in">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-emerald-600 animate-fade-in">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Admin Name (Register only) */}
          {!isLogin && (
            <div className="space-y-1">
              <label htmlFor="admin-name" className="text-xs font-bold text-secondary uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="admin-name"
                  placeholder="e.g. Nikhil Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading || seeding}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#f8f9ff] border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="admin-email" className="text-xs font-bold text-secondary uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="admin-email"
                placeholder="e.g. admin@sabziii.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || seeding}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#f8f9ff] border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="admin-pass" className="text-xs font-bold text-secondary uppercase tracking-wider block">
              Security Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="admin-pass"
                placeholder="Enter password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || seeding}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#f8f9ff] border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Sign In / Sign Up Submit button */}
          <button
            type="submit"
            disabled={loading || seeding}
            className="w-full py-3 bg-primary text-white rounded-lg font-sans text-sm font-bold flex items-center justify-center gap-2 shadow hover:bg-primary-container disabled:opacity-70 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Credentials...</span>
              </>
            ) : (
              <>
                <span>{isLogin ? "Sign In to Dashboard" : "Register Admin Profile"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Developer Seeding Box - Helps developer setup first-time admin credentials easily */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
            <span>Setup Assistant</span>
            <span className="px-1 bg-amber-100 text-amber-800 rounded font-bold">Dev Tool</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            New database? Enter email & password above and click below to instantly create & register this account as an active Administrator in Firestore.
          </p>
          <button
            type="button"
            onClick={handleSeedAdmin}
            disabled={loading || seeding}
            className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {seeding ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Seeding Collection...</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5" />
                <span>Register & Seed as Admin in Firestore</span>
              </>
            )}
          </button>
        </div>

        {/* Form Toggle Link */}
        <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          <span>{isLogin ? "Need a new admin profile?" : "Already registered?"}</span>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className="text-primary font-bold ml-1 hover:underline focus:outline-none"
          >
            {isLogin ? "Sign Up Staff" : "Sign In Staff"}
          </button>
        </div>

      </div>
    </div>
  );
}
