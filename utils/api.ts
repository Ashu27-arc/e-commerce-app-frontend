const BASE_URL = "http://192.168.1.14:6000/api";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

export const api = {
  login: (data: any) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),

  register: (data: any) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),

  getProducts: () => 
    fetch(`${BASE_URL}/products`)
      .then(handleResponse)
      .catch(error => {
        console.error("API Error:", error);
        throw error;
      }),

  getProduct: (id: string) =>
    fetch(`${BASE_URL}/products/${id}`).then(handleResponse),

  placeOrder: (data: any) =>
    fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),

  getOrders: (uid: string) =>
    fetch(`${BASE_URL}/orders/${uid}`).then(handleResponse),
};
