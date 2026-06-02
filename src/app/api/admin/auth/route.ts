import { NextResponse } from "next/server";
import admin, { adminDb } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const sessionCookie = cookieHeader
      .split("; ")
      .find((row) => row.trim().startsWith("sabziii_admin_session="))
      ?.split("=")[1];

    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: "Unauthorized. No session cookie found." }, { status: 401 });
    }

    // Verify the session token using Admin SDK (bypasses Firestore Security Rules)
    const decodedToken = await admin.auth().verifyIdToken(sessionCookie);
    const uid = decodedToken.uid;

    const adminDoc = await adminDb.collection("admins").doc(uid).get();

    if (!adminDoc.exists || adminDoc.data()?.active !== true) {
      return NextResponse.json({ 
        success: false, 
        error: "Access denied. Not an authorized admin user." 
      }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      admin: {
        uid,
        email: decodedToken.email,
        name: adminDoc.data()?.name || decodedToken.name || "Admin User"
      }
    });
  } catch (error: any) {
    console.error("GET admin auth validation error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken, action } = body;

    // Handle logout action
    if (action === "logout") {
      const response = NextResponse.json({ success: true, message: "Logged out successfully" });
      response.cookies.delete("sabziii_admin_session");
      return response;
    }

    if (!idToken) {
      return NextResponse.json({ success: false, error: "ID token is required" }, { status: 400 });
    }

    // Verify the Firebase ID Token using the Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Check if the user exists in the Firestore "admins" collection
    const adminDoc = await adminDb.collection("admins").doc(uid).get();
    
    if (!adminDoc.exists || adminDoc.data()?.active !== true) {
      return NextResponse.json({ 
        success: false, 
        error: "Access denied. This account is not authorized as an active admin." 
      }, { status: 403 });
    }

    // Prepare success response
    const response = NextResponse.json({ 
      success: true, 
      admin: {
        uid,
        email: decodedToken.email,
        name: adminDoc.data()?.name || decodedToken.name || "Admin User"
      }
    });

    // Set secure HttpOnly cookie for middleware route protection
    response.cookies.set("sabziii_admin_session", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 5, // 5 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Firebase admin auth error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to authenticate session." 
    }, { status: 500 });
  }
}
