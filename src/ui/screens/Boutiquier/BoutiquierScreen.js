import { BoutiquierDashboardService } from "../../../services/BoutiquierDashboardService.js";

export default class AdminScreen {
  constructor(root) {
    this.root = root;
    this.dashboardSvc = new BoutiquierDashboardService();
  }

  async render() {
    this.root.innerHTML = this.getHTMLSkeleton();
    await this.renderStats();
    this.initChart(); // Ajout pour les graphiques
  }

  getHTMLSkeleton() {
    return `
    <div class="min-h-screen bg-gray-100">
      <!-- Header moderne avec ombre portée et dégradé subtil -->
      <header class="bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-xl">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center space-x-4">
            <div class="p-2 bg-white bg-opacity-20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 class="text-2xl md:text-3xl font-bold">Tableau de Bord <span class="text-emerald-100">Boutiquier</span></h1>
          </div>
          <div class="mt-4 md:mt-0 flex items-center space-x-4">
            <div class="relative">
              <div class="absolute top-0 right-0 -mt-1 -mr-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              <span class="inline-flex items-center px-4 py-2 rounded-full bg-white bg-opacity-20 text-sm font-medium">
                Connecté
              </span>
            </div>
            <button class="hidden md:flex items-center justify-center p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <!-- Stats Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Article Card -->
          <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
            <div class="p-6 flex items-start justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Articles</p>
                <p id="nbArticles" class="mt-1 text-3xl font-semibold text-gray-900">...</p>
                <p class="mt-1 text-xs text-gray-500">+2.6% ce mois</p>
              </div>
              <div class="p-3 rounded-lg bg-amber-50 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div class="bg-gray-50 px-6 py-3 text-xs text-gray-500 border-t border-gray-100">
              <span class="font-medium text-amber-600">5 nouveaux</span> cette semaine
            </div>
          </div>

          <!-- Catégories Card -->
          <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
            <div class="p-6 flex items-start justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Catégories</p>
                <p id="nbCategories" class="mt-1 text-3xl font-semibold text-gray-900">...</p>
                <p class="mt-1 text-xs text-gray-500">+1.2% ce mois</p>
              </div>
              <div class="p-3 rounded-lg bg-blue-50 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
            </div>
            <div class="bg-gray-50 px-6 py-3 text-xs text-gray-500 border-t border-gray-100">
              <span class="font-medium text-blue-600">2 nouvelles</span> cette semaine
            </div>
          </div>

          <!-- Clients Card -->
          <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
            <div class="p-6 flex items-start justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Clients</p>
                <p id="nbClients" class="mt-1 text-3xl font-semibold text-gray-900">...</p>
                <p class="mt-1 text-xs text-gray-500">+8.4% ce mois</p>
              </div>
              <div class="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div class="bg-gray-50 px-6 py-3 text-xs text-gray-500 border-t border-gray-100">
              <span class="font-medium text-emerald-600">12 nouveaux</span> cette semaine
            </div>
          </div>

          <!-- Dettes Card -->
          <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
            <div class="p-6 flex items-start justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Demandes de Dette</p>
                <p id="nbDettes" class="mt-1 text-3xl font-semibold text-gray-900">...</p>
                <p class="mt-1 text-xs text-gray-500">+3.1% ce mois</p>
              </div>
              <div class="p-3 rounded-lg bg-rose-50 text-rose-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="bg-gray-50 px-6 py-3 text-xs text-gray-500 border-t border-gray-100">
              <span class="font-medium text-rose-600">3 nouvelles</span> cette semaine
            </div>
          </div>
        </div>

        <!-- Graph Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Chart -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-800">Activité récente</h2>
              <select class="text-sm border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500">
                <option>7 derniers jours</option>
                <option>30 derniers jours</option>
                <option selected>12 derniers mois</option>
              </select>
            </div>
            <div class="h-80">
              <canvas id="mainChart" class="w-full h-full"></canvas>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h2>
            <div class="space-y-3">
              <button class="w-full flex items-center justify-between p-4 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition">
                <span>Ajouter un article</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
              </button>
              <button class="w-full flex items-center justify-between p-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition">
                <span>Gérer les stocks</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                </svg>
              </button>
              <button class="w-full flex items-center justify-between p-4 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition">
                <span>Voir les dettes</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
                </svg>
              </button>
              <button class="w-full flex items-center justify-between p-4 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition">
                <span>Analytiques</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        
      </main>
    </div>
    `;
  }

  initChart() {
    // Cette partie nécessiterait l'import de Chart.js dans votre projet
    const ctx = document.getElementById('mainChart')?.getContext('2d');
    if (!ctx) return;

    // Exemple de configuration de graphique (à adapter avec vos vraies données)
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
        datasets: [
          {
            label: 'Ventes',
            data: [65, 59, 80, 81, 56, 55, 40, 72, 65, 59, 80, 81],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.3,
            fill: true
          },
          {
            label: 'Dettes',
            data: [28, 48, 40, 19, 86, 27, 90, 28, 48, 40, 19, 86],
            borderColor: '#F59E0B',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
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