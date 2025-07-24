import { ApiClient } from "../data/ApiClient.js";

export class roleService {
  constructor() {
    this.api = new ApiClient("http://localhost:3000");
  }

  async getAllRoles() {
    return await this.api.get("roles");
  }

  async getRoleById(id) {
    return await this.api.get(`roles/${id}`);
  }

  async createRole(data) {
    return await this.api.post("roles", data);
  }

  async updateRole(id, data) {
    return await this.api.patch(`roles/${id}`, data);
  }

  async deleteRole(id) {
    return await this.api.delete(`roles/${id}`);
  }
}
