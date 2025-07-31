export class ApiClient {
  constructor() {
    this.baseUrl = "http://localhost:3001"; // Assurez-vous que l'URL correspond à votre API
  }

  async get(endpoint) {
    const res = await fetch(`${this.baseUrl}/${endpoint}`);
    return await res.json();
  }

  async post(endpoint, body) {
  const res = await fetch(`${this.baseUrl}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erreur POST ${endpoint}: ${res.status} - ${errorText}`);
  }

  return await res.json();
}

async put(endpoint, body) {
  const res = await fetch(`${this.baseUrl}/${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erreur PUT ${endpoint}: ${res.status} - ${errorText}`);
  }

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
