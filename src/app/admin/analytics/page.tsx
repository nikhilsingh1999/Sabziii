"use client";

import  { useEffect, useState } from "react";
import { 
  BarChart3, 
  Loader2, 
  AlertCircle, 
  DollarSign, 
  ShoppingBag, 
  Percent,

  Globe,
  Laptop,
  Eye,
  MousePointerClick,
  Search,

  Clock,
  RefreshCw,
  Users
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

interface RevenueTrendPoint {
  date: string;
  revenue: number;
}

interface OrderStatusPoint {
  status: string;
  count: number;
}

interface TopProductPoint {
  name: string;
  quantity: number;
  sales: number;
}

interface AnalyticsReport {
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueTrend: RevenueTrendPoint[];
  ordersByStatus: OrderStatusPoint[];
  topSellingProducts: TopProductPoint[];

  // Website analytics additions
  visitors: {
    total: number;
    today: number;
    week: number;
    month: number;
    returning: number;
    new: number;
  };
  engagement: {
    totalPageViews: number;
    avgSessionDuration: string;
    bounceRate: string;
    activeUsers: number;
  };
  devices: { name: string; value: number }[];
  trafficSources: { name: string; value: number; count: number }[];
  topPages: { path: string; views: number }[];
  topSearches: { query: string; count: number }[];
  topViewedProducts: { name: string; views: number }[];
  topClickedProducts: { name: string; clicks: number }[];
  topAddedToCartProducts: { name: string; adds: number }[];
  conversions: {
    visitors: number;
    addToCart: number;
    checkoutStarted: number;
    ordersPlaced: number;
    conversionRate: number;
    cartAbandonmentRate: number;
  };
  visitorsTrend: { date: string; visitors: number; pageViews: number }[];
}

// Chart Colors
const COLORS = {
  primary: "#10B981",    // Emerald 500 (Brand Accent)
  secondary: "#3B82F6",  // Blue 500
  tertiary: "#F59E0B",   // Amber 500
  info: "#8B5CF6",       // Violet 500
  danger: "#EF4444",     // Red 500
  dark: "#0F172A",       // Slate 900
};

const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.tertiary, COLORS.info, COLORS.danger, "#EC4899", "#14B8A6"];

