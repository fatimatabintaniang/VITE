import { BoutiquierArticleService } from "../../../services/BoutiquierArticle.service.js";
import { Modal } from "../../components/Modal.js"; 
import { confirm } from "../../components/Confirm.js";
import { validate } from "../../../utils/validation.js";
import { CloudinaryClient } from "../../../services/CloudinaryClient.js";
import { CategoryService } from "../../../domain/category/category.service.js";

const ICONS = {
  add: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>`,
};

export default class BoutiquierArticleScreen {
  constructor(container, idBoutiquier) {
    this.container = container;
    this.idBoutiquier = idBoutiquier;
    this.articleService = new BoutiquierArticleService();
    this.categoryService = new CategoryService(); // ✅ assure-toi que c'est bien là
    this.view = "active";
  }

  async render() {
    try {
      const allArticles = await this.articleService.listByBoutiquier(this.idBoutiquier);
      const articles = allArticles.filter((a) =>
        this.view === "active" ? !a.deleted : a.deleted
      );

      this.renderList(articles);
      this.bindViewToggle();
      this.bindAddButton();
    } catch (err) {
      this.container.innerHTML = `
        <div class="flex flex-col items-center justify-center p-10 text-center text-red-500 mt-20">
          <i class="fas fa-exclamation-circle text-5xl mb-4"></i>
          <p class="text-lg">Erreur : ${err.message}</p>
        </div>`;
    }
  }

  renderControls() {
    return `
      <div class="flex justify-between items-center p-6 mt-10">
        <h1 class="text-2xl font-bold text-gray-800">Liste des articles</h1>
        <div class="flex items-center space-x-4">
            <button id="btn-add" class="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
              ${ICONS.add}
              <span>Ajouter</span>
            </button>
            <div class="inline-flex rounded-md shadow-sm ml-4" role="group">
                <button data-v="active" type="button" class="tab px-4 py-2 text-sm font-medium rounded-l-lg border ${this.view === "active" ? "bg-indigo-600 text-white" : ""}">
                    Actifs
                </button>
                <button data-v="deleted" type="button" class="tab px-4 py-2 text-sm font-medium rounded-r-lg border ${this.view === "deleted" ? "bg-indigo-600 text-white" : ""}">
                    Corbeille
                </button>
            </div>
        </div>
      </div>
    `;
  }

  renderList(articles) {
    if (!articles.length) {
      this.container.innerHTML = `
        ${this.renderControls()} 
        <div class="flex flex-col items-center justify-center p-10 text-center text-gray-500">
          <i class="fas fa-box-open text-5xl mb-4"></i>
          <p class="text-lg">Aucun article trouvé</p>
        </div>`;
      return;
    }

    this.container.innerHTML = `
      ${this.renderControls()}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 p-6 mt-6">
        ${articles
          .map(
            (a) => `
          <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1">
            <div class="h-48 overflow-hidden">
              <img 
                src="${a.image || 'https://via.placeholder.com/300x200?text=No+Image'}" 
                alt="${a.libelle}"
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              >
            </div>
            <div class="p-5">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">${a.libelle}</h3>
              <p class="text-lg font-bold text-emerald-500 mb-3">${a.prix} FCFA</p>
              ${a.description ? `<p class="text-gray-600 text-sm mb-4">${a.description}</p>` : ''}
              <button 
                data-id="${a.id}" 
                class="btn-details w-full bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity">
                Voir détails
              </button>

            </div>
          </div>`
          )
          .join("")}
      </div>`;

this.bindDetailsButtons();

  }

  bindViewToggle() {
    const buttons = this.container.querySelectorAll(".tab");
    buttons.forEach((btn) =>
      btn.addEventListener("click", () => {
        const v = btn.getAttribute("data-v");
        if (v !== this.view) {
          this.view = v;
          this.render();
        }
      })
    );
  }

  bindAddButton() {
    const btnAdd = this.container.querySelector("#btn-add");
    if (btnAdd) {
      btnAdd.addEventListener("click", () => this.showAddForm());
    }
  }
bindDetailsButtons() {
  const buttons = this.container.querySelectorAll(".btn-details");
  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const article = await this.articleService.find(id);
      console.log(article);
      
      this.showDetails(article);
    });
  });
}


async showAddForm() {
  const cloudinary = new CloudinaryClient();
const { data: categories } = await this.categoryService.list(1, 1000, this.idBoutiquier);

  const form = document.createElement("form");
  form.id = "add-article-form";
  form.className = "space-y-4 relative";

  form.innerHTML = `
    <div>
      <input type="text" name="libelle" placeholder="Libellé" class="w-full p-2 border rounded" />
      <p class="text-sm text-red-500 mt-1" data-error="libelle"></p>
    </div>

    <div>
      <input type="number" name="prix" placeholder="Prix" class="w-full p-2 border rounded" />
      <p class="text-sm text-red-500 mt-1" data-error="prix"></p>
    </div>

    <div>
      <select name="categorie_id" class="w-full p-2 border rounded">
        <option value="">-- Choisir une catégorie --</option>
        ${categories
          .filter((c) => !c.deleted)
          .map((cat) => `<option value="${cat.id}">${cat.libelle}</option>`)
          .join("")}
      </select>
      <p class="text-sm text-red-500 mt-1" data-error="categorie_id"></p>
    </div>

    <div>
      <input type="file" name="imageFile" accept="image/*" class="w-full p-2 border rounded" />
      <p class="text-sm text-red-500 mt-1" data-error="image"></p>
    </div>

    <div>
      <textarea name="description" placeholder="Description" class="w-full p-2 border rounded"></textarea>
      <p class="text-sm text-red-500 mt-1" data-error="description"></p>
    </div>

    <div class="flex justify-end space-x-2 pt-2">
      <button type="button" id="cancel-add" class="px-4 py-2 bg-gray-300 rounded">Annuler</button>
      <button type="submit" class="submit-btn px-4 py-2 bg-indigo-600 text-white rounded flex items-center justify-center gap-2">
        <span>Ajouter</span>
        <svg class="loader hidden w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </button>
    </div>
  `;

  const modal = new Modal("Ajouter un article", form);
  modal.open();

  form.querySelector("#cancel-add").onclick = () => modal.close();

  form.onsubmit = async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector(".submit-btn");
    const loader = form.querySelector(".loader");
    submitBtn.disabled = true;
    loader.classList.remove("hidden");

    const file = form.imageFile.files[0];

    const formData = {
      libelle: form.libelle.value.trim(),
      prix: form.prix.value.trim(),
      description: form.description.value.trim(),
      categorie_id: form.categorie_id.value,
    };

    // Validation
    const errors = validate(formData, {
      libelle: ["required", "min:3"],
      prix: ["required", "number"],
      description: ["min:5"],
      categorie_id: ["required"],
    });

    form.querySelectorAll("[data-error]").forEach((el) => (el.textContent = ""));
    if (Object.keys(errors).length > 0) {
      for (const field in errors) {
        const el = form.querySelector(`[data-error="${field}"]`);
        if (el) el.textContent = errors[field];
      }
      submitBtn.disabled = false;
      loader.classList.add("hidden");
      return;
    }

    // Image upload
    let imageUrl = null;
    if (file) {
      try {
        const result = await cloudinary.uploadImage(file);
        imageUrl = result.secure_url;
      } catch (err) {
        const imageError = form.querySelector(`[data-error="image"]`);
        if (imageError) imageError.textContent = err.message;
        submitBtn.disabled = false;
        loader.classList.add("hidden");
        return;
      }
    }

    const newArticle = {
      ...formData,
      prix: parseFloat(formData.prix),
      image: imageUrl,
      id_boutiquier: this.idBoutiquier,
      deleted: false,
    };

    try {
      await this.articleService.create(newArticle);
      modal.close();
      this.render(); 
    } catch (error) {
      alert("Erreur lors de l'ajout : " + error.message);
    } finally {
      submitBtn.disabled = false;
      loader.classList.add("hidden");
    }
  };
}


showDetails(article) {
  const detailContainer = document.createElement("div");

  const isDeleted = article.deleted === true;

  detailContainer.innerHTML = `
    <div class="space-y-4">
      <img src="${article.image || 'https://via.placeholder.com/400x300'}" alt="${article.libelle}" class="w-full h-60 object-cover rounded-md" />
      <h2 class="text-xl font-bold">${article.libelle}</h2>
      <p><strong>Prix :</strong> ${article.prix} FCFA</p>
      <p><strong>Description :</strong><br>${article.description || "Aucune"}</p>

      <div class="flex justify-end gap-4 mt-4">
        ${isDeleted
          ? `<button class="btn-restore px-4 py-2 bg-green-600 text-white rounded">Restaurer</button>`
          : `
            <button class="btn-edit px-4 py-2 bg-indigo-600 text-white rounded">Modifier</button>
            <button class="btn-delete px-4 py-2 bg-red-600 text-white rounded">Supprimer</button>
          `
        }
      </div>
    </div>
  `;

  const modal = new Modal("Détails de l'article", detailContainer);
  modal.open();

  if (isDeleted) {
    // Restaurer
    detailContainer.querySelector(".btn-restore").onclick = async () => {
      if (await confirm("Voulez-vous restaurer cet article ?")) {
        await this.articleService.restore(article.id);
        modal.close();
        this.render();
      }
    };
  } else {
    // Modifier
    detailContainer.querySelector(".btn-edit").onclick = () => {
      modal.close();
      this.showEditForm(article);
    };

    // Supprimer (soft delete)
    detailContainer.querySelector(".btn-delete").onclick = async () => {
      if (await confirm("Êtes-vous sûr de vouloir archiver cet article ?")) {
        await this.articleService.softDelete(article.id);
        modal.close();
        this.render();
      }
    };
  }
}


createElementFromHTML(htmlString) {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

showEditForm(article) {
  const cloudinary = new CloudinaryClient();

  const form = document.createElement("form");
  form.className = "space-y-4 relative";

  form.innerHTML = `
  <div>
    <input type="text" name="libelle" value="${article.libelle}" placeholder="Libellé" class="w-full p-2 border rounded" />
    <p class="text-sm text-red-500 mt-1" data-error="libelle"></p>
  </div>

  <div>
    <input type="number" name="prix" value="${article.prix}" placeholder="Prix" class="w-full p-2 border rounded" />
    <p class="text-sm text-red-500 mt-1" data-error="prix"></p>
  </div>

  <div>
    <p class="text-gray-600 text-sm mb-2">Image actuelle :</p>
    <img src="${article.image}" alt="Aperçu de l'image" class="w-32 h-32 object-cover mb-2 rounded border" />
    <input type="file" name="imageFile" accept="image/*" class="w-full p-2 border rounded" />
    <p class="text-sm text-red-500 mt-1" data-error="image"></p>
  </div>

  <div>
    <textarea name="description" placeholder="Description" class="w-full p-2 border rounded">${article.description || ""}</textarea>
    <p class="text-sm text-red-500 mt-1" data-error="description"></p>
  </div>

  <div class="flex justify-end space-x-2 pt-2">
    <button type="button" id="cancel-edit" class="px-4 py-2 bg-gray-300 rounded">Annuler</button>
    <button type="submit" class="submit-btn px-4 py-2 bg-indigo-600 text-white rounded flex items-center justify-center gap-2">
      <span>Modifier</span>
      <svg class="loader hidden w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
    </button>
  </div>
`;


  const modal = new Modal("Modifier l'article", form);
  modal.open();

  form.querySelector("#cancel-edit").onclick = () => modal.close();

  form.onsubmit = async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector(".submit-btn");
    const loader = form.querySelector(".loader");
    submitBtn.disabled = true;
    loader.classList.remove("hidden");

    const imageInput = form.imageFile;
    const file = imageInput.files[0];

    const formData = {
      libelle: form.libelle.value.trim(),
      prix: form.prix.value.trim(),
      description: form.description.value.trim(),
    };

    form.querySelectorAll("[data-error]").forEach((el) => (el.textContent = ""));

    const errors = validate(formData, {
      libelle: ["required", "min:3"],
      prix: ["required", "number"],
      description: ["min:5"],
    });

    if (Object.keys(errors).length > 0) {
      for (const field in errors) {
        const el = form.querySelector(`[data-error="${field}"]`);
        if (el) el.textContent = errors[field];
      }
      submitBtn.disabled = false;
      loader.classList.add("hidden");
      return;
    }

    // Vérifier unicité (sauf si c’est le même libellé non modifié)
    if (formData.libelle.toLowerCase() !== article.libelle.toLowerCase()) {
      const existing = await this.articleService.findByLibelleAndBoutiquier(
        formData.libelle,
        this.idBoutiquier
      );
      if (existing) {
        form.querySelector('[data-error="libelle"]').textContent = "Ce libellé existe déjà.";
        submitBtn.disabled = false;
        loader.classList.add("hidden");
        return;
      }
    }

    let imageUrl = article.image;

    if (file) {
      try {
        const result = await cloudinary.uploadImage(file);
        imageUrl = result.secure_url;
      } catch (err) {
        const imageError = form.querySelector(`[data-error="image"]`);
        if (imageError) imageError.textContent = err.message;
        submitBtn.disabled = false;
        loader.classList.add("hidden");
        return;
      }
    }

    const updatedArticle = {
      ...article,
      ...formData,
      prix: parseFloat(formData.prix),
      image: imageUrl,
    };

    try {
      await this.articleService.update(article.id, updatedArticle);
      modal.close();
      this.render();
    } catch (error) {
      alert("Erreur lors de la mise à jour : " + error.message);
    } finally {
      submitBtn.disabled = false;
      loader.classList.add("hidden");
    }
  };
}
}
