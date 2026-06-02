import { NextResponse } from "next/server";
import { 
  getAllOrders, 
  updateOrderStatus,
  createOrder,
  verifyAdminApiRequest
} from "@/services/admin-service";

export async function GET(request: Request) {
  try {
    const isAdmin = await verifyAdminApiRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin permissions required." }, { status: 403 });
    }

    const orders = await getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("GET orders error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const isAdmin = await verifyAdminApiRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin permissions required." }, { status: 403 });
    }

    const body = await request.json();
    const { orderId, orderStatus, paymentStatus } = body;

    if (!orderId || !orderStatus) {
      return NextResponse.json({ 
        success: false, 
        error: "Order ID (orderId) and Order Status (orderStatus) are required." 
      }, { status: 400 });
    }

    await updateOrderStatus(orderId, orderStatus, paymentStatus);
    return NextResponse.json({ success: true, message: "Order status updated successfully" });
  } catch (error: any) {
    console.error("PUT order error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      userId, 
      customerName, 
      phone, 
      address, 
      items, 
      subtotal, 
      deliveryCharge, 
      totalAmount, 
      paymentMethod, 
      paymentStatus,
      orderStatus
    } = body;

    if (!customerName || !phone || !address || !items || !items.length) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required details: Customer Name, Phone, Address, or Cart Items." 
      }, { status: 400 });
    }

    const orderId = "SZ-" + Math.floor(100000 + Math.random() * 900000);

    const orderData = {
      orderId,
      userId: userId || "guest-" + phone,
      customerName,
      phone,
      address,
      items,
      subtotal: Number(subtotal),
      deliveryCharge: Number(deliveryCharge),
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentStatus || "Pending",
      orderStatus: orderStatus || "Pending"
    };

    const id = await createOrder(orderData);

    return NextResponse.json({ success: true, orderId: id, message: "Order placed successfully." });
  } catch (error: any) {
    console.error("POST place order error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
