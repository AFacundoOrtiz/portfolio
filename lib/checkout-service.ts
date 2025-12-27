// src/lib/checkout-service.ts

import {
  Product,
  Address,
  OrderCreatedResponse, // <--- Importamos la nueva
  CheckoutResponse, // <--- Usamos esta en lugar de PaymentSessionResponse
} from "@/types/ecoshop";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010";

// Helper para hacer peticiones autenticadas
async function authFetch<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();

  if (!res.ok) {
    const errorMessage =
      json.message || json.data?.message || `Error ${res.status}`;
    throw new Error(errorMessage);
  }

  // Manejo del interceptor NestJS
  return json.data !== undefined ? json.data : json;
}

export async function processCheckout(
  token: string,
  cartItems: (Product & { quantity: number })[],
  couponCode?: string
) {
  try {
    const addresses = await authFetch<Address[]>("/addresses", token);
    let addressId = "";

    if (addresses.length > 0) {
      addressId = addresses[0].id;
    } else {
      await authFetch("/addresses", token, {
        method: "POST",
        body: JSON.stringify({
          street: "Calle Demo Portfolio 123",
          city: "Portfolio City",
          postalCode: "1000",
          country: "Argentina",
          addressType: "shipping",
        }),
      });
      const updatedAddresses = await authFetch<Address[]>("/addresses", token);
      addressId = updatedAddresses[0].id;
    }

    const orderItems = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const orderData = await authFetch<OrderCreatedResponse>("/orders", token, {
      method: "POST",
      body: JSON.stringify({
        addressId,
        items: orderItems,
        couponCode: couponCode || undefined,
      }),
    });

    const orderId = orderData.orderId;

    if (!orderId) throw new Error("No se pudo obtener el ID de la orden");

    const currentUrl =
      typeof window !== "undefined" ? window.location.origin : "";

    const session = await authFetch<CheckoutResponse>(
      "/payments/create-checkout-session",
      token,
      {
        method: "POST",
        body: JSON.stringify({
          orderId,
          returnUrl: currentUrl,
        }),
      }
    );

    if (session.url) {
      return session.url;
    } else {
      throw new Error("No se recibió la URL de pago");
    }
  } catch (error) {
    console.error("Checkout Error:", error);
    throw error;
  }
}