export default function AnalyticsPage() {
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"visitors" | "engagement" | "products">("visitors");

  // Prevent SSR/Hydration issues with Recharts
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch("/api/admin/analytics?type=report");
      const data = await res.json();
      console.log("analytics report > ",data);
      if (res.ok && data.success) {
        setReport(data.report || null);
      } else {
        throw new Error(data.error || "Failed to load analytics dataset");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to communicate with analytics database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="text-xs font-bold text-slate-500">Preparing analytics viewport...</span>
      </div>
    );
  }

  // Conversion funnel data mapping
  const funnelData = report ? [
    { name: "Visitors", count: report.conversions.visitors, fill: COLORS.secondary },
    { name: "Add to Cart", count: report.conversions.addToCart, fill: COLORS.info },
    { name: "Checkout Started", count: report.conversions.checkoutStarted, fill: COLORS.tertiary },
    { name: "Orders Placed", count: report.conversions.ordersPlaced, fill: COLORS.primary }
  ] : [];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-left">
      
      {/* Errors */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-sm text-red-600">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="font-medium leading-relaxed">{error}</span>
        </div>
      )}

      {/* Header Title */}
      <section className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-extrabold text-base text-slate-800 flex items-center gap-2">
              <span>Business Analytics & Website Tracker</span>
              {report && (
                <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  {report.engagement.activeUsers} Active Users
                </span>
              )}
            </h3>
            <p className="text-slate-400 text-xs font-medium mt-0.5">Unified dashboard tracking visitors, user activity, conversions, and product interactions</p>
          </div>
        </div>
        <button
          onClick={fetchReport}
          disabled={loading}
          className="text-xs text-primary hover:text-primary-container font-extrabold border border-primary/20 hover:border-primary/40 px-4 py-2 rounded-full bg-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Reports</span>
        </button>
      </section>

      {/* Statistics Highlights */}
      {loading ? (
        <section className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm h-[95px] animate-pulse" />
          ))}
        </section>
      ) : report ? (
        <section className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Visitors */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Visitors</span>
              <span className="font-sans font-black text-xl text-slate-800">{report.visitors.total}</span>
              <span className="text-[9px] font-bold text-slate-400 block">Today: {report.visitors.today}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Orders Placed</span>
              <span className="font-sans font-black text-xl text-slate-800">{report.totalOrders}</span>
              <span className="text-[9px] font-bold text-slate-400 block">AOV: ₹{report.averageOrderValue}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
              <ShoppingBag className="w-4.5 h-4.5" />
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Monthly Revenue</span>
              <span className="font-sans font-black text-xl text-slate-800">₹{report.revenueThisMonth}</span>
              <span className="text-[9px] font-bold text-slate-400 block">Today: ₹{report.revenueToday}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm shrink-0">
              <DollarSign className="w-4.5 h-4.5" />
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Conversion Rate</span>
              <span className="font-sans font-black text-xl text-slate-800">{report.conversions.conversionRate}%</span>
              <span className="text-[9px] font-bold text-slate-400 block">Cart Abandon: {report.conversions.cartAbandonmentRate}%</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
              <Percent className="w-4.5 h-4.5" />
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Live Users</span>
              <span className="font-sans font-black text-xl text-slate-800">{report.engagement.activeUsers}</span>
              <span className="text-[9px] font-bold text-slate-400 block">Bounce Rate: {report.engagement.bounceRate}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
        </section>
      ) : null}

      {/* Tabs Switch bar */}
      <section className="flex border-b border-slate-200">
        {[
          { id: "visitors", label: "Visitor Traffic & Trends" },
          { id: "engagement", label: "User Actions & Funnel" },
          { id: "products", label: "Product & Search Analytics" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3.5 font-sans text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </section>

      {/* Main Charts & Content Switcher */}
      {loading ? (
        <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center text-slate-400 h-96 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span>Parsing analytics dataset...</span>
          </div>
        </div>
      ) : report ? (
        <section className="space-y-6">
          
          {/* TAB 1: VISITORS & TRENDS */}
          {activeTab === "visitors" && (
            <div className="space-y-6">
              
              {/* Traffic Trends */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
                <div>
                  <h4 className="font-sans font-extrabold text-sm text-slate-800 uppercase tracking-wider">Visitor Traffic & Page Views (Last 7 Days)</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Daily comparison of unique visitors and cumulative page hits</p>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={report.visitorsTrend}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.2}/>
                          <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2}/>
                          <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "11px" }} />
                      <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                      <Area type="monotone" name="Unique Visitors" dataKey="visitors" stroke={COLORS.secondary} strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" />
                      <Area type="monotone" name="Page Views" dataKey="pageViews" stroke={COLORS.primary} strokeWidth={2} fillOpacity={1} fill="url(#colorPageViews)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Demographics & Devices */}
              <div className="grid lg:grid-cols-12 gap-6">
                
                {/* Traffic Referral Sources */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4 lg:col-span-8">
                  <div>
                    <h4 className="font-sans font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-secondary" />
                      <span>Traffic Referral Sources</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">Top referral domains and channels driving traffic</p>
                  </div>
                  <div className="h-64 w-full">
                    {report.trafficSources.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={report.trafficSources}
                          layout="vertical"
                          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                          <XAxis type="number" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                          <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} />
                          <Tooltip formatter={(v) => [`${v}%`, "Traffic Proportion"]} contentStyle={{ fontSize: "11px" }} />
                          <Bar dataKey="value" fill={COLORS.secondary} radius={[0, 4, 4, 0]}>
                            {report.trafficSources.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">No referrer links logged.</div>
                    )}
                  </div>
                </div>

                {/* Device Breakdown */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4 lg:col-span-4">
                  <div>
                    <h4 className="font-sans font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Laptop className="w-4 h-4 text-tertiary" />
                      <span>Device distribution</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">Session breakdown by desktop, mobile, and tablet</p>
                  </div>
                  <div className="h-64 w-full flex items-center justify-center">
                    {report.devices.length > 0 ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                        <div className="w-[150px] h-[150px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={report.devices}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={65}
                                paddingAngle={3}
                                dataKey="value"
                              >
                                {report.devices.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: "11px" }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-3 gap-2 w-full text-center text-[10px] font-bold text-slate-500">
                          {report.devices.map((d, index) => (
                            <div key={d.name} className="space-y-0.5">
                              <span className="w-2 h-2 rounded-full inline-block mr-1" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                              <span className="text-slate-600 block">{d.name}</span>
                              <span className="font-mono text-slate-800 text-xs block">{d.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">No device user-agent data.</div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: ACTIONS & CONVERSION FUNNELS */}
          {activeTab === "engagement" && (
            <div className="space-y-6">
              
              {/* Funnel & Status breakdown */}
              <div className="grid lg:grid-cols-12 gap-6">
                
                {/* Conversion Funnel */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4 lg:col-span-7">
                  <div>
                    <h4 className="font-sans font-extrabold text-sm text-slate-800 uppercase tracking-wider">Purchase Conversion Funnel</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Customer progression from home viewing to order checkout</p>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={funnelData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ fontSize: "11px" }} />
                        <Bar dataKey="count" fill={COLORS.primary} radius={[4, 4, 0, 0]}>
                          {funnelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Most Viewed Pages List */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4 lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <h4 className="font-sans font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-4.5 h-4.5 text-info" />
                      <span>Most Viewed Pages</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">Rankings of website urls by total hits</p>
                  </div>
                  
                  <div className="flex-grow my-4">
                    {report.topPages.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                        {report.topPages.map((page, idx) => (
                          <div key={page.path} className="flex justify-between items-center py-2.5 text-xs">
                            <div className="flex items-center gap-2 truncate">
                              <span className="w-5 h-5 rounded bg-slate-100 text-slate-500 font-bold flex items-center justify-center shrink-0 text-[10px]">{idx + 1}</span>
                              <span className="font-mono font-medium text-slate-600 truncate">{page.path}</span>
                            </div>
                            <span className="font-bold text-slate-800 shrink-0 font-mono">{page.views} Views</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">No page data.</div>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-400 font-medium bg-slate-50 p-2.5 rounded border border-slate-100">
                    A session's average duration is <b className="text-slate-600">{report.engagement.avgSessionDuration}</b> with a bounce rate of <b className="text-slate-600">{report.engagement.bounceRate}</b>.
                  </div>
                </div>

              </div>

              {/* Revenue Trends */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
                <div>
                  <h4 className="font-sans font-extrabold text-sm text-slate-800 uppercase tracking-wider">Revenue Trend (Last 7 Days)</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Daily summation of confirmed and delivered orders</p>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={report.revenueTrend}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2}/>
                          <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                      <Tooltip formatter={(value: any) => [`₹${value}`, "Revenue"]} contentStyle={{ fontSize: "11px" }} />
                      <Area type="monotone" dataKey="revenue" stroke={COLORS.primary} strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: PRODUCTS & SEARCH ANALYTICS */}
          {activeTab === "products" && (
            <div className="space-y-6">
              
              {/* Top Products View & Added to Cart */}
              <div className="grid lg:grid-cols-2 gap-6">
                
                {/* Most Viewed Products */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-sans font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-emerald-500" />
                      <span>Most Viewed Products</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">Rankings of organic produce catalog pages viewed</p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                        <tr>
                          <th className="px-4 py-2 text-center w-12">Rank</th>
                          <th className="px-4 py-2">Product</th>
                          <th className="px-4 py-2 text-right">Views</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {report.topViewedProducts.length > 0 ? (
                          report.topViewedProducts.map((p, idx) => (
                            <tr key={p.name} className="hover:bg-slate-50/40">
                              <td className="px-4 py-3 text-center font-bold text-slate-400">{idx + 1}</td>
                              <td className="px-4 py-3 font-semibold text-slate-700">{p.name}</td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-slate-600">{p.views}</td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-400 italic">No views registered yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Most Added to Cart Products */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-sans font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-secondary" />
                      <span>Most Added to Cart</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">Products most added to customer baskets</p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                        <tr>
                          <th className="px-4 py-2 text-center w-12">Rank</th>
                          <th className="px-4 py-2">Product</th>
                          <th className="px-4 py-2 text-right">Cart Additions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {report.topAddedToCartProducts.length > 0 ? (
                          report.topAddedToCartProducts.map((p, idx) => (
                            <tr key={p.name} className="hover:bg-slate-50/40">
                              <td className="px-4 py-3 text-center font-bold text-slate-400">{idx + 1}</td>
                              <td className="px-4 py-3 font-semibold text-slate-700">{p.name}</td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-slate-600">{p.adds}</td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-400 italic">No additions logged yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Product clicks & Search Queries */}
              <div className="grid lg:grid-cols-2 gap-6">
                
                {/* Most Clicked Products */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-sans font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <MousePointerClick className="w-4 h-4 text-info" />
                      <span>Most Clicked Products</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">Rankings of organic produce card clicks in catalog listings</p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                        <tr>
                          <th className="px-4 py-2 text-center w-12">Rank</th>
                          <th className="px-4 py-2">Product</th>
                          <th className="px-4 py-2 text-right">Clicks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {report.topClickedProducts.length > 0 ? (
                          report.topClickedProducts.map((p, idx) => (
                            <tr key={p.name} className="hover:bg-slate-50/40">
                              <td className="px-4 py-3 text-center font-bold text-slate-400">{idx + 1}</td>
                              <td className="px-4 py-3 font-semibold text-slate-700">{p.name}</td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-slate-600">{p.clicks}</td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-400 italic">No clicks registered.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Most Searched Queries */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-sans font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Search className="w-4 h-4 text-tertiary" />
                      <span>Most Searched Products</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">Top keywords customer entered in the search bar</p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                        <tr>
                          <th className="px-4 py-2 text-center w-12">Rank</th>
                          <th className="px-4 py-2">Keyword Query</th>
                          <th className="px-4 py-2 text-right">Searches count</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {report.topSearches.length > 0 ? (
                          report.topSearches.map((p, idx) => (
                            <tr key={p.query} className="hover:bg-slate-50/40">
                              <td className="px-4 py-3 text-center font-bold text-slate-400">{idx + 1}</td>
                              <td className="px-4 py-3 font-semibold font-mono text-slate-700">"{p.query}"</td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-slate-600">{p.count}</td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-400 italic">No keywords searched yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          )}
          
        </section>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center text-slate-400">
          No statistical aggregates could be compiled from the current analytics logs.
        </div>
      )}

    </div>
  );
}
