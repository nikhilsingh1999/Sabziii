import { NextResponse } from "next/server";
import { 
  getAllCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  verifyAdminApiRequest
} from "@/services/admin-service";

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error("GET categories error:", error);
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
    const { name, slug, active, description } = body;

    if (!name || !slug) {
      return NextResponse.json({ success: false, error: "Name and Slug are required" }, { status: 400 });
    }

    const categoryId = await createCategory({ 
      name, 
      slug, 
      active: active !== false,
      description: description || ""
    });
    
    return NextResponse.json({ success: true, categoryId });
  } catch (error: any) {
    console.error("POST category error:", error);
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
    const { id, name, slug, active, description } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Category ID (id) is required" }, { status: 400 });
    }

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (slug !== undefined) updates.slug = slug;
    if (active !== undefined) updates.active = active;
    if (description !== undefined) updates.description = description;

    await updateCategory(id, updates);
    return NextResponse.json({ success: true, message: "Category updated successfully" });
  } catch (error: any) {
    console.error("PUT category error:", error);
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
      return NextResponse.json({ success: false, error: "Category ID (id) is required" }, { status: 400 });
    }

    await deleteCategory(id);
    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    console.error("DELETE category error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
