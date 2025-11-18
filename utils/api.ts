const BASE_URL = "http://192.168.1.14:6000/api";

export const api = {
  login: (data: any) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  register: (data: any) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  getProducts: () => fetch(`${BASE_URL}/products`).then(r => r.json()),

  getProduct: (id: string) =>
    fetch(`${BASE_URL}/products/${id}`).then(r => r.json()),

  placeOrder: (data: any) =>
    fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  getOrders: (uid: string) =>
    fetch(`${BASE_URL}/orders/${uid}`).then(r => r.json()),
};
