import { ApiClient } from "../data/api-client.js";

export class BoutiquierArticleService {
  constructor() {
    this.api = new ApiClient("http://localhost:3000");
  }

  async listByBoutiquier(idBoutiquier) {
    const { data } = await this.api.get("articles", { id_boutiquier: idBoutiquier });
    return data;
  }

  async create(article) {
    // Vérification basique : le back se chargera aussi de la validation si nécessaire
    if (!article || !article.libelle || !article.prix || isNaN(article.prix)) {
      throw new Error("Article invalide");
    }

    const { data } = await this.api.post("articles", article); // ← "articles" endpoint
    return data;
  }
async findByLibelleAndBoutiquier(libelle, idBoutiquier) {
  const allArticles = await this.list(); // ou this.repo.list() si tu l’utilises
  return allArticles.find(
    (a) =>
      a.libelle.toLowerCase().trim() === libelle.toLowerCase().trim() &&
      a.id_boutiquier === idBoutiquier &&
      !a.deleted
  );
}
async softDelete(id) {
  return await this.api.patch(`articles`, id, { deleted: true });
}

async find(id) {
  const { data } = await this.api.get(`articles/${id}`);
  return data;
}


}
