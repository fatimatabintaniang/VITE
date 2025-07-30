import { utilisateurService } from "../../../services/utilisateurService.js";
import { roleService } from "../../../services/roleService.js";
import { boutiquierService } from "../../../services/boutiquierService.js";


export default class AdminScreen {
  constructor(root) {
    this.root = root;
    this.utilisateurSvc = new utilisateurService();
    this.roleSvc = new roleService();
  }

  async render() {
    this.root.innerHTML = this.getHTMLSkeleton();
    await this.renderStats();
  }

  getHTMLSkeleton() {
    return `
      <div class="min-h-screen bg-gray-50 mt-[10vh]">
        <!-- Header with gradient background -->
        <div class=" ">
          <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between">
              <h1 class="text-3xl font-bold text-black">Tableau de Bord Boutiquiers</h1>
              <div class="flex items-center space-x-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full bg-blue-500 bg-opacity-20 text-sm font-medium text-green-800">
                  <span class="w-2 h-2 mr-2 rounded-full bg-green-800 "></span>
                  En ligne
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Stats Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Users Card -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div class="p-6">
                <div class="flex items-center">
                  <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500">Catégories</p>
                    <p id="nbUsers" class="text-2xl font-semibold text-gray-900">...</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Roles Card -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div class="p-6">
                <div class="flex items-center">
                  <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500">Articles</p>
                    <p id="nbRoles" class="text-2xl font-semibold text-gray-900">...</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Permissions Card -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div class="p-6">
                <div class="flex items-center">
                  <div class="p-3 rounded-full bg-green-100 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500">Clients</p>
                    <p class="text-2xl font-semibold text-gray-900">06</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Activity Card -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div class="p-6">
                <div class="flex items-center">
                  <div class="p-3 rounded-full bg-orange-100 text-orange-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500">Activité</p>
                    <p class="text-2xl font-semibold text-gray-900">12</p>
                  </div>
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
      const users = await this.utilisateurSvc.getAllUtilisateurs();
      const roles = await this.roleSvc.getAllRoles();

      document.getElementById('nbUsers').innerText = users.length;
      document.getElementById('nbRoles').innerText = roles.length;

    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    }
  }
}