import { NextResponse } from "next/server";
import { 
  adjustInventory, 
  getStockHistory,
  verifyAdminApiRequest
} from "@/services/admin-service";

export async function GET(request: Request) {
  try {
    const isAdmin = await verifyAdminApiRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin permissions required." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId") || undefined;

    const history = await getStockHistory(productId);
    return NextResponse.json({ success: true, history });
  } catch (error: any) {
    console.error("GET stock history error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAdmin = await verifyAdminApiRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin permissions required." }, { status: 403 });
    }

    const body = await request.json();
    const { productId, adjustment, reason } = body;

    if (!productId || adjustment === undefined) {
      return NextResponse.json({ 
        success: false, 
        error: "Product ID (productId) and Adjustment quantity (adjustment) are required." 
      }, { status: 400 });
    }

    const newStock = await adjustInventory(productId, Number(adjustment), reason);
    return NextResponse.json({ 
      success: true, 
      newStock, 
      message: `Stock level adjusted successfully. New stock: ${newStock}` 
    });
  } catch (error: any) {
    console.error("POST stock adjust error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
