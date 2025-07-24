import { ApiClient } from "./api-client.js";

export class DetteRepository {
  constructor() {
    this.api = new ApiClient("http://localhost:3000");
  }

  // Liste dettes avec filtres (status, id_boutique, id_client, etc.)
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await this.api.get(`dette?${query}`);
    return response;
  }

  // Créer une nouvelle dette
  async create(dette) {
    const response = await this.api.post("dette", dette);
    return response.data;
  }

  // Mettre à jour une dette (ex: status)
  async update(id, data) {
    const response = await this.api.patch(`dette/${id}`, data);
    return response.data;
  }
}
