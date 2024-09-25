import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/frontend/products`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const productsApi = await response.json();
        const products = productsApi.data.rows;

        const productSitemaps: MetadataRoute.Sitemap = products.map((prod: any) => ({
            url: `https://gcart.com.bd/product/${prod.slug}`,
            lastModified: prod.updatedAt ? new Date(prod.updatedAt).toISOString() : new Date().toISOString(), // Optional
            changeFrequency: "weekly", // Optional, but you can set this based on how often the product data changes
            priority: 0.7 // Optional, can adjust based on page importance
        }));

        return [
            {
                url: "https://gcart.com.bd/about",
                lastModified: new Date().toISOString(),
                changeFrequency: "monthly",
                priority: 0.8
            },
            ...productSitemaps
        ];
    } catch (error) {
        console.error("Error generating sitemap:", error);
        return [
            {
                url: "https://gcart.com.bd/about",
                lastModified: new Date().toISOString(),
                changeFrequency: "monthly",
                priority: 0.8
            }
        ];
    }
}
