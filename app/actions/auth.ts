"use server";

export async function getDemoAdminToken() {
  const url = `https://${process.env.AUTH0_DOMAIN}/oauth/token`;

  const body = {
    grant_type: "http://auth0.com/oauth/grant-type/password-realm",
    username: process.env.DEMO_ADMIN_EMAIL,
    password: process.env.DEMO_ADMIN_PASSWORD,
    audience: process.env.AUTH0_AUDIENCE,
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    scope: "openid profile email",
    realm: "Username-Password-Authentication",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Auth0 Error Detallado:", JSON.stringify(data, null, 2));
      throw new Error("Error al obtener token de demostración");
    }

    return { success: true, token: data.access_token };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Falló la autenticación del demo" };
  }
}
