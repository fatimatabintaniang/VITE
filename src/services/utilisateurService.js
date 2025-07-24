import { ApiClient } from "../data/ApiClient.js";

export class utilisateurService {
  constructor() {
    this.api = new ApiClient("http://localhost:3000");
  }

  async getAllUtilisateurs() {
    return await this.api.get("utilisateurs");
  }

  async getUtilisateurById(id) {
    return await this.api.get(`utilisateurs/${id}`);
  }

  async createUtilisateur(data) {
    return await this.api.post("utilisateurs", data);
  }

  async updateUtilisateur(id, data) {
    return await this.api.patch(`utilisateurs/${id}`, data);
  }

  async deleteUtilisateur(id) {
    return await this.api.delete(`utilisateurs/${id}`);
  }
}
