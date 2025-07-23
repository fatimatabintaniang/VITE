import Router from "./app/Router";
import "./style.css";

const app = document.getElementById("app");

const router = new Router(app);
router.init();
