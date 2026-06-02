import { getAllProducts, getAllCategories, getAllBanners } from "@/services/admin-service";

export async function getInitialStoreData() {
  try {
    const [fetchedProducts, fetchedCategories, fetchedBanners] = await Promise.all([
      getAllProducts().catch(() => []),
      getAllCategories().catch(() => []),
      getAllBanners().catch(() => [])
    ]);

    // Map products to the schema expected by client storefront pages
    const activeProducts = fetchedProducts
      .filter((p: any) => p.active !== false)
      .map((p: any) => {
        const categoryObj = fetchedCategories.find((c: any) => c.id === p.categoryId || c.slug === p.categoryId);
        const resolvedSlug = categoryObj ? categoryObj.slug : (p.categoryId || "vegetables");
        return {
          id: p.id,
          name: p.name,
          category: p.categoryName || "Vegetables",
          categorySlug: resolvedSlug,
          price: Number(p.price),
          originalPrice: p.discountPrice ? Number(p.price) : undefined,
          ...(p.discountPrice ? { price: Number(p.discountPrice), originalPrice: Number(p.price) } : {}),
          unit: p.unit || "kg",
          rating: p.rating || 4.7,
          reviewsCount: p.reviewsCount || 10,
          description: p.description || "",
          longDescription: p.description || "",
          stock: Number(p.stock || 0),
          isOrganic: p.isOrganic !== false,
          isPopular: p.isPopular === true,
          isSeasonal: p.isSeasonal === true,
          isSale: !!p.discountPrice,
          nutritionalFacts: p.nutritionalFacts || { calories: "30 kcal", carbs: "6g", protein: "1.2g", fat: "0.2g", fiber: "1.5g" },
          color: p.color || "bg-green-50 dark:bg-green-950/30",
          textColor: p.textColor || "text-green-800 dark:text-green-300",
          emoji: p.emoji || "🥬",
          image: p.imageUrl || "/images/products/spinach.png",
          active: true
        };
      });

    // Map categories to the schema expected by client storefront pages
    const categoryPresets: Record<string, { emoji: string; color: string }> = {
      "leafy-greens": { emoji: "🥬", color: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300" },
      "vegetables": { emoji: "🥦", color: "bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300" },
      "fruits": { emoji: "🍓", color: "bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300" },
      "exotics": { emoji: "✨", color: "bg-purple-50 dark:bg-purple-950/20 text-purple-800 dark:text-purple-300" }
    };

    const activeCategories = fetchedCategories
      .filter((c: any) => c.active !== false)
      .map((c: any) => {
        const preset = categoryPresets[c.slug] || { emoji: "🥗", color: "bg-slate-50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-300" };
        return {
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || "",
          active: true,
          emoji: preset.emoji,
          color: preset.color,
          count: activeProducts.filter((p: any) => p.categorySlug === c.slug).length
        };
      });

    // Map banners to the schema expected by client storefront pages
    const activeBanners = fetchedBanners
      .filter((b: any) => b.active !== false)
      .map((b: any) => ({
        id: b.id,
        title: b.title || "",
        link: b.link || "",
        imageUrl: b.imageUrl || "",
        active: true
      }));

    return {
      products: activeProducts,
      categories: activeCategories,
      banners: activeBanners
    };
  } catch (error) {
    console.error("Error loading server-side initial data store:", error);
    return { products: [], categories: [], banners: [] };
  }
}
