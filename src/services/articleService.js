import { ApiClient } from "../data/ApiClient.js";
import { Article } from "../data/Article.js";
export class ArticleService {
  constructor() {
    this.api = new ApiClient("http://localhost:3000/articles");
  }
async list(page = 1, limit = 10) {
  try {
    const response = await this.api.get("", {
      _page: page,
      _limit: limit,
    });
    return {
      data: Array.isArray(response) ? response.map(Article.fromDto) : [],
      headers: response.headers || {},
    };
  } catch (error) {
    console.error("ArticleService.list error:", error);
    return { data: [], headers: {} }; // Retour cohérent même en cas d'erreur
  }
}

async listByCategory(categoryId, excludeId = null, limit = 4) {
  if (!categoryId) throw new Error("categoryId manquant");

  try {
    const response = await this.api.get("", {
      categoryId,
      deleted: false,
      _limit: limit,
      ...(excludeId && { id_ne: excludeId })
    });
    
    return {
      data: Array.isArray(response) ? response.map(Article.fromDto) : [],
      headers: response.headers || {}
    };
  } catch (error) {
    console.error("ArticleService.listByCategory error:", error);
    return { data: [], headers: {} };
  }
}
}
