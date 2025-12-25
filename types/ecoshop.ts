export type EcoBadgeLevel = "NEUTRAL" | "HIGH" | "MEDIUM" | "LOW";

export interface EnvironmentalImpact {
  carbonFootprint: number;
  waterUsage: number;
  ecoBadgeLevel: EcoBadgeLevel;
  recycledContent?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image: string;
  description?: string;
  environmentalImpact: EnvironmentalImpact;
  brand?: {
    name: string;
  };
}
export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalCo2Saved: number;
  totalUsers: number;
}

export interface CreateOrderDto {
  addressId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  couponCode?: string;
}

export interface CheckoutResponse {
  url: string;
}

export interface Address {
  id: string;
  street: string;
  country: string;
}

export interface OrderCreatedResponse {
  orderId: string;
  totalPrice: number;
  totalCarbonFootprint: number;
  message: string;
}
