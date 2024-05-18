// index.js
import { fetchRecipes } from "./api.js";
import { displayRecipes } from "./recipeTemplate.js";

let allRecipes;
let filteredRecipes;
let ingredientsList = [];
let appliancesList = [];
let ustensilsList = [];
async function initializeApp() {
	try {
		allRecipes = await fetchRecipes();
		filteredRecipes = [...allRecipes];
		displayRecipes(filteredRecipes);
		updateFilters();
		updateRecipeCount(filteredRecipes.length);
		searchInput();
		setupAdvancedSearch();
		setupSearchFilters();
		console.log(filteredRecipes);
	} catch (error) {
		console.error("Error initializing the app: ", error);
	}
}

function searchInput() {
	const searchInput = document.querySelector(".search-input");
	searchInput.addEventListener("keyup", () => {
		const searchTerm = searchInput.value.trim().toLowerCase();
		if (searchTerm.length >= 3) {
			handleSearchInput(searchTerm);
		} else {
			filteredRecipes = [...allRecipes];
			displayRecipes(filteredRecipes);
			updateFilters();
			updateRecipeCount(filteredRecipes.length);
		}
	});
}
function handleSearchInput(searchTerm) {
	filteredRecipes = allRecipes.filter((recipe) => {
		return (
			recipe.name.toLowerCase().includes(searchTerm) ||
			recipe.description.toLowerCase().includes(searchTerm) ||
			recipe.ingredients.some((ingredient) =>
				ingredient.ingredient.toLowerCase().includes(searchTerm)
			)
		);
	});
	//afficher les recettes filtrées
	updateFilters();
	displayRecipes(filteredRecipes);
	updateRecipeCount(filteredRecipes.length);
}

function updateFilters() {
	const ingredients = new Set();
	const appliances = new Set();
	const ustensils = new Set();

	filteredRecipes.forEach((recipe) => {
		recipe.ingredients.forEach((ing) =>
			ingredients.add(ing.ingredient.toLowerCase())
		);
		appliances.add(recipe.appliance.toLowerCase());
		recipe.ustensils.forEach((ust) => ustensils.add(ust.toLowerCase()));
	});

	ingredientsList = Array.from(ingredients);
	appliancesList = Array.from(appliances);
	ustensilsList = Array.from(ustensils);

	updateFilterList("#listIngredients", ingredientsList);
	updateFilterList("#listAppliances", appliancesList);
	updateFilterList("#listUstensils", ustensilsList);
}
function updateFilterList(selector, items) {
	const listElement = document.querySelector(selector);
	if (!listElement) return; //Vérifie si l'élément existe déja avant d'avancer
	listElement.innerHTML = ""; // Clear previous items
	items.forEach((item) => {
		const li = document.createElement("li");
		li.textContent = item;
		listElement.appendChild(li);
	});
}
function setupAdvancedSearch() {
	// Écouteurs d'événements pour les éléments de filtrage
	document
		.getElementById("listIngredients")
		.addEventListener("click", (event) => {
			handleAdvancedSearch(event.target.textContent.trim(), "ingredients");
		});

	document
		.getElementById("listAppliances")
		.addEventListener("click", (event) => {
			handleAdvancedSearch(event.target.textContent.trim(), "appliance");
		});

	document
		.getElementById("listUstensils")
		.addEventListener("click", (event) => {
			handleAdvancedSearch(event.target.textContent.trim(), "ustensils");
		});
}

function handleAdvancedSearch(selectedItem, filterType) {
	//ajouter le tag
	addTag(selectedItem, filterType);
	// Filtrer les recettes déjà filtrées en fonction de l'élément sélectionné
	filteredRecipes = filteredRecipes.filter((recipe) => {
		if (filterType === "ingredients") {
			return recipe.ingredients.some(
				(ingredient) =>
					ingredient.ingredient.toLowerCase() === selectedItem.toLowerCase()
			);
		} else if (filterType === "appliance") {
			return recipe.appliance.toLowerCase() === selectedItem.toLowerCase();
		} else if (filterType === "ustensils") {
			return recipe.ustensils.some(
				(ustensil) => ustensil.toLowerCase() === selectedItem.toLowerCase()
			);
		}
	});

	// Afficher les recettes filtrées
	updateFilters();
	displayRecipes(filteredRecipes);
	updateRecipeCount(filteredRecipes.length);
}
function updateRecipeCount(count) {
	const recipeCountElement = document.getElementById("recipeCount");
	recipeCountElement.textContent = `${count} recettes`;
}

function addTag(selectedItem, filterType) {
	const tagContainer = document.getElementById("selectedTags");
	const tagItem = document.createElement("div");
	tagItem.className = "tag-item";
	tagItem.innerHTML = `<span>${selectedItem}</span><button class="remove-tag" data-item="${selectedItem}" data-type="${filterType}">x</button>`;
	tagContainer.appendChild(tagItem);

	// Écouter l'événement de clic pour supprimer le tag
	tagItem.querySelector(".remove-tag").addEventListener("click", (event) => {
		removeTag(event.target.dataset.item, event.target.dataset.type);
		tagItem.remove();
	});
}
function removeTag(item, type) {
	filteredRecipes = allRecipes; // Réinitialiser les recettes filtrées

	// Retirer le filtre de l'élément supprimé
	const activeTags = document.querySelectorAll(".tag-item");
	activeTags.forEach((tag) => {
		const tagItem = tag.querySelector("span").textContent;
		const tagType = tag.querySelector(".remove-tag").dataset.type;

		if (tagItem !== item || tagType !== type) {
			filteredRecipes = filteredRecipes.filter((recipe) => {
				if (tagType === "ingredients") {
					return recipe.ingredients.some(
						(ingredient) =>
							ingredient.ingredient.toLowerCase() === tagItem.toLowerCase()
					);
				} else if (tagType === "appliance") {
					return recipe.appliance.toLowerCase() === tagItem.toLowerCase();
				} else if (tagType === "ustensils") {
					return recipe.ustensils.some(
						(ustensil) => ustensil.toLowerCase() === tagItem.toLowerCase()
					);
				}
			});
		}
	});

	// Afficher les recettes filtrées et mettre à jour les filtres
	updateFilters();
	displayRecipes(filteredRecipes);
	updateRecipeCount(filteredRecipes.length);
}
function setupSearchFilters() {
	setupSearchFilter("inputIngredient", "#listIngredients");
	setupSearchFilter("inputAppliance", "#listAppliances");
	setupSearchFilter("inputUstensil", "#listUstensils");
}
function setupSearchFilter(inputId, listId) {
	const searchInput = document.getElementById(inputId);
	searchInput.addEventListener("input", () => {
		const searchTerm = searchInput.value.trim().toLowerCase();
		const listItems = document.querySelectorAll(listId + " li");
		listItems.forEach((item) => {
			const text = item.textContent.toLowerCase();
			if (text.includes(searchTerm)) {
				item.style.display = "block";
			} else {
				item.style.display = "none";
			}
		});
	});
}
initializeApp();
