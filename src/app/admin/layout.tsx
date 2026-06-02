"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { 
  LayoutDashboard, 
  Tag, 
  ShoppingBag, 
  Warehouse, 
  Receipt, 
  Users, 
  BarChart3, 
  Menu, 
  X, 
  LogOut, 
  User, 
  Loader2,
  ShieldAlert,
  Bell,
  Image as ImageIcon,
  FileSpreadsheet
} from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Categories", href: "/admin/categories", icon: Tag },
  { name: "Products", href: "/admin/products", icon: ShoppingBag },
  { name: "Inventory", href: "/admin/inventory", icon: Warehouse },
  { name: "Orders", href: "/admin/orders", icon: Receipt },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Hero Banners", href: "/admin/banners", icon: ImageIcon },
  { name: "Procurement", href: "/admin/procurement", icon: FileSpreadsheet },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Skip auth checks on login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAdmin(false);
        setAdminUser(null);
        router.push("/admin/login");
        setLoading(false);
        return;
      }

      try {
        // Verify user by hitting the server verification API
        const verifyRes = await fetch("/api/admin/auth");
        const verifyData = await verifyRes.json();

        if (verifyRes.ok && verifyData.success && verifyData.admin) {
          setIsAdmin(true);
          setAdminUser({
            uid: user.uid,
            email: user.email,
            name: verifyData.admin.name || user.displayName || "Admin",
          });
          setLoading(false);
        } else {
          // If server verification fails, force sign-out
          await signOut(auth);
          setIsAdmin(false);
          setAdminUser(null);
          router.push("/admin/login?error=unauthorized");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error verifying admin status:", error);
        await signOut(auth);
        router.push("/admin/login?error=failed");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    try {
      // Clear HTTP-only session cookie
      await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      await signOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="font-sans font-semibold text-sm text-secondary">Verifying administration permissions...</p>
      </div>
    );
  }

  // Render children directly for login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If not admin and not loading, show Access Denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-red-100 rounded-2xl p-8 text-center space-y-6 shadow-lg">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="font-sans font-extrabold text-2xl text-slate-800">Access Denied</h1>
          <p className="text-secondary text-sm leading-relaxed">
            Your account is not registered in our admin staff directory. Please contact the lead developer or administrator.
          </p>
          <button 
            onClick={handleLogout}
            className="w-full py-3 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center gap-2 shadow hover:bg-primary-container"
          >
            <LogOut className="w-4 h-4" />
            <span>Go to Login Screen</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col md:flex-row antialiased">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-[260px] bg-white border-r border-slate-200/80 shrink-0">
        {/* Sidebar Header / Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="font-sans font-extrabold text-xl tracking-tight text-primary">
              Sabziii<span className="text-tertiary font-bold text-xs uppercase ml-1 px-1.5 py-0.5 bg-tertiary/10 rounded">Admin</span>
            </span>
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary border-l-4 border-primary pl-3"
                    : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                <User className="w-4.5 h-4.5" />
              </div>
              <div className="text-left overflow-hidden">
                <h4 className="font-sans font-bold text-xs text-slate-800 truncate">{adminUser?.name}</h4>
                <p className="text-[10px] text-slate-500 truncate">{adminUser?.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-h-screen overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu - Mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-50 text-slate-600 md:hidden"
              aria-label="Open navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-sans font-extrabold text-lg text-slate-800">
              {sidebarItems.find((item) => pathname === item.href || pathname.startsWith(item.href + "/"))?.name || "Admin Panel"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-slate-50 text-slate-600 relative" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="h-8 w-px bg-slate-200 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                {adminUser?.name?.substring(0, 2).toUpperCase()}
              </div>
              <span className="font-sans font-bold text-xs text-slate-700">{adminUser?.name}</span>
            </div>
          </div>
        </header>

        {/* Page Inner Content */}
        <main className="flex-grow p-4 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <aside className="w-[280px] bg-white h-full flex flex-col animate-slide-right shadow-2xl">
            
            {/* Drawer Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
              <span className="font-sans font-extrabold text-lg tracking-tight text-primary">
                Sabzii<span className="text-tertiary font-bold text-xs uppercase ml-1 px-1.5 py-0.5 bg-tertiary/10 rounded">Admin</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-600"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links inside drawer */}
            <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary border-l-4 border-primary pl-3"
                        : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Profile info inside drawer footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                    {adminUser?.name?.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left overflow-hidden">
                    <h4 className="font-sans font-bold text-xs text-slate-800 truncate">{adminUser?.name}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{adminUser?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"
                  aria-label="Logout"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </aside>
          
          {/* Backdrop closer */}
          <div className="flex-grow" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </div>
  );
}
