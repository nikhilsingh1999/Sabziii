import { NextResponse } from "next/server";
import { 
  getDashboardStats, 
  getAnalyticsReport,
  getCustomersList,
  verifyAdminApiRequest
} from "@/services/admin-service";

export async function GET(request: Request) {
  try {
    const isAdmin = await verifyAdminApiRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin permissions required." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";

    if (type === "stats") {
      const stats = await getDashboardStats();
      return NextResponse.json({ success: true, stats });
    } else if (type === "report") {
      const report = await getAnalyticsReport();
      return NextResponse.json({ success: true, report });
    } else if (type === "customers") {
      const customers = await getCustomersList();
      return NextResponse.json({ success: true, customers });
    }

    // Return combined dataset by default
    const stats = await getDashboardStats();
    const report = await getAnalyticsReport();
    return NextResponse.json({ success: true, stats, report });
  } catch (error: any) {
    console.error("GET analytics stats error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
