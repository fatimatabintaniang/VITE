// ui/screens/Boutiquier/BoutiquierClientScreen.js
import { ClientService } from "../../../services/clientService.js";
import { Modal } from "../../components/Modal.js";
import { validate } from "../../../utils/validation.js";
import { confirm } from "../../components/Confirm.js";



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
  console.log(clients);
  

  this.root.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 mt-12 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Gestion des Clients</h1>
        
        <button id="add-client-btn" class="flex items-center px-6 py-3 bg-blue-700 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Ajouter un client
        </button>
      </div>

      <div class="bg-white shadow-xl rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solde</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crédit Max</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${clients.map((c, index) => `
                <tr data-id="${c.id}" class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        ${c.utilisateur.prenom.charAt(0)}${c.utilisateur.nom.charAt(0)}
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${c.utilisateur.prenom} ${c.utilisateur.nom}</div>
                        <div class="text-sm text-gray-500">${c.utilisateur.telephone || 'Non renseigné'}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${c.utilisateur.email}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${c.solde < 0 ? 'text-red-600' : 'text-green-600'}">${c.solde.toFixed(2)} €</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${c.creditMax.toFixed(2)} €</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button class="edit-client-btn px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Modifier
                      </button>
                      <button class="delete-client-btn px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
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
        ${createField("password", "Mot de passe", "password")}
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
        password: ["required"], // ajout ici
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
        if (await confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
       console.log(id);
       
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
        // console.log("Client à modifier:", client);
        
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
