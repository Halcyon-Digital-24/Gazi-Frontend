// const fetchDynamicRoutes = async () => {
//   // Fetch routes dynamically, e.g., from an API
//   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/frontend/products`);
//   const productsApi = await response.json();
//   const products = productsApi.data.rows;
//   return products.map(product => `${process.env.NEXT_PUBLIC_API_URL}/frontend/products${product.slug}`);
// };

// module.exports = async () => {
//   const dynamicRoutes = await fetchDynamicRoutes();

//   return {
//     siteUrl: 'https://gcart.com.bd/',
//     generateRobotsTxt: true,
//     exclude: ['/admin/*', '/login'],
//     additionalPaths: async (config) => [
//       ...dynamicRoutes.map(route => ({
//         loc: route, // Generate dynamic routes in the sitemap
//         changefreq: 'weekly',
//         priority: 0.7,
//       })),
//     ],
//   };
// };
