import { ApiClient } from '../data/api-client';

export class BoutiquierDashboardService {
  constructor() {
    this.api = new ApiClient("http://localhost:3000");
  }

  async getDashboardStats(boutiquierId) {
    if (!boutiquierId) throw new Error("boutiquierId manquant");

    try {
      // Fetch les données en parallèle
      const [articlesRes, categoriesRes, clientsRes, dettesRes] = await Promise.all([
        this.api.get("articles", { id_boutiquier: boutiquierId }),
        this.api.get("categories", ),
        this.api.get("clients", { id_boutiquier: boutiquierId }),
        this.api.get("dettes", { boutiquierId })
      ]);

      const articles = articlesRes.data.filter(a => !a.deleted);
        const categories = categoriesRes.data.filter(c => c.boutiquier_id === boutiquierId && !c.deleted);
      const clients = clientsRes.data;
      const dettes = dettesRes.data;

      return {
        articles: articles.length,
        categories: categories.length,
        clients: clients.length,
        dettes: dettes.length
      };
    } catch (error) {
      console.error("Erreur dans getDashboardStats:", error);
      return {
        articles: 0,
        categories: 0,
        clients: 0,
        dettes: 0
      };
    }
  }
}
