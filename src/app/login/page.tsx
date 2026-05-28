"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, Check, ArrowRight } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state controls
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (!email.trim() || !email.includes("@")) newErrors.email = "Valid email address is required";
    if (!password.trim() || password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (!isLogin) {
      if (!name.trim()) newErrors.name = "Full name is required";
      if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    // Simulate Auth API validation
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to user dashboard
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <div className="py-12 flex items-center justify-center min-h-[500px] animate-fade-in">
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

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name (Sign Up only) */}
          {!isLogin && (
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
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-surface rounded border ${errors.name ? "border-red-500" : "border-border-color/50"} focus:outline-none focus:border-primary`}
                />
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary/60" />
              </div>
              {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name}</p>}
            </div>
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
            className="w-full py-3 bg-primary text-white rounded font-sans text-sm font-bold flex items-center justify-center gap-2 shadow hover:bg-primary-container disabled:opacity-70 transition-all"
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

        {/* Toggle between Register/Login */}
        <div className="text-center text-xs text-secondary">
          <span>{isLogin ? "New to FreshPick?" : "Already have an account?"}</span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
            className="text-primary font-bold ml-1.5 hover:underline"
          >
            {isLogin ? "Sign Up Now" : "Sign In Now"}
          </button>
        </div>

      </div>
    </div>
  );
}
