import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    try {
        // Fetch products from API
        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/frontend/products?limit=500`);
        if (!productsResponse.ok) {
            throw new Error(`Failed to fetch products: ${productsResponse.statusText}`);
        }
        const productsApi = await productsResponse.json();
        const products = productsApi.data.rows;

        // Fetch categories from API
        const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?limit=100`);
        if (!categoriesResponse.ok) {
            throw new Error(`Failed to fetch categories: ${categoriesResponse.statusText}`);
        }
        const categoriesApi = await categoriesResponse.json();
        const categories = categoriesApi.data.rows;

        // Map products to sitemap format
        const productSitemaps: MetadataRoute.Sitemap = products.map((prod: any) => ({
            url: `https://gcart.com.bd/product/${prod.slug}`,
            lastModified: prod.updatedAt ? new Date(prod.updatedAt).toISOString() : new Date().toISOString(),
            priority: 0.7
        }));

        // Map categories to sitemap format
        const categorySitemaps: MetadataRoute.Sitemap = categories.map((cat: any) => ({
            url: `https://gcart.com.bd/category/filter?category=${cat.slug}`,
            lastModified: cat.updatedAt ? new Date(cat.updatedAt).toISOString() : new Date().toISOString(),
            priority: 0.6
        }));

        // Return the combined sitemap
        return [
            // Static pages
            {
                url: "https://gcart.com.bd/about",
                lastModified: new Date().toISOString(),
                priority: 0.8
            },
            {
                url: "https://gcart.com.bd/contact",
                lastModified: new Date().toISOString(),
                priority: 0.8
            },
            {
                url: "https://gcart.com.bd/faq",
                lastModified: new Date().toISOString(),
                priority: 0.8
            },
            // Dynamic products
            ...productSitemaps,
            // Dynamic categories
            ...categorySitemaps
        ];
    } catch (error) {
        console.error("Error generating sitemap:", error);
        return [
            {
                url: "https://gcart.com.bd/about",
                lastModified: new Date().toISOString(),
                priority: 0.8
            }
        ];
    }
}
