// api.js
export async function fetchRecipes() {
	try {
		const response = await fetch("/data/recipes.json");
		if (!response.ok) {
			throw new Error("Failed to fetch recipes");
		}
		const data = await response.json();
		return data.recipes.map((recipe) => ({
			id: recipe.id,
			name: recipe.name,
			image: recipe.image,
			time: recipe.time,
			description: recipe.description,
			ingredients: recipe.ingredients,
			appliance: recipe.appliance,
			ustensils: recipe.ustensils,
		}));
	} catch (error) {
		console.error("Error fetching recipes:", error);
		return [];
	}
}
