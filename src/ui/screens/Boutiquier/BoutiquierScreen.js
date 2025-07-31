import { BoutiquierDashboardService } from "../../../services/BoutiquierDashboardService.js";




export default class AdminScreen {
  constructor(root) {
    this.root = root;
    // this.utilisateurSvc = new utilisateurService();
    this.dashboardSvc = new BoutiquierDashboardService();


    
  }

  async render() {
    this.root.innerHTML = this.getHTMLSkeleton();
    await this.renderStats();
  }

  getHTMLSkeleton() {
  return `
    <div class="min-h-screen bg-gray-50 mt-[10vh]">
      <!-- Header -->
      <div class="bg-gradient-to-r from-green-500 to-lime-500 text-black py-6 shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 class="text-3xl font-bold">Tableau de Bord Boutiquier</h1>
          <span class="inline-flex items-center px-3 py-1 rounded-full bg-white bg-opacity-20 text-sm font-medium text-white">
            <span class="w-2 h-2 mr-2 rounded-full bg-white animate-pulse"></span>
            Connecté
          </span>
        </div>
      </div>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
          <!-- Articles -->
          <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-6">
            <div class="flex items-center space-x-4">
              <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6M3 17h18M9 21h6" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">Articles</p>
                <p id="nbArticles" class="text-2xl font-bold text-gray-800">...</p>
              </div>
            </div>
          </div>

          <!-- Catégories -->
          <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-6">
            <div class="flex items-center space-x-4">
              <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">Catégories</p>
                <p id="nbCategories" class="text-2xl font-bold text-gray-800">...</p>
              </div>
            </div>
          </div>

          <!-- Clients -->
          <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-6">
            <div class="flex items-center space-x-4">
              <div class="p-3 rounded-full bg-emerald-100 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 14v6M8 14v6M12 4a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">Clients</p>
                <p id="nbClients" class="text-2xl font-bold text-gray-800">...</p>
              </div>
            </div>
          </div>

          <!-- Dettes -->
          <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-6">
            <div class="flex items-center space-x-4">
              <div class="p-3 rounded-full bg-rose-100 text-rose-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a4 4 0 00-8 0v2m-2 6h12a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">Demandes de Dette</p>
                <p id="nbDettes" class="text-2xl font-bold text-gray-800">...</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  `;
}


async renderStats() {
  try {
    const boutiquierId = JSON.parse(localStorage.getItem("user"))?.id;
    const stats = await this.dashboardSvc.getDashboardStats(boutiquierId);

    document.getElementById('nbArticles').innerText = stats.articles;
    document.getElementById('nbCategories').innerText = stats.categories;
    document.getElementById('nbClients').innerText = stats.clients;
    document.getElementById('nbDettes').innerText = stats.dettes;
  } catch (error) {
    console.error("Erreur lors du chargement des statistiques:", error);
  }
}


}