export class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async get(endpoint) {
    const res = await fetch(`${this.baseUrl}/${endpoint}`);
    return await res.json();
  }

  async delete(endpoint) {
    const res = await fetch(`${this.baseUrl}/${endpoint}`, {
      method: "DELETE"
    });
    return await res.json();
  }

  async patch(endpoint, body) {
  const res = await fetch(`${this.baseUrl}/${endpoint}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return await res.json();
}

}
