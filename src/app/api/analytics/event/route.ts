import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import admin from "firebase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, params, timestamp } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Event name is required." }, { status: 400 });
    }

    const eventData = {
      name,
      params: params || {},
      timestamp: timestamp ? admin.firestore.Timestamp.fromDate(new Date(timestamp)) : admin.firestore.Timestamp.now(),
      createdAt: admin.firestore.Timestamp.now()
    };

    // Write directly using adminDb (bypasses Firestore client-side security rules)
    await adminDb.collection("analytics_events").add(eventData);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST analytics event error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
