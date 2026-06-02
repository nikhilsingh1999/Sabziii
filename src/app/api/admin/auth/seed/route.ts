import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, uid, name } = body;
    
    if (!email || !uid) {
      return NextResponse.json({ success: false, error: "Email and UID are required" }, { status: 400 });
    }
    
    // Seed the user inside the Firestore "admins" collection
    await adminDb.collection("admins").doc(uid).set({
      email,
      name: name || "Super Admin",
      active: true,
      createdAt: new Date(),
    });
    
    return NextResponse.json({ 
      success: true, 
      message: `User ${email} has been successfully registered as an active Administrator.` 
    });
  } catch (error: any) {
    console.error("Admin seeding error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
