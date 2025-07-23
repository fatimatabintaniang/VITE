import { AuthService } from "../../services/authService.js";

export default class Navbar {
  constructor(root) {
    this.root = root;
    this.authSvc = new AuthService();
  }

  render() {
    const user = this.authSvc.getCurrentUser();
   

     if (!user) {
      
      this.root.innerHTML = ''
      return
      
    }

    let links = "";

    switch (user.id_role) {

      case "1": // Admin
        links = `

          <a href="#admin" class="mr-4 ">Dashboard Admin</a>
          <a href="#admin-boutiquier" class="mr-4 ">Boutiquiers</a>
        `;
        break;

      case "2": // Boutiquier
        links = `
          <a href="#boutiquier" class="mr-4 ">Dashboard Boutiquier</a>
          <a href="#categories" class="mr-4 ">Catégories</a>
          <a href="#articles" class="mr-4 ">Articles</a>
          <a href="#clients" class="mr-4 ">Clients</a>
          <a href="#dettes" class="mr-4 ">Dettes</a>
        `;
        break;

      case "3": // Client
        links = `
          <a href="#client" class="mr-4 ">Dashboard Client</a>
          <a href="#articles" class="mr-4 ">Articles</a>
          <a href="#panier" class="mr-4 ">Panier</a>
        `;
        break;

      default:
        links = "";
    }

  this.root.innerHTML = `
  <nav class="bg-gray-800 text-white w-full shadow p-4 flex justify-between ">
  <img src="./assets/images/logo.png" alt="Logo" class="h-8 w-8 mr-4">
    <div class="flex space-x-4  text-center">
      ${links}
    </div>
    <button id="logoutBtn" class="bg-red-600 px-3 py-1 rounded">Déconnexion</button>
  </nav>
`;


    this.setUpEventListeners();
  }

  setUpEventListeners() {
    const logoutBtn = this.root.querySelector("#logoutBtn");
    logoutBtn.addEventListener("click", () => {
      this.authSvc.logout();
      window.location.hash = "#login";
    });
  }
}
