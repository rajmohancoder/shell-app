export const environment = {
  customerRemote: import.meta.env.VITE_CUSTOMER_REMOTE as string,
  ordersRemote: import.meta.env.VITE_ORDERS_REMOTE as string,
  analyticsRemote: import.meta.env.VITE_ANALYTICS_REMOTE as string,
  adminRemote: import.meta.env.VITE_ADMIN_REMOTE as string,
  apiUrl: import.meta.env.VITE_API_URL as string,
} as const;
