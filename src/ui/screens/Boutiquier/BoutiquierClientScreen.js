// ui/screens/Boutiquier/BoutiquierClientScreen.js
import { ClientService } from "../../../services/clientService.js";
import { Modal } from "../../components/Modal.js";
import { validate } from "../../../utils/validation.js";


function clearFormErrors(form) {
  form.querySelectorAll("[data-error]").forEach(el => {
    el.textContent = "";
    el.classList.add("hidden");
  });
}

function showFormErrors(form, errors) {
  for (const [field, message] of Object.entries(errors)) {
    const errorElement = form.querySelector(`[data-error="${field}"]`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove("hidden");
    }
  }
}


export default class BoutiquierClientScreen {
  constructor(root, idBoutiquier) {
    this.root = root;
    this.idBoutiquier = idBoutiquier;
    this.clientService = new ClientService();
  }



async render() {
  const clients = await this.clientService.listByBoutiquier(this.idBoutiquier);

  this.root.innerHTML = `
    <div class="p-4">
      <h1 class="text-xl font-bold mb-4">Mes clients</h1>

      <button id="add-client-btn" class="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Ajouter un client
      </button>

      <table class="table-auto w-full border">
        <thead>
          <tr class="bg-gray-200">
            <th class="p-2 border">Nom</th>
            <th class="p-2 border">Email</th>
            <th class="p-2 border">Solde</th>
            <th class="p-2 border">Crédit Max</th>
            <th class="p-2 border">Modifier</th>
            <th class="p-2 border">Supprimer</th>
          </tr>
        </thead>
        <tbody>
          ${clients.map((c) => `
            <tr data-id="${c.id}">
              <td class="p-2 border">${c.utilisateur.prenom} ${c.utilisateur.nom}</td>
              <td class="p-2 border">${c.utilisateur.email}</td>
              <td class="p-2 border">${c.solde}</td>
              <td class="p-2 border">${c.creditMax}</td>
              <td class="p-2 border">
                <button class="edit-client-btn px-2 py-1 bg-yellow-500 text-white rounded">Modifier</button>
              </td>
              <td class="p-2 border">
                <button class="delete-client-btn px-2 py-1 bg-red-600 text-white rounded">Supprimer</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  // Fonction utilitaire pour créer un champ avec message d'erreur
  function createField(name, placeholder, type = "text", value = "") {
    return `
      <div>
        <input name="${name}" type="${type}" placeholder="${placeholder}" class="border p-2 w-full" value="${value}" />
        <p class="text-red-600 text-sm mt-1 hidden" data-error="${name}"></p>
      </div>
    `;
  }

  // Affiche les erreurs sous les inputs
  function showFormErrors(form, errors) {
    for (const [field, message] of Object.entries(errors)) {
      const errorElement = form.querySelector(`[data-error="${field}"]`);
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove("hidden");
      }
    }
  }

  // Efface tous les messages d'erreur
  function clearFormErrors(form) {
    form.querySelectorAll("[data-error]").forEach(el => {
      el.textContent = "";
      el.classList.add("hidden");
    });
  }

  // Gestion du clic sur le bouton "Ajouter un client"
  document.getElementById("add-client-btn").onclick = () => {
    const form = document.createElement("form");
    form.className = "space-y-4";

    form.innerHTML = `
      ${createField("prenom", "Prénom")}
      ${createField("nom", "Nom")}
      ${createField("email", "Email", "email")}
      ${createField("telephone", "Téléphone")}
      ${createField("solde", "Solde", "number")}
      ${createField("creditMax", "Crédit Max", "number")}
      <div class="text-right">
        <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Enregistrer</button>
      </div>
    `;

    const modal = new Modal("Ajouter un client", form);
    modal.open();

    form.onsubmit = async (e) => {
      e.preventDefault();
      clearFormErrors(form);

      const formData = Object.fromEntries(new FormData(form).entries());

      const rules = {
        prenom: ["required"],
        nom: ["required"],
        email: ["required", "email"],
        telephone: ["required", "phone"],
        solde: ["required", "number"],
        creditMax: ["required", "number"],
      };

      const errors = validate(formData, rules);
      if (Object.keys(errors).length > 0) {
        showFormErrors(form, errors);
        return;
      }

      const clientData = {
        ...formData,
        solde: parseFloat(formData.solde),
        creditMax: parseFloat(formData.creditMax),
        id_boutiquier: this.idBoutiquier,
      };

      try {
        await this.clientService.create(clientData);
        modal.close();
        this.render();
      } catch (error) {
        alert(error.message);
      }
    };
  };

  // Gestion suppression des clients
  this.root.querySelectorAll(".delete-client-btn").forEach(btn => {
    btn.onclick = async (e) => {
      const id = e.target.closest("tr").dataset.id;
      if (confirm("Confirmer la suppression du client ?")) {
        try {
          await this.clientService.delete(id);
          this.render();
        } catch (error) {
          alert("Erreur suppression : " + error.message);
        }
      }
    };
  });

  // Gestion modification des clients
  this.root.querySelectorAll(".edit-client-btn").forEach(btn => {
    btn.onclick = async (e) => {
      const id = e.target.closest("tr").dataset.id;
      

      let client;
      try {
        client = await this.clientService.getClientById(id);
        console.log("Client à modifier:", client);
        
      } catch (error) {
        alert("Erreur chargement client : " + error.message);
        return;
      }

      const form = document.createElement("form");
      form.className = "space-y-4";

      form.innerHTML = `
        ${createField("prenom", "Prénom", "text", client.utilisateur.prenom)}
        ${createField("nom", "Nom", "text", client.utilisateur.nom)}
        ${createField("email", "Email", "email", client.utilisateur.email)}
        ${createField("telephone", "Téléphone", "text", client.utilisateur.telephone)}
        ${createField("solde", "Solde", "number", client.solde)}
        ${createField("creditMax", "Crédit Max", "number", client.creditMax)}
        <div class="text-right">
          <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Modifier</button>
        </div>
      `;

      const modal = new Modal("Modifier un client", form);
      modal.open();

      form.onsubmit = async (evt) => {
        evt.preventDefault();
        clearFormErrors(form);

        const formData = Object.fromEntries(new FormData(form).entries());

        const rules = {
          prenom: ["required"],
          nom: ["required"],
          email: ["required", "email"],
          telephone: ["required", "phone"],
          solde: ["required", "number"],
          creditMax: ["required", "number"],
        };

        const errors = validate(formData, rules);
        if (Object.keys(errors).length > 0) {
          showFormErrors(form, errors);
          return;
        }

        const clientData = {
          ...formData,
          solde: parseFloat(formData.solde),
          creditMax: parseFloat(formData.creditMax),
        };

        try {
          await this.clientService.update(id, clientData);
          modal.close();
          this.render();
        } catch (error) {
          alert("Erreur mise à jour : " + error.message);
        }
      };
    };
  });
}





}
