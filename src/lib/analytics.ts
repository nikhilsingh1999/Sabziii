export interface GAEvent {
  name: string;
  params?: Record<string, any>;
}

// Client helper to track Google Analytics events and sync to local DB
export const trackEvent = async (name: string, params: Record<string, any> = {}) => {
  if (typeof window === "undefined") return;

  // 1. Push to window.gtag (Google Analytics 4 client-side event tracking)
  const gtag = (window as any).gtag;
  if (typeof gtag === "function") {
    try {
      gtag("event", name, params);
    } catch (e) {
      console.warn("GA4 Client Event Push Failed:", e);
    }
  }

  // 2. Push to local Firestore API logging route for admin dashboards
  try {
    // Check or generate a visitor ID
    let visitorId = localStorage.getItem("sabziii_visitor_id");
    if (!visitorId) {
      visitorId = "vis_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("sabziii_visitor_id", visitorId);
    }

    // Determine device categories
    let device = "Desktop";
    const ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
      device = "Tablet";
    } else if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(ua)) {
      device = "Mobile";
    }

    // Determine referrer sources
    let referrer = document.referrer || "Direct";
    if (referrer !== "Direct") {
      try {
        const refUrl = new URL(referrer);
        if (refUrl.hostname.includes("google.com")) {
          referrer = "Google Search";
        } else if (refUrl.hostname.includes("facebook.com")) {
          referrer = "Facebook";
        } else if (refUrl.hostname.includes("instagram.com")) {
          referrer = "Instagram";
        } else if (refUrl.hostname.includes("wa.me") || refUrl.hostname.includes("whatsapp.com")) {
          referrer = "WhatsApp";
        } else {
          referrer = refUrl.hostname; // E.g. other referral links
        }
      } catch (err) {
        referrer = "Referral Links";
      }
    }

    const payload = {
      name,
      params: {
        ...params,
        visitorId,
        device,
        referrer,
        path: window.location.pathname,
        title: document.title,
      },
      timestamp: new Date().toISOString()
    };

    // Send to local analytics API (async, non-blocking)
    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(() => {
      // Ignore API request failures to keep customer storefront uninterrupted
    });
  } catch (error) {
    // Suppress background tracking errors
  }
};
