import { ApiClient } from "../data/api-client.js";

export class BoutiquierArticleService {
  constructor() {
    this.api = new ApiClient("http://localhost:3000");
  }

  async listByBoutiquier(idBoutiquier) {
    
    const { data } = await this.api.get("articles", { boutiquier_id
        : idBoutiquier });
    console.log(data);
    
    return data;
  }
}
