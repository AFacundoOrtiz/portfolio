import { Reward, Coupon } from "@/types/ecoshop"; // Definiremos estos tipos abajo

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010";

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
  if (!res.ok)
    throw new Error(
      json.message || json.data?.message || "Error en la petición"
    );
  return json.data !== undefined ? json.data : json;
}

export async function getRewards(token: string) {
  return authFetch<Reward[]>("/wallet/rewards", token);
}

export async function getMyCoupons(token: string) {
  // onlyActive=true para mostrar solo los válidos en el checkout
  return authFetch<Coupon[]>("/wallet/coupons?onlyActive=true", token);
}

export async function redeemReward(
  token: string,
  rewardId: string,
  cost: number
) {
  return authFetch("/wallet/redeem", token, {
    method: "POST",
    body: JSON.stringify({ rewardId, amount: cost }),
  });
}
