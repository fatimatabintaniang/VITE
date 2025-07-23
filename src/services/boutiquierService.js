import { ApiClient } from "../data/ApiClient";

export class boutiquierService {
  constructor() {
    this.api = new ApiClient("http://localhost:3000");
  }


  async getAllBoutiquiers() {
  const { data } = await this.api.get("utilisateurs");
  return data.filter(u => u.id_role === "2" && u.deleted !== "true");
}


 async deleteBoutiquier(id) {
  await this.api.patch(`utilisateurs/${id}`, { deleted: "true" });
}

}
