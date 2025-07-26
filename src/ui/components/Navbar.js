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
          <a href="#boutiquier-articles" class="mr-4 ">Articles</a>
          <a href="#boutiquier-clients" class="mr-4 ">Clients</a>
          <a href="#dettes" class="mr-4 ">Dettes</a>
        `;
        break;

      case "3": // Client
        links = `
          <a href="#client" class="mr-4 ">Dashboard Client</a>
          <a href="#articles" class="mr-4 ">Articles</a>
        `;
        break;

      default:
        links = "";
    }

  this.root.innerHTML = `
  <nav class="bg-white text-white w-full shadow p-6 h-[10vh]  flex justify-between items-center fixed top-0 z-10">
  <img src="./assets/images/Logo NGB ok blanc.png" alt="Logo" class=" w-25 -mt-[1vh] mr-4 object-cover">
    <div class="flex space-x-4  text-center text-black">
      ${links}
    </div>
   <div class="flex items-center space-x-4">
    <button id="logoutBtn" class="bg-red-600 px-3 py-1 rounded">Déconnexion</button>
<button id="profile-dropdown-btn" class="flex items-center gap-2 focus:outline-none">
  ${
    user.image
      ? `<img src="${user.image}" alt="image" class="w-8 h-8 rounded-full object-cover">`
      : `<div class="bg-gray-200 w-8 h-8 rounded-full"></div>`
  }
  <div class="text-sm font-medium">
  <span class="text-black">${user.prenom} </br> ${user.nom}</span>
  </div>
  <svg class="w-4 h-4 transition-transform ${
    this.dropdownOpen ? "transform rotate-180" : ""
  }" 
       fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
  </svg>
</button>

   </div>
  
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
