export default class AdminScreen {
  constructor(root) {
    this.root = root;
  }

  render() {
    this.root.innerHTML = `
    <div class="min-h-screen bg-gray-50 mt-[10vh]">
      <!-- Header -->
      <div class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">Tableau de Bord Admin</h1>
      
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Card 1 -->
          <div class="card bg-base-100 shadow-md">
            <div class="card-body">
              <h2 class="card-title text-gray-500">Utilisateurs</h2>
              <p class="text-3xl font-bold">1,234</p>
              <div class="text-success flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                </svg>
                <span>12% vs mois dernier</span>
              </div>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="card bg-base-100 shadow-md">
            <div class="card-body">
              <h2 class="card-title text-gray-500">Rôles</h2>
              <p class="text-3xl font-bold">15</p>
              <div class="text-warning flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clip-rule="evenodd" />
                </svg>
                <span>3 nouveaux</span>
              </div>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="card bg-base-100 shadow-md">
            <div class="card-body">
              <h2 class="card-title text-gray-500">Permissions</h2>
              <p class="text-3xl font-bold">42</p>
              <div class="text-error flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414L11.414 12l3.293 3.293a1 1 0 01-1.414 1.414L10 13.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 12 5.293 8.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                <span>2 supprimées</span>
              </div>
            </div>
          </div>

          <!-- Card 4 -->
          <div class="card bg-base-100 shadow-md">
            <div class="card-body">
              <h2 class="card-title text-gray-500">Activité</h2>
              <p class="text-3xl font-bold">87%</p>
              <div class="radial-progress text-primary" style="--value:87; --size:2.5rem;">87%</div>
            </div>
          </div>
        </div>

        <!-- Recent Activity & Quick Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Recent Activity -->
          <div class="lg:col-span-2">
            <div class="card bg-base-100 shadow-md">
              <div class="card-body">
                <h2 class="card-title">Activité Récente</h2>
                <div class="overflow-x-auto">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Utilisateur</th>
                        <th>Action</th>
                        <th>Heure</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div class="flex items-center space-x-3">
                            <div class="avatar">
                              <div class="mask mask-squircle w-8 h-8">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                              </div>
                            </div>
                            <div>
                              <div class="font-bold">Jean Dupont</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          Création de rôle
                        </td>
                        <td>10:45 AM</td>
                      </tr>
                      <tr>
                        <td>
                          <div class="flex items-center space-x-3">
                            <div class="avatar">
                              <div class="mask mask-squircle w-8 h-8">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                              </div>
                            </div>
                            <div>
                              <div class="font-bold">Marie Martin</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          Modification permission
                        </td>
                        <td>09:30 AM</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div>
            <div class="card bg-base-100 shadow-md">
              <div class="card-body">
                <h2 class="card-title">Actions Rapides</h2>
                <div class="space-y-4">
                  <button class="btn btn-primary btn-block">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                    </svg>
                    Ajouter Utilisateur
                  </button>
                  <button class="btn btn-secondary btn-block">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947z" clip-rule="evenodd" />
                    </svg>
                    Gérer les Rôles
                  </button>
                  <button class="btn btn-accent btn-block">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                    Voir les Permissions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
  }
}