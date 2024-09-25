import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    try {
        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/frontend/products?limit=500`);
        if (!productsResponse.ok) {
            throw new Error(`Failed to fetch products: ${productsResponse.statusText}`);
        }
        const productsApi = await productsResponse.json();
        const products = productsApi.data.rows;

        const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?limit=100`);
        if (!categoriesResponse.ok) {
            throw new Error(`Failed to fetch categories: ${categoriesResponse.statusText}`);
        }
        const categoriesApi = await categoriesResponse.json();
        const categories = categoriesApi.data.rows;

        const productSitemaps: MetadataRoute.Sitemap = products.map((prod: any) => ({
            url: `https://gcart.com.bd/product/${encodeURIComponent(prod.slug)}`, // Encode slug
            lastModified: prod.updatedAt ? new Date(prod.updatedAt).toISOString() : new Date().toISOString(),
            priority: 0.7
        }));

        const categorySitemaps: MetadataRoute.Sitemap = categories.map((cat: any) => ({
            url: `https://gcart.com.bd/category/filter?category=${encodeURIComponent(cat.slug)}`, // Encode slug
            lastModified: cat.updatedAt ? new Date(cat.updatedAt).toISOString() : new Date().toISOString(),
            priority: 0.6
        }));
        return [
            // Static pages
            {
                url: "https://gcart.com.bd",
                lastModified: new Date().toISOString(),
                priority: 0.8
            },
            // Dynamic products
            ...productSitemaps,
            // Dynamic categories
            ...categorySitemaps,
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
            {
                url: "https://gcart.com.bd/emi",
                lastModified: new Date().toISOString(),
                priority: 0.8
            },
            {
                url: "https://gcart.com.bd/Privacy-Policy",
                lastModified: new Date().toISOString(),
                priority: 0.8
            },
            {
                url: "https://gcart.com.bd/Terms-Conditions",
                lastModified: new Date().toISOString(),
                priority: 0.8
            },
            {
                url: "https://gcart.com.bd/Return-Refund",
                lastModified: new Date().toISOString(),
                priority: 0.8
            },
            {
                url: "https://gcart.com.bd/Service-Center",
                lastModified: new Date().toISOString(),
                priority: 0.8
            },
            {
                url: "https://gcart.com.bd/campaign",
                lastModified: new Date().toISOString(),
                priority: 0.8
            },
            {
                url: "https://gcart.com.bd/blogs",
                lastModified: new Date().toISOString(),
                priority: 0.8
            },
            {
                url: "https://gcart.com.bd/videos",
                lastModified: new Date().toISOString(),
                priority: 0.8
            },
            
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
