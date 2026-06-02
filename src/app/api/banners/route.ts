import { NextResponse } from "next/server";
import { 
  getAllBanners, 
  createBanner, 
  updateBanner, 
  deleteBanner, 
  verifyAdminApiRequest 
} from "@/services/admin-service";

export async function GET() {
  try {
    const banners = await getAllBanners();
    return NextResponse.json({ success: true, banners });
  } catch (error: any) {
    console.error("GET banners error:", error);
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
    const { title, link, imageUrl, active } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ success: false, error: "Title and Image URL are required." }, { status: 400 });
    }

    const bannerId = await createBanner({
      title,
      link: link || "/shop",
      imageUrl,
      active: active !== false
    });

    return NextResponse.json({ success: true, bannerId });
  } catch (error: any) {
    console.error("POST banner error:", error);
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
    const { id, title, link, imageUrl, active } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Banner ID (id) is required" }, { status: 400 });
    }

    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (link !== undefined) updates.link = link;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (active !== undefined) updates.active = active;

    await updateBanner(id, updates);
    return NextResponse.json({ success: true, message: "Banner updated successfully" });
  } catch (error: any) {
    console.error("PUT banner error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const isAdmin = await verifyAdminApiRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin permissions required." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Banner ID (id) is required" }, { status: 400 });
    }

    await deleteBanner(id);
    return NextResponse.json({ success: true, message: "Banner deleted successfully" });
  } catch (error: any) {
    console.error("DELETE banner error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
