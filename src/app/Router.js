
import Navbar from "../ui/components/Navbar.js";
import { AuthService } from "../services/authService.js";
import { ArticleService } from "../services/articleService.js";
import { DetteService } from "../services/detteService.js";
import { CategoryService } from "../services/categoriService.js";
import LoginScreen from "../ui/screens/Security/LoginScreen.js";
import AdminScreen from "../ui/screens/Admin/AdminScreen.js";
import BoutiquierScreen from "../ui/screens/Boutiquier/BoutiquierScreen.js";
import ClientScreen from "../ui/screens/Client/ClientScreen.js";
import ClientArticlesScreen from "../ui/screens/Client/ClientArticlesScreen.js";
import AdminBoutiquierScreen from "../ui/screens/Admin/AdminBoutiquierScreen.js";
import AdminBoutiquierDetailScreen from "../ui/screens/Admin/AdminBoutiquierDetailScreen.js";

export default class Router {
  constructor(appRoot) {
    this.appRoot = appRoot;
    this.authSvc = new AuthService();
    this.articleSvc = new ArticleService();
    this.detteSvc = new DetteService();
    this.categorySvc = new CategoryService();

  }

  init() {
    window.addEventListener("hashchange", () => this.route());
    window.addEventListener("load", () => this.route());
  }

route() {
  const hash = window.location.hash || "#login";
  const user = this.authSvc.getCurrentUser();

  // Si non connecté et pas sur login, rediriger vers login
  if (!user && hash !== "#login") {
    window.location.hash = "#login";
    return;
  }

  // Si connecté et sur login, rediriger selon le rôle
  if (user && hash === "#login") {
    switch (user.id_role) {
      case "1":
        window.location.hash = "#admin";
        break;
      case "2":
        window.location.hash = "#boutiquier";
        break;
      case "3":
        window.location.hash = "#client";
        break;
      default:
        window.location.hash = "#login";
    }
    return;
  }

  this.appRoot.innerHTML = `
    <div id="navbar" class=""></div>
    <div id="content"></div>
  `;

  // Render Navbar
  const navbarRoot = document.getElementById("navbar");
  new Navbar(navbarRoot).render();

  // Render content
  const content = document.getElementById("content");

  // Gestion de la route dynamique avant le switch
  if (hash.startsWith("#admin-boutiquier-detail-")) {
    const id = hash.split("-").pop();  // extrait l'id
    new AdminBoutiquierDetailScreen(content, id).render();
    return;
  }

  switch (hash) {
    case "#login":
      new LoginScreen(content).render();
      break;
    case "#admin":
      new AdminScreen(content).render();
      break;
    case "#boutiquier":
      new BoutiquierScreen(content).render();
      break;
    case "#client":
      new ClientScreen(content).render();
      break;
    case "#articles":
      new ClientArticlesScreen(content).render();
      break;
    case "#admin-boutiquier":
      new AdminBoutiquierScreen(content).render();
      break;
    default:
      content.innerHTML = "<h1>404 - Page non trouvée</h1>";
  }
}


}
