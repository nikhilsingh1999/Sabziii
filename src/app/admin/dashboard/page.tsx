"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Loader2,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  deliveredOrders: number;
  recentOrders: {
    orderId: string;
    customerName: string;
    totalAmount: number;
    orderStatus: string;
    createdAt: string;
  }[];
}

interface ChartData {
  date: string;
  revenue: number;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/analytics");
        const data = await response.json();
        
        if (response.ok && data.success) {
          setStats(data.stats);
          setChartData(data.report?.revenueTrend || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-secondary text-sm font-semibold">Loading dashboard overview...</p>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const statCards = [
    {
      name: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: "text-emerald-500 bg-emerald-50 border-emerald-100",
      description: "Delivered & paid orders"
    },
    {
      name: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: "text-blue-500 bg-blue-50 border-blue-100",
      description: "Across all pipelines"
    },
    {
      name: "Total Customers",
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: "text-purple-500 bg-purple-50 border-purple-100",
      description: "Active buyers & guests"
    },
    {
      name: "Active Products",
      value: stats?.totalProducts || 0,
      icon: TrendingUp,
      color: "text-amber-500 bg-amber-50 border-amber-100",
      description: "In catalog"
    },
    {
      name: "Pending Orders",
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: "text-rose-500 bg-rose-50 border-rose-100",
      description: "Needs packing / delivery"
    },
    {
      name: "Delivered Orders",
      value: stats?.deliveredOrders || 0,
      icon: CheckCircle2,
      color: "text-sky-500 bg-sky-50 border-sky-100",
      description: "Completed successfully"
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Stat Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.name} 
              className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow transition-shadow flex items-start justify-between"
            >
              <div className="space-y-1 text-left">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.name}</p>
                <h3 className="font-sans font-extrabold text-2xl text-slate-800 leading-none">{card.value}</h3>
                <p className="text-[10px] text-slate-400 font-medium leading-normal pt-1">{card.description}</p>
              </div>
              <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${card.color} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </section>

      {/* Revenue Graph & Sales Overview */}
      <section className="grid lg:grid-cols-3 gap-6">
        
        {/* Graph (2 Columns) */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h3 className="font-sans font-extrabold text-base text-slate-800">Revenue Performance</h3>
              <p className="text-slate-400 text-xs font-medium">Daily transaction volumes for the past week</p>
            </div>
            <Link 
              href="/admin/analytics" 
              className="text-xs font-bold text-primary hover:text-primary-container flex items-center gap-0.5 hover:underline"
            >
              <span>Detailed Report</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-72 w-full pt-2">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                    labelStyle={{ fontFamily: "var(--font-plus-jakarta)", fontWeight: "bold", fontSize: "12px", color: "#334155" }}
                    itemStyle={{ fontFamily: "JetBrains Mono", fontSize: "12px", color: "#22c55e" }}
                    formatter={(value) => [`₹${value}`, "Revenue"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#22c55e" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-slate-200 rounded-lg text-slate-400 text-xs">
                No transaction data available yet. Place some mock orders!
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders Side Table (1 Column) */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="font-sans font-extrabold text-base text-slate-800">Recent Pipeline</h3>
                <p className="text-slate-400 text-xs font-medium">Latest customer order logs</p>
              </div>
              <Link 
                href="/admin/orders" 
                className="text-xs font-bold text-primary hover:text-primary-container flex items-center gap-0.5 hover:underline"
              >
                <span>View Orders</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => {
                  const statusColors: Record<string, string> = {
                    Pending: "bg-rose-50 text-rose-600 border-rose-100",
                    Confirmed: "bg-blue-50 text-blue-600 border-blue-100",
                    Packed: "bg-amber-50 text-amber-600 border-amber-100",
                    "Out For Delivery": "bg-sky-50 text-sky-600 border-sky-100",
                    Delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
                    Cancelled: "bg-slate-50 text-slate-500 border-slate-100",
                  };
                  return (
                    <div key={order.orderId} className="py-3 flex items-center justify-between text-xs">
                      <div className="text-left space-y-0.5 overflow-hidden">
                        <span className="font-sans font-bold text-slate-700 truncate block">{order.customerName}</span>
                        <span className="font-mono text-slate-400 text-[10px]">{order.orderId}</span>
                      </div>
                      <div className="text-right space-y-1 shrink-0">
                        <span className="font-sans font-extrabold text-slate-800 block">₹{order.totalAmount}</span>
                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${statusColors[order.orderStatus] || "bg-slate-50 text-slate-500"}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                  No orders logged yet.
                </div>
              )}
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
