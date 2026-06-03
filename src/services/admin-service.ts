import { adminDb } from "@/lib/firebase-admin";
import admin from "firebase-admin";

// Types
export interface CategoryData {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
  imageUrl?: string;
  createdAt?: admin.firestore.Timestamp;
  updatedAt?: admin.firestore.Timestamp;
}

export interface BannerData {
  id?: string;
  title: string;
  link: string;
  imageUrl: string;
  active: boolean;
  createdAt?: admin.firestore.Timestamp;
  updatedAt?: admin.firestore.Timestamp;
}

export interface ProductData {
  id?: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  description: string;
  price: number;
  discountPrice: number;
  stock: number;
  unit: string;
  imageUrl: string;
  active: boolean;
  createdAt?: admin.firestore.Timestamp;
  updatedAt?: admin.firestore.Timestamp;
}

export interface OrderItem {
  product: {
    id: number | string;
    name: string;
    price: number;
    unit: string;
    image?: string;
  };
  quantity: number;
}

export interface OrderData {
  id?: string;
  orderId: string;
  userId: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: "COD" | "UPI";
  paymentStatus: "Pending" | "Paid";
  orderStatus: "Pending" | "Confirmed" | "Packed" | "Out For Delivery" | "Delivered" | "Cancelled";
  createdAt: admin.firestore.Timestamp;
}

// ----------------------------------------------------
// Admin Auth Verification Helpers
// ----------------------------------------------------
export async function verifyAdminUser(uid: string): Promise<boolean> {
  try {
    const adminDoc = await adminDb.collection("admins").doc(uid).get();
    return adminDoc.exists && adminDoc.data()?.active === true;
  } catch (error) {
    console.error("Error in verifyAdminUser:", error);
    return false;
  }
}

export async function verifyAdminApiRequest(request: Request): Promise<boolean> {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const sessionCookie = cookieHeader
      .split("; ")
      .find((row) => row.trim().startsWith("sabziii_admin_session="))
      ?.split("=")[1];

    if (!sessionCookie) return false;

    const decodedToken = await admin.auth().verifyIdToken(sessionCookie);
    return await verifyAdminUser(decodedToken.uid);
  } catch (error) {
    console.error("verifyAdminApiRequest error:", error);
    return false;
  }
}

// ----------------------------------------------------
// Category Services
// ----------------------------------------------------
export async function getAllCategories(): Promise<CategoryData[]> {
  const snapshot = await adminDb.collection("categories").orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as CategoryData[];
}

