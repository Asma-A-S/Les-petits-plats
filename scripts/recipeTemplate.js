// recipeTemplate.js
export function createRecipeCardDom(recipe) {
	const article = document.createElement("article");
	article.classList.add("recipe-card");

	article.innerHTML = `
      <span class="recipe-card-time">
        <p class="time">${recipe.time} min</p>
      </span>
      <img class="recipe-card-img" src="assets/images/${
				recipe.image
			}" alt="Photo du plat">
      <div class="recipe-card-info">
        <h2 class="recipe-card-name">${recipe.name}</h2>
        <div class="recipe-info-block">
          <h3>RECETTE</h3>
          <p class="recipe-card-description">${recipe.description}</p>
        </div>
        <div class="recipe-info-block">
          <h3>INGRÉDIENTS</h3>
          <ul class="recipe-card-ingredients">
					${recipe.ingredients
						.map(
							(ingredient) =>
								`<li><p class="recipe-ingredient">${
									ingredient.ingredient
								}</p><span class="recipe-quantity">${
									ingredient.quantity
										? ingredient.unit
											? `${ingredient.quantity} ${ingredient.unit}`
											: `${ingredient.quantity}`
										: "-"
								}</span></li>`
						)
						.join("")}
          </ul>
        </div>
      </div>
    `;

	return article;
}

export function displayRecipes(recipes) {
	const container = document.querySelector(".container-card");
	container.innerHTML = "";

	recipes.forEach((recipe) => {
		const card = createRecipeCardDom(recipe);
		container.appendChild(card);
	});
}
