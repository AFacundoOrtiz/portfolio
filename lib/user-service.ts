import { ImpactStats, WalletBalance, WalletTransaction } from "@/types/ecoshop";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010";

async function authFetch<T>(endpoint: string, token: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error fetching data");
  return json.data !== undefined ? json.data : json;
}

export async function getUserProfileData(token: string) {
  const [impact, wallet, history] = await Promise.all([
    authFetch<ImpactStats>("/users/dashboard/impact", token),
    authFetch<WalletBalance>("/wallet/balance", token),
    authFetch<WalletTransaction[]>("/wallet/history", token),
  ]);

  return { impact, wallet, history };
}