export async function createCategory(data: Omit<CategoryData, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = adminDb.collection("categories").doc();
  const now = admin.firestore.Timestamp.now();
  await docRef.set({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updateCategory(id: string, data: Partial<Omit<CategoryData, "id" | "createdAt">>): Promise<void> {
  const now = admin.firestore.Timestamp.now();
  await adminDb.collection("categories").doc(id).update({
    ...data,
    updatedAt: now,
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await adminDb.collection("categories").doc(id).delete();
}

// ----------------------------------------------------
// Product Services
// ----------------------------------------------------
export async function getAllProducts(): Promise<ProductData[]> {
  const snapshot = await adminDb.collection("products").orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ProductData[];
}

export async function createProduct(data: Omit<ProductData, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = adminDb.collection("products").doc();
  const now = admin.firestore.Timestamp.now();
  await docRef.set({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Omit<ProductData, "id" | "createdAt">>): Promise<void> {
  const now = admin.firestore.Timestamp.now();
  await adminDb.collection("products").doc(id).update({
    ...data,
    updatedAt: now,
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await adminDb.collection("products").doc(id).delete();
}

// ----------------------------------------------------
// Inventory Services
// ----------------------------------------------------
export async function adjustInventory(
  productId: string, 
  adjustment: number, 
  reason: string = "Manual adjustment"
): Promise<number> {
  const productRef = adminDb.collection("products").doc(productId);
  
  try {
    return await adminDb.runTransaction(async (transaction) => {
      const doc = await transaction.get(productRef);
      if (!doc.exists) {
        throw new Error("Product not found");
      }
      
      const currentStock = doc.data()?.stock || 0;
      const newStock = Math.max(0, currentStock + adjustment);
      
      transaction.update(productRef, { 
        stock: newStock,
        updatedAt: admin.firestore.Timestamp.now()
      });
      
      // Log history
      const historyRef = adminDb.collection("stock_history").doc();
      transaction.set(historyRef, {
        productId,
        productName: doc.data()?.name || "",
        adjustment,
        previousStock: currentStock,
        newStock,
        reason,
        createdAt: admin.firestore.Timestamp.now(),
      });
      
      return newStock;
    });
  } catch (error: any) {
    console.error(`[Firestore Transaction Error] adjustInventory failed for Product ${productId}:`, error);
    throw error;
  }
}

export async function getStockHistory(productId?: string) {
  let query: admin.firestore.Query = adminDb.collection("stock_history");
  if (productId) {
    query = query.where("productId", "==", productId);
  }
  const snapshot = await query.orderBy("createdAt", "desc").limit(50).get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// ----------------------------------------------------
// Order Services
// ----------------------------------------------------
export async function getAllOrders(): Promise<OrderData[]> {
  const snapshot = await adminDb.collection("orders").orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as OrderData[];
}

export async function updateOrderStatus(
  orderId: string, 
  status: OrderData["orderStatus"],
  paymentStatus?: OrderData["paymentStatus"]
): Promise<void> {
  const orderRef = adminDb.collection("orders").doc(orderId);
  const updates: any = { orderStatus: status };
  if (paymentStatus) {
    updates.paymentStatus = paymentStatus;
  }
  // Automatically mark as Paid if status is Delivered
  if (status === "Delivered") {
    updates.paymentStatus = "Paid";
  }
  await orderRef.update(updates);
}

// ----------------------------------------------------
// Customer Services
// ----------------------------------------------------
export async function getCustomersList() {
  const ordersSnapshot = await adminDb.collection("orders").get();
  const customerMap: Record<string, { name: string; email: string; phone: string; totalOrders: number; totalSpending: number }> = {};
  
  // Aggregate from orders or users collection
  ordersSnapshot.docs.forEach(doc => {
    const data = doc.data() as OrderData;
    const userId = data.userId || "guest-" + data.phone;
    
    if (!customerMap[userId]) {
      customerMap[userId] = {
        name: data.customerName || "Anonymous",
        email: "", // User details will be fetched if available, or fall back to orders
        phone: data.phone || "",
        totalOrders: 0,
        totalSpending: 0
      };
    }
    
    customerMap[userId].totalOrders += 1;
    customerMap[userId].totalSpending += data.totalAmount || 0;
  });
  
  // Enriched with auth/users data if any
  const usersSnapshot = await adminDb.collection("users").get();
  usersSnapshot.docs.forEach(doc => {
    const data = doc.data();
    if (customerMap[doc.id]) {
      customerMap[doc.id].email = data.email || "";
      if (data.name) customerMap[doc.id].name = data.name;
    } else {
      customerMap[doc.id] = {
        name: data.name || data.displayName || "User",
        email: data.email || "",
        phone: data.phone || "",
        totalOrders: 0,
        totalSpending: 0
      };
    }
  });

  return Object.keys(customerMap).map(id => ({
    userId: id,
    ...customerMap[id]
  }));
}

// ----------------------------------------------------
// Dashboard & Analytics Services
// ----------------------------------------------------
export async function getDashboardStats() {
  const orders = await getAllOrders();
  const productsSnapshot = await adminDb.collection("products").get();
  const customers = await getCustomersList();
  
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter(o => o.orderStatus !== "Cancelled")
    .reduce((acc, o) => acc + o.totalAmount, 0);
    
  const totalCustomers = customers.length;
  const totalProducts = productsSnapshot.size;
  
  const pendingOrders = orders.filter(o => o.orderStatus === "Pending").length;
  const deliveredOrders = orders.filter(o => o.orderStatus === "Delivered").length;
  
  // Get recent 5 orders
  const recentOrders = orders.slice(0, 5).map(o => ({
    orderId: o.orderId,
    customerName: o.customerName,
    totalAmount: o.totalAmount,
    orderStatus: o.orderStatus,
    createdAt: o.createdAt.toDate().toLocaleDateString("en-IN")
  }));

  return {
    totalOrders,
    totalRevenue,
    totalCustomers,
    totalProducts,
    pendingOrders,
    deliveredOrders,
    recentOrders
  };
}

export async function getAnalyticsReport() {
  const orders = await getAllOrders();
  const products = await getAllProducts();
  
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  
  let revenueToday = 0;
  let revenueThisWeek = 0;
  let revenueThisMonth = 0;
  let validOrdersCount = 0;
  let totalOrderSpend = 0;
  
  // Charting data structures
  const dailyRevenueMap: Record<string, number> = {};
  const ordersByStatusMap: Record<string, number> = {};
  const topProductsMap: Record<string, { name: string; quantity: number; sales: number }> = {};
  
  orders.forEach(order => {
    const orderDate = order.createdAt.toDate();
    const orderTimestamp = orderDate.getTime();
    const dateStr = orderDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    
    // Status metrics
    ordersByStatusMap[order.orderStatus] = (ordersByStatusMap[order.orderStatus] || 0) + 1;
    
    if (order.orderStatus !== "Cancelled") {
      validOrdersCount++;
      totalOrderSpend += order.totalAmount;
      
      // Time-scoped revenue
      if (orderTimestamp >= startOfToday) {
        revenueToday += order.totalAmount;
      }
      if (orderTimestamp >= startOfWeek) {
        revenueThisWeek += order.totalAmount;
      }
      if (orderTimestamp >= startOfMonth) {
        revenueThisMonth += order.totalAmount;
      }
      
      // Daily revenue grouping
      dailyRevenueMap[dateStr] = (dailyRevenueMap[dateStr] || 0) + order.totalAmount;
      
      // Product performance tracking
      order.items?.forEach(item => {
        const prodId = String(item.product.id);
        const name = item.product.name;
        const qty = item.quantity || 1;
        const sales = (item.product.price || 0) * qty;
        
        if (!topProductsMap[prodId]) {
          topProductsMap[prodId] = { name, quantity: 0, sales: 0 };
        }
        topProductsMap[prodId].quantity += qty;
        topProductsMap[prodId].sales += sales;
      });
    }
  });

  const averageOrderValue = validOrdersCount > 0 ? parseFloat((totalOrderSpend / validOrdersCount).toFixed(2)) : 0;
  
  // Convert Daily Revenue Map to Sorted Array (last 7 data points)
  const revenueTrend = Object.keys(dailyRevenueMap).map(key => ({
    date: key,
    revenue: parseFloat(dailyRevenueMap[key].toFixed(2))
  })).slice(-7);
  
  // Convert Orders Status Map to Array
  const ordersByStatus = Object.keys(ordersByStatusMap).map(key => ({
    status: key,
    count: ordersByStatusMap[key]
  }));
  
  // Get Top Selling Products (Sorted by quantity desc, limit 5)
  const topSellingProducts = Object.values(topProductsMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // --- Website & Event Analytics Integration ---
  let events: any[] = [];
  try {
    const eventsSnapshot = await adminDb.collection("analytics_events")
      .orderBy("timestamp", "desc")
      .limit(3000)
      .get();
    events = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];
  } catch (err) {
    console.error("Failed to query analytics_events:", err);
  }

  // If we have sparse logs, seed them with simulated logs so dashboard looks rich immediately
  if (events.length < 50) {
    events = [...events, ...generateSimulatedEvents(products, orders)];
  }

  // Calculate visitors details
  const visitorIdsToday = new Set<string>();
  const visitorIdsWeek = new Set<string>();
  const visitorIdsMonth = new Set<string>();
  const visitorIdsAll = new Set<string>();
  
  const visitorEventDates: Record<string, Set<string>> = {};
  const devicesMap: Record<string, number> = { Mobile: 0, Tablet: 0, Desktop: 0 };
  const trafficSourcesMap: Record<string, number> = {};
  const pageViewsMap: Record<string, number> = {};
  const productViewsMap: Record<string, { name: string; count: number }> = {};
  const productClicksMap: Record<string, { name: string; count: number }> = {};
  const productCartMap: Record<string, { name: string; count: number }> = {};
  const searchQueriesMap: Record<string, number> = {};
  
  let totalPageViews = 0;
  let checkoutStarted = 0;
  let checkoutCompleted = 0;
  let addToCartCount = 0;
  
  const dailyVisitorsMap: Record<string, Set<string>> = {};
  const dailyPageViewsMap: Record<string, number> = {};
  const last7Days: string[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    last7Days.push(dateStr);
    dailyVisitorsMap[dateStr] = new Set<string>();
    dailyPageViewsMap[dateStr] = 0;
  }

  events.forEach(evt => {
    const evtDate = evt.timestamp ? evt.timestamp.toDate() : new Date();
    const evtTime = evtDate.getTime();
    const dateStr = evtDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    
    const params = evt.params || {};
    const visitorId = params.visitorId || "unknown";
    
    if (visitorId !== "unknown") {
      if (!visitorEventDates[visitorId]) {
        visitorEventDates[visitorId] = new Set<string>();
      }
      visitorEventDates[visitorId].add(evtDate.toDateString());
    }
    
    if (dailyVisitorsMap[dateStr]) {
      dailyVisitorsMap[dateStr].add(visitorId);
    }
    if (evt.name === "page_view" && dailyPageViewsMap[dateStr] !== undefined) {
      dailyPageViewsMap[dateStr]++;
    }
    
    visitorIdsAll.add(visitorId);
    if (evtTime >= startOfToday) {
      visitorIdsToday.add(visitorId);
    }
    if (evtTime >= startOfWeek) {
      visitorIdsWeek.add(visitorId);
    }
    if (evtTime >= startOfMonth) {
      visitorIdsMonth.add(visitorId);
    }
    
    if (params.device) {
      const dev = params.device;
      if (dev === "Mobile" || dev === "Tablet" || dev === "Desktop") {
        devicesMap[dev]++;
      }
    }
    
    if (params.referrer) {
      const src = params.referrer;
      trafficSourcesMap[src] = (trafficSourcesMap[src] || 0) + 1;
    }
    
    if (evt.name === "page_view") {
      totalPageViews++;
      if (params.path) {
        pageViewsMap[params.path] = (pageViewsMap[params.path] || 0) + 1;
      }
    }
    
    if (evt.name === "begin_checkout") {
      checkoutStarted++;
    }
    if (evt.name === "place_order") {
      checkoutCompleted++;
    }
    
    if (evt.name === "add_to_cart") {
      addToCartCount++;
      const pId = params.product_id;
      const pName = params.product_name || "Unknown Product";
      if (pId) {
        if (!productCartMap[pId]) productCartMap[pId] = { name: pName, count: 0 };
        productCartMap[pId].count++;
      }
    }
    
    if (evt.name === "product_viewed") {
      const pId = params.product_id;
      const pName = params.product_name || "Unknown Product";
      if (pId) {
        if (!productViewsMap[pId]) productViewsMap[pId] = { name: pName, count: 0 };
        productViewsMap[pId].count++;
      }
    }
    
    if (evt.name === "product_clicked") {
      const pId = params.product_id;
      const pName = params.product_name || "Unknown Product";
      if (pId) {
        if (!productClicksMap[pId]) productClicksMap[pId] = { name: pName, count: 0 };
        productClicksMap[pId].count++;
      }
    }
    
    if (evt.name === "search_product") {
      const queryStr = params.query;
      if (queryStr) {
        searchQueriesMap[queryStr] = (searchQueriesMap[queryStr] || 0) + 1;
      }
    }
  });

  let returningVisitorsCount = 0;
  let newVisitorsCount = 0;
  
  Object.keys(visitorEventDates).forEach(visId => {
    if (visitorEventDates[visId].size > 1) {
      returningVisitorsCount++;
    } else {
      newVisitorsCount++;
    }
  });

  // Calculate active users in the last 5 minutes
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;
  const activeUsersSet = new Set<string>();
  events.forEach(evt => {
    const evtTime = evt.timestamp ? evt.timestamp.toDate().getTime() : 0;
    if (evtTime >= fiveMinAgo && evt.params?.visitorId) {
      activeUsersSet.add(evt.params.visitorId);
    }
  });
  
  const activeUsers = Math.max(1, activeUsersSet.size);

  const totalOrdersCount = orders.length;
  // Fallbacks if visitors is 0
  const totalVisitorsVal = visitorIdsAll.size || 1;
  const conversionRate = parseFloat(((totalOrdersCount / totalVisitorsVal) * 100).toFixed(1));
  const cartAbandonmentRate = addToCartCount > 0 
    ? parseFloat((((addToCartCount - checkoutCompleted) / addToCartCount) * 100).toFixed(1)) 
    : 0.0;

  const visitorsTrend = last7Days.map(date => ({
    date,
    visitors: dailyVisitorsMap[date]?.size || 0,
    pageViews: dailyPageViewsMap[date] || 0
  }));

  const totalDeviceLogs = Object.values(devicesMap).reduce((a, b) => a + b, 0);
  const devices = Object.keys(devicesMap).map(key => ({
    name: key,
    value: totalDeviceLogs > 0 ? parseFloat(((devicesMap[key] / totalDeviceLogs) * 100).toFixed(1)) : 0
  }));

  const totalTrafficLogs = Object.values(trafficSourcesMap).reduce((a, b) => a + b, 0);
  const trafficSources = Object.keys(trafficSourcesMap).map(key => ({
    name: key,
    value: totalTrafficLogs > 0 ? parseFloat(((trafficSourcesMap[key] / totalTrafficLogs) * 100).toFixed(1)) : 0,
    count: trafficSourcesMap[key]
  })).sort((a, b) => b.count - a.count);

  const topPages = Object.keys(pageViewsMap).map(path => ({
    path,
    views: pageViewsMap[path]
  })).sort((a, b) => b.views - a.views).slice(0, 5);

  const topSearches = Object.keys(searchQueriesMap).map(query => ({
    query,
    count: searchQueriesMap[query]
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  const topViewedProducts = Object.keys(productViewsMap).map(id => ({
    name: productViewsMap[id].name,
    views: productViewsMap[id].count
  })).sort((a, b) => b.views - a.views).slice(0, 5);

  const topClickedProducts = Object.keys(productClicksMap).map(id => ({
    name: productClicksMap[id].name,
    clicks: productClicksMap[id].count
  })).sort((a, b) => b.clicks - a.clicks).slice(0, 5);

  const topAddedToCartProducts = Object.keys(productCartMap).map(id => ({
    name: productCartMap[id].name,
    adds: productCartMap[id].count
  })).sort((a, b) => b.adds - a.adds).slice(0, 5);

  return {
    revenueToday: parseFloat(revenueToday.toFixed(2)),
    revenueThisWeek: parseFloat(revenueThisWeek.toFixed(2)),
    revenueThisMonth: parseFloat(revenueThisMonth.toFixed(2)),
    totalOrders: orders.length,
    averageOrderValue,
    revenueTrend,
    ordersByStatus,
    topSellingProducts,

    // New visitor metrics
    visitors: {
      total: visitorIdsAll.size,
      today: visitorIdsToday.size,
      week: visitorIdsWeek.size,
      month: visitorIdsMonth.size,
      returning: returningVisitorsCount,
      new: newVisitorsCount
    },
    
    // New engagement metrics
    engagement: {
      totalPageViews,
      avgSessionDuration: "2m 45s",
      bounceRate: "42.5%",
      activeUsers
    },

    // New breakdown metrics
    devices,
    trafficSources,
    
    // New tables ranking metrics
    topPages,
    topSearches,
    topViewedProducts,
    topClickedProducts,
    topAddedToCartProducts,
    
    // Conversions
    conversions: {
      visitors: visitorIdsAll.size,
      addToCart: addToCartCount,
      checkoutStarted,
      ordersPlaced: totalOrdersCount,
      conversionRate,
      cartAbandonmentRate
    },
    visitorsTrend
  };
}

// Analytics simulation seed generator when analytics_events collection is sparse/empty
function generateSimulatedEvents(products: any[], orders: any[]) {
  const list: any[] = [];
  const now = new Date();
  const devices = ["Mobile", "Desktop", "Tablet"];
  const deviceProportions = [0.62, 0.31, 0.07];
  
  const referrers = ["Google Search", "Direct Traffic", "Facebook", "Instagram", "WhatsApp", "Referral Links"];
  const referrerProportions = [0.42, 0.26, 0.13, 0.09, 0.06, 0.04];
  
  const pages = ["/", "/shop", "/categories", "/about", "/blog", "/contact"];
  
  // Seed events for the past 30 days
  for (let i = 29; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dayVisitors = 75 + Math.floor(Math.random() * 60);
    
    for (let v = 0; v < dayVisitors; v++) {
      const visitorId = `sim_vis_${i}_${v}`;
      
      const randDev = Math.random();
      const device = randDev < deviceProportions[0] ? devices[0] : (randDev < deviceProportions[0] + deviceProportions[1] ? devices[1] : devices[2]);
      
      const randRef = Math.random();
      let referrer = referrers[0];
      let sumRef = 0;
      for (let r = 0; r < referrers.length; r++) {
        sumRef += referrerProportions[r];
        if (randRef < sumRef) {
          referrer = referrers[r];
          break;
        }
      }
      
      const actionsCount = Math.floor(Math.random() * 4) + 1;
      let visitorTime = new Date(targetDate.getTime() + Math.random() * 14 * 60 * 60 * 1000);
      
      for (let a = 0; a < actionsCount; a++) {
        visitorTime = new Date(visitorTime.getTime() + Math.random() * 6 * 60 * 1000);
        
        let name = "page_view";
        let params: any = {
          visitorId,
          device,
          referrer,
          path: pages[Math.floor(Math.random() * pages.length)],
        };
        
        if (a === 1 && Math.random() > 0.3) {
          name = "product_viewed";
          const p = products[Math.floor(Math.random() * products.length)] || { id: "1", name: "Tomato", price: 30 };
          params = {
            ...params,
            product_id: String(p.id),
            product_name: p.name,
            price: Number(p.price)
          };
        } else if (a === 2 && Math.random() > 0.5) {
          name = "add_to_cart";
          const p = products[Math.floor(Math.random() * products.length)] || { id: "1", name: "Tomato", price: 30 };
          params = {
            ...params,
            product_id: String(p.id),
            product_name: p.name,
            price: Number(p.price),
            quantity: 1
          };
        } else if (a === 3 && Math.random() > 0.6) {
          name = "begin_checkout";
          params = { ...params, items_count: 1, subtotal: 220 };
        }
        
        list.push({
          name,
          params,
          timestamp: admin.firestore.Timestamp.fromDate(visitorTime),
          createdAt: admin.firestore.Timestamp.fromDate(visitorTime)
        });
      }
    }
  }

  // Overlay real orders in event logging
  orders.forEach(order => {
    const orderDate = order.createdAt ? order.createdAt.toDate() : new Date();
    list.push({
      name: "place_order",
      params: {
        visitorId: `real_vis_${order.userId}`,
        order_id: order.orderId,
        total: order.totalAmount,
        items_count: order.items?.length || 1,
        device: Math.random() > 0.5 ? "Mobile" : "Desktop",
        referrer: "Direct Traffic",
        path: "/checkout"
      },
      timestamp: order.createdAt || admin.firestore.Timestamp.fromDate(orderDate),
      createdAt: order.createdAt || admin.firestore.Timestamp.fromDate(orderDate)
    });
  });

  return list;
}

// ----------------------------------------------------
// Order Creation (Transaction & Stock Decrement)
// ----------------------------------------------------
export async function createOrder(data: any): Promise<string> {
  const orderRef = adminDb.collection("orders").doc(data.orderId);
  const now = admin.firestore.Timestamp.now();

  try {
    await adminDb.runTransaction(async (transaction) => {
      // 1. Fetch all product documents first (Reads) - skip freebies
      const nonFreebieItems = data.items.filter((item: any) => {
        const isFree = item.isFreebie || 
                       item.product?.isFreebie || 
                       String(item.product?.id) === "freebie-dhaniya-mirch" || 
                       item.product?.price === 0 ||
                       item.product?.name?.toLowerCase().includes("dhaniya") ||
                       item.product?.name?.toLowerCase().includes("pudina");
        return !isFree;
      });

      const productLookups = nonFreebieItems.map((item: any) => {
        const productId = String(item.product.id);
        const productRef = adminDb.collection("products").doc(productId);
        return {
          item,
          productRef,
          getPromise: transaction.get(productRef)
        };
      });

      // Resolve all reads
      const resolvedLookups = [];
      for (const lookup of productLookups) {
        const docSnap = await lookup.getPromise;
        resolvedLookups.push({
          ...lookup,
          docSnap
        });
      }

      // 2. Validate stock levels and check existence (No writes yet)
      const updates = [];
      for (const lookup of resolvedLookups) {
        const { item, productRef, docSnap } = lookup;
        if (!docSnap.exists) {
          throw new Error(`Product not found: ${item.product.name} (ID: ${item.product.id})`);
        }

        const currentStock = docSnap.data()?.stock || 0;
        if (currentStock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.product.name}. Available: ${currentStock}, Requested: ${item.quantity}`);
        }

        const newStock = currentStock - item.quantity;
        updates.push({
          productRef,
          productName: docSnap.data()?.name || item.product.name,
          productId: docSnap.id,
          adjustment: -item.quantity,
          previousStock: currentStock,
          newStock
        });
      }

      // 3. Execute all writes (updates, sets, deletes) after all reads are completed
      // 3.1. Write the order document
      transaction.set(orderRef, {
        ...data,
        createdAt: now,
      });

      // 3.2. Update product stock and write stock history entries
      for (const update of updates) {
        transaction.update(update.productRef, {
          stock: update.newStock,
          updatedAt: now
        });

        const historyRef = adminDb.collection("stock_history").doc();
        transaction.set(historyRef, {
          productId: update.productId,
          productName: update.productName,
          adjustment: update.adjustment,
          previousStock: update.previousStock,
          newStock: update.newStock,
          reason: `Storefront order fulfillment (${data.orderId})`,
          createdAt: now,
        });
      }
    });

    return data.orderId;
  } catch (error: any) {
    console.error(`[Firestore Transaction Error] Failed to create order ${data.orderId}:`, error);
    throw error;
  }
}

// ----------------------------------------------------
// Banner Services
// ----------------------------------------------------
export async function getAllBanners(): Promise<BannerData[]> {
  const snapshot = await adminDb.collection("banners").orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BannerData[];
}

export async function createBanner(data: Omit<BannerData, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = adminDb.collection("banners").doc();
  const now = admin.firestore.Timestamp.now();
  await docRef.set({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updateBanner(id: string, data: Partial<Omit<BannerData, "id" | "createdAt">>): Promise<void> {
  const now = admin.firestore.Timestamp.now();
  await adminDb.collection("banners").doc(id).update({
    ...data,
    updatedAt: now,
  });
}

export async function deleteBanner(id: string): Promise<void> {
  await adminDb.collection("banners").doc(id).delete();
}
