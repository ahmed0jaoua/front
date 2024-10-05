export const GlobalComponent = {
    // Api Calling
     API_URL: 'http://127.0.0.1:8000/api/',
     // API_URL: 'https://glx-tunisie.com/api/',
     headerToken: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
     img_Url : 'http://127.0.0.1:8000/uploads/',
    // Auth Api
    AUTH_API: "https://api-node.themesbrand.website/auth/",

    // Products Api
    product: 'apps/product',
    productDelete: 'apps/product/',

    // Orders Api
    order: 'apps/order',
    orderId: 'apps/order/',

    // Customers Api
    customer: 'apps/customer',

}