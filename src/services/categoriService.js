import { ApiClient } from '../data/ApiClient.js';

export class CategoryService {
  constructor() {
    this.api = new ApiClient("http://localhost:3001");
  }

  /**
   * Récupère toutes les catégories (non supprimées par défaut)
   * @param {boolean} includeDeleted - Inclure les catégories supprimées
   * @returns {Promise<Category[]>}
   */
  async getAllCategories(includeDeleted = false) {
    try {
      const response = await this.api.get("categories", { deleted: includeDeleted });
      let categories = Array.isArray(response) ? response : response?.data || [];
      
      if (!includeDeleted) {
        categories = categories.filter(cat => !cat.deleted);
      }
      
     return {
        data: categories,
        headers: response.headers || {}
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { data: [], headers: {} };
    }
  }

  /**
   * Récupère une catégorie par son ID
   * @param {string} id - ID de la catégorie
   * @returns {Promise<Category>}
   */
  async getCategoryById(id) {
    try {
      if (!id) throw new Error('ID is required');
      
      const response = await this.api.get(`categories/${id}`);
      if (!response.data) throw new Error('Category not found');
      
      return new Category(response.data);
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw new Error(`Failed to fetch category: ${error.message}`);
    }
  }

  /**
   * Crée une nouvelle catégorie
   * @param {Object} categoryData - Données de la catégorie
   * @param {string} categoryData.libelle - Nom de la catégorie
   * @returns {Promise<Category>}
   */
  async createCategory(categoryData) {
    try {
      if (!categoryData?.libelle) {
        throw new Error('Category name (libelle) is required');
      }

      const newCategory = {
        libelle: categoryData.libelle,
        deleted: false
      };

      const response = await this.api.post('categories', newCategory);
      return new Category(response.data);
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error(`Failed to create category: ${error.message}`);
    }
  }

  /**
   * Met à jour une catégorie existante
   * @param {string} id - ID de la catégorie
   * @param {Object} updateData - Données à mettre à jour
   * @returns {Promise<Category>}
   */
  async updateCategory(id, updateData) {
    try {
      if (!id) throw new Error('ID is required');
      if (!updateData?.libelle) throw new Error('Libelle is required');

      const response = await this.api.put('categories', id, updateData);
      return new Category(response.data);
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw new Error(`Failed to update category: ${error.message}`);
    }
  }

  /**
   * Supprime (soft delete) une catégorie
   * @param {string} id - ID de la catégorie
   * @returns {Promise<boolean>}
   */
  async deleteCategory(id) {
    try {
      if (!id) throw new Error('ID is required');
      
      await this.api.patch('categories', id, { deleted: true });
      return true;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  }

  /**
   * Restaure une catégorie supprimée
   * @param {string} id - ID de la catégorie
   * @returns {Promise<boolean>}
   */
  async restoreCategory(id) {
    try {
      if (!id) throw new Error('ID is required');
      
      await this.api.patch('categories', id, { deleted: false });
      return true;
    } catch (error) {
      console.error(`Error restoring category ${id}:`, error);
      throw new Error(`Failed to restore category: ${error.message}`);
    }
  }
}