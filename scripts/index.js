// index.js
import { fetchRecipes } from "./api.js";
import { displayRecipes } from "./recipeTemplate.js";

let allRecipes;
let filteredRecipes;
let selectedTags = [];

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

	updateFilterList("#listIngredients", Array.from(ingredients));
	updateFilterList("#listAppliances", Array.from(appliances));
	updateFilterList("#listUstensils", Array.from(ustensils));
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
			handleAdvancedSearch(
				event.target.textContent.trim(),
				"ingredients",
				event
			);
		});

	document
		.getElementById("listAppliances")
		.addEventListener("click", (event) => {
			handleAdvancedSearch(event.target.textContent.trim(), "appliance", event);
		});

	document
		.getElementById("listUstensils")
		.addEventListener("click", (event) => {
			handleAdvancedSearch(event.target.textContent.trim(), "ustensils", event);
		});
}

function handleAdvancedSearch(selectedItem, filterType) {
	selectedTags.push({ item: selectedItem, type: filterType });
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
	tagItem.innerHTML = `
    <span>${selectedItem}</span>
    <button class="remove-tag" data-item="${selectedItem}" data-type="${filterType}">
      <img src="assets/vectorClose.png">
    </button>`;
	tagContainer.appendChild(tagItem);

	// Écouter l'événement de clic pour supprimer le tag
	tagItem.querySelector(".remove-tag").addEventListener("click", (event) => {
		const button = event.currentTarget;
		removeTag(button.dataset.item, button.dataset.type);
		tagItem.remove();
	});
}
function removeTag(item, type) {
	// Retirer le tag de selectedTags
	selectedTags = selectedTags.filter(
		(tag) => tag.item !== item || tag.type !== type
	);
	// Réinitialiser les recettes filtrées
	filteredRecipes = [...allRecipes];

	// Réappliquer tous les tags restants
	selectedTags.forEach((tag) => {
		filteredRecipes = filteredRecipes.filter((recipe) => {
			if (tag.type === "ingredients") {
				return recipe.ingredients.some(
					(ingredient) =>
						ingredient.ingredient.toLowerCase() === tag.item.toLowerCase()
				);
			} else if (tag.type === "appliance") {
				return recipe.appliance.toLowerCase() === tag.item.toLowerCase();
			} else if (tag.type === "ustensils") {
				return recipe.ustensils.some(
					(ustensil) => ustensil.toLowerCase() === tag.item.toLowerCase()
				);
			}
		});
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
