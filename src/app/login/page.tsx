"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  Check, 
  ArrowRight,
  ShieldAlert,
  Phone
} from "lucide-react";

export default function Login() {
  const router = useRouter();
  
  // Zustand Auth triggers
  const user = useStore((state) => state.user);
  const signInWithEmail = useStore((state) => state.signInWithEmail);
  const signUpWithEmail = useStore((state) => state.signUpWithEmail);
  const signInWithGoogle = useStore((state) => state.signInWithGoogle);

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state controls
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [redirectTo, setRedirectTo] = useState("/dashboard");

  // Read redirect query parameter client-side safely to prevent Next.js static prerender de-optimization
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redir = params.get("redirect");
      if (redir) {
        if (redir.startsWith("/")) {
          setRedirectTo(redir);
        } else {
          setRedirectTo("/" + redir);
        }
      }
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(redirectTo);
    }
  }, [user, router, redirectTo]);

  const validate = () => {
    const newErrors: any = {};
    if (!email.trim() || !email.includes("@")) newErrors.email = "Valid email address is required";
    if (!password.trim() || password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (!isLogin) {
      if (!name.trim()) newErrors.name = "Full name is required";
      if (!phone.trim() || !/^\d{10}$/.test(phone.trim())) newErrors.phone = "Valid 10-digit mobile number is required";
      if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(name, email, password, phone.trim());
      }
      router.push(redirectTo);
    } catch (err: any) {
      console.error("Auth error:", err);
      // Clean up Firebase error message formatting
      const cleanMsg = err.message
        ? err.message.replace("Firebase:", "").replace(/auth\/(.*)\)?/, "$1").replace(/-/g, " ")
        : "Authentication failed. Check details.";
      setErrors({ general: cleanMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      await signInWithGoogle();
      router.push(redirectTo);
    } catch (err: any) {
      console.error("Google Auth error:", err);
      const cleanMsg = err.message
        ? err.message.replace("Firebase:", "").replace(/auth\/(.*)\)?/, "$1").replace(/-/g, " ")
        : "Google Sign-in failed.";
      setErrors({ general: cleanMsg });
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 flex items-center justify-center min-h-[500px] animate-fade-in text-left">
      <div className="w-full max-w-md bg-surface p-6 sm:p-8 border border-border-color/30 rounded-lg shadow-organic space-y-6">
        
        {/* Toggle Headings */}
        <div className="text-center space-y-2">
          <h1 className="font-sans font-extrabold text-2xl text-foreground">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-secondary text-xs">
            {isLogin 
              ? "Access your dashboard, previous orders, and saved lists." 
              : "Register today and get 15% off your first organic harvest order!"}
          </p>
        </div>

        {/* General Alert */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 text-xs text-red-600 animate-fade-in capitalize">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">{errors.general}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name (Sign Up only) */}
          {!isLogin && (
            <>
              <div className="space-y-1">
                <label htmlFor="auth-name" className="text-xs font-bold text-secondary uppercase tracking-wider block">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="auth-name"
                    placeholder="Nikhil Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm bg-surface rounded border ${errors.name ? "border-red-500" : "border-border-color/50"} focus:outline-none focus:border-primary`}
                  />
                  <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary/60" />
                </div>
                {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="auth-phone" className="text-xs font-bold text-secondary uppercase tracking-wider block">
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="auth-phone"
                    placeholder="9999999999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm bg-surface rounded border ${errors.phone ? "border-red-500" : "border-border-color/50"} focus:outline-none focus:border-primary`}
                  />
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary/60" />
                </div>
                {errors.phone && <p className="text-[10px] text-red-500 font-bold">{errors.phone}</p>}
              </div>
            </>
          )}

          {/* Email Address */}
          <div className="space-y-1">
            <label htmlFor="auth-email" className="text-xs font-bold text-secondary uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="auth-email"
                placeholder="nikhil@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={`w-full pl-10 pr-4 py-2.5 text-sm bg-surface rounded border ${errors.email ? "border-red-500" : "border-border-color/50"} focus:outline-none focus:border-primary`}
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary/60" />
            </div>
            {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="auth-pass" className="text-xs font-bold text-secondary uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="auth-pass"
                placeholder="Enter password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className={`w-full pl-10 pr-10 py-2.5 text-sm bg-surface rounded border ${errors.password ? "border-red-500" : "border-border-color/50"} focus:outline-none focus:border-primary`}
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary/60" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-secondary hover:text-foreground"
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-red-500 font-bold">{errors.password}</p>}
          </div>

          {/* Confirm Password (Sign Up only) */}
          {!isLogin && (
            <div className="space-y-1">
              <label htmlFor="auth-confirm" className="text-xs font-bold text-secondary uppercase tracking-wider block">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="auth-confirm"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-surface rounded border ${errors.confirmPassword ? "border-red-500" : "border-border-color/50"} focus:outline-none focus:border-primary`}
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary/60" />
              </div>
              {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold">{errors.confirmPassword}</p>}
            </div>
          )}

          {/* Remember me & Forget link (Login only) */}
          {isLogin && (
            <div className="flex items-center justify-between text-xs font-semibold text-secondary/80 py-1">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary" />
                <span>Remember me</span>
              </label>
              <span className="hover:text-primary cursor-pointer hover:underline">Forgot password?</span>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-white rounded font-sans text-sm font-bold flex items-center justify-center gap-2 shadow hover:bg-primary-container disabled:opacity-70 transition-all cursor-pointer"
          >
            <span>{isLoading ? "Authenticating..." : isLogin ? "Sign In" : "Create Account"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Horizontal separator */}
        <div className="relative flex py-2 items-center text-xs text-secondary/40 font-bold uppercase">
          <div className="flex-grow border-t border-border-color/20"></div>
          <span className="flex-shrink mx-3">or</span>
          <div className="flex-grow border-t border-border-color/20"></div>
        </div>

        {/* Google Authentication Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-3 border border-border-color bg-surface hover:bg-slate-50 text-slate-700 rounded font-sans text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <svg className="w-4 h-4 mr-1 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Toggle between Register/Login */}
        <div className="text-center text-xs text-secondary border-t border-border-color/10 pt-4">
          <span>{isLogin ? "New to Sabzii?" : "Already have an account?"}</span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
            className="text-primary font-bold ml-1.5 hover:underline focus:outline-none"
          >
            {isLogin ? "Sign Up Now" : "Sign In Now"}
          </button>
        </div>

      </div>
    </div>
  );
}
