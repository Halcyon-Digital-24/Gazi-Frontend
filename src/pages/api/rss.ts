import { NextApiRequest, NextApiResponse } from 'next';

const siteUrl = 'https://gcart.com.bd';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300');

  try {
    const { type } = req.query;
    if (!type) {
      res.status(400).end('Missing RSS feed type');
      return;
    }

    switch (type) {
      case 'products':
        await generateProductFeed(res);
        break;
      case 'categories':
        await generateCategoryFeed(res);
        break;
      case 'blogs':
        await generateBlogFeed(res);
        break;
      default:
        res.status(400).send("Invalid RSS feed type");
        break;
    }
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    res.status(500).send("Error generating RSS feed");
  }
}

// Generate Products RSS Feed
async function generateProductFeed(res: NextApiResponse) {
  const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/frontend/products?limit=500`);

  if (!productsResponse.ok) {
    throw new Error(`Failed to fetch products: ${productsResponse.statusText}`);
  }

  const productsApi = await productsResponse.json();
  const products = productsApi.data.rows;

  const feedItems = products.map((product: any) => `
    <item>
      <title><![CDATA[${product.title}]]></title>
      <link>${siteUrl}/product/${encodeURIComponent(product.slug)}</link>
      
      <pubDate>${new Date(product.updated_at).toUTCString()}</pubDate>
      <guid isPermaLink="false">${siteUrl}/product/${encodeURIComponent(product.slug)}</guid>
    </item>
  `).join('');

  const rss = `
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>gCart Products RSS Feed</title>
    <link>${siteUrl}/category/filter?category=home-appliances</link>
    <description>Latest products from gCart</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${feedItems}
  </channel>
</rss>
  `.trim();

  res.status(200).send(rss);
}

// Generate Categories RSS Feed
async function generateCategoryFeed(res: NextApiResponse) {
  const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?limit=100`);

  if (!categoriesResponse.ok) {
    throw new Error(`Failed to fetch categories: ${categoriesResponse.statusText}`);
  }

  const categoriesApi = await categoriesResponse.json();
  const categories = categoriesApi.data.rows;

  const feedItems = categories.map((category: any) => `
    <item>
      <title><![CDATA[${category.title}]]></title>
      <link>${siteUrl}/category/filter?category=${encodeURIComponent(category.slug)}</link>
      <description><![CDATA[Find products in the ${category.title} category]]></description>
      <pubDate>${new Date(category.updated_at).toUTCString()}</pubDate>
      <guid isPermaLink="false">${siteUrl}/category/filter?category=${encodeURIComponent(category.slug)}</guid>
    </item>
  `).join('');

  const rss = `
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>gCart Categories RSS Feed</title>
    <link>${siteUrl}/categories</link>
    <description>Latest product categories from gCart</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${feedItems}
  </channel>
</rss>
  `.trim(); 

  res.status(200).send(rss);
}

// Generate Blogs RSS Feed
async function generateBlogFeed(res: NextApiResponse) {
  const blogPostsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/frontend/blogs?limit=100`);

  if (!blogPostsResponse.ok) {
    throw new Error(`Failed to fetch blog posts: ${blogPostsResponse.statusText}`);
  }

  const blogPostsApi = await blogPostsResponse.json();
  const blogPosts = blogPostsApi.data.rows;

  const feedItems = blogPosts.map((post: any) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${encodeURIComponent(post.slug)}</link>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.updated_at).toUTCString()}</pubDate>
      <guid isPermaLink="false">${siteUrl}/blog/${encodeURIComponent(post.slug)}</guid>
    </item>
  `).join('');

  const rss = `
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>gCart Blog RSS Feed</title>
    <link>${siteUrl}/blogs</link>
    <description>The latest blog posts from gCart</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${feedItems}
  </channel>
</rss>
  `.trim(); // Remove any leading or trailing whitespace

  res.status(200).send(rss);
}
