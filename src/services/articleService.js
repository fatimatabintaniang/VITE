import { ApiClient } from "../data/ApiClient.js";
import { Article } from "../data/Article.js";

export class ArticleService {
  constructor() {
    this.api = new ApiClient("http://localhost:3001");
  }

  async list(page = 1, limit = 1000, searchQuery = '') {
    try {
      const params = {
        _page: page,
        _limit: limit,
      };

      // Si recherche spécifiée, ajouter le paramètre q
      if (searchQuery) {
        params.q = searchQuery;
        // Pour JSON Server, la recherche se fait sur tous les champs
        // Vous pouvez adapter selon votre backend
      }

      const response = await this.api.get("articles", params);
      
      return {
        data: Array.isArray(response) ? response.map(Article.fromDto) : [],
        total: parseInt(response.headers?.get('X-Total-Count')) || 0,
        page,
        limit
      };
    } catch (error) {
      console.error("ArticleService.list error:", error);
      return { data: [], total: 0, page: 1, limit: 10 };
    }
  }

  async search(query, page = 1, limit = 20) {
    return this.list(page, limit, query);
  }

  async listByCategory(categoryId, excludeId = null, limit = 4) {
    if (!categoryId) throw new Error("categoryId manquant");

    try {
      const params = {
        categoryId,
        deleted: false,
        _limit: limit,
        ...(excludeId && { id_ne: excludeId })
      };

      const response = await this.api.get("articles", params);
      
      return {
        data: Array.isArray(response) ? response.map(Article.fromDto) : [],
        headers: response.headers || {}
      };
    } catch (error) {
      console.error("ArticleService.listByCategory error:", error);
      return { data: [], headers: {} };
    }
  }

  async getArticleById(id) {
    try {
      const response = await this.api.get(`articles/${id}`);
      return Article.fromDto(response);
    } catch (error) {
      console.error("ArticleService.getArticleById error:", error);
      return null;
    }
  }
  
}