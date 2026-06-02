import { NextResponse } from "next/server";
import { 
  getAllProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  verifyAdminApiRequest
} from "@/services/admin-service";

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error("GET products error:", error);
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
    const { 
      name, 
      slug, 
      categoryId, 
      categoryName, 
      description, 
      price, 
      discountPrice, 
      stock, 
      unit, 
      imageUrl, 
      active 
    } = body;

    if (!name || !slug || !categoryId || price === undefined || !unit) {
      return NextResponse.json({ 
        success: false, 
        error: "Name, Slug, Category, Price, and Unit are required fields." 
      }, { status: 400 });
    }

    const productId = await createProduct({
      name,
      slug,
      categoryId,
      categoryName: categoryName || "",
      description: description || "",
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      stock: stock ? Number(stock) : 0,
      unit,
      imageUrl: imageUrl || "",
      active: active !== false
    });

    return NextResponse.json({ success: true, productId });
  } catch (error: any) {
    console.error("POST product error:", error);
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
    const { 
      id, 
      name, 
      slug, 
      categoryId, 
      categoryName, 
      description, 
      price, 
      discountPrice, 
      stock, 
      unit, 
      imageUrl, 
      active 
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID (id) is required" }, { status: 400 });
    }

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (slug !== undefined) updates.slug = slug;
    if (categoryId !== undefined) updates.categoryId = categoryId;
    if (categoryName !== undefined) updates.categoryName = categoryName;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = Number(price);
    if (discountPrice !== undefined) updates.discountPrice = discountPrice ? Number(discountPrice) : 0;
    if (stock !== undefined) updates.stock = Number(stock);
    if (unit !== undefined) updates.unit = unit;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (active !== undefined) updates.active = active;

    await updateProduct(id, updates);
    return NextResponse.json({ success: true, message: "Product updated successfully" });
  } catch (error: any) {
    console.error("PUT product error:", error);
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
      return NextResponse.json({ success: false, error: "Product ID (id) is required" }, { status: 400 });
    }

    await deleteProduct(id);
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("DELETE product error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
