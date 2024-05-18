const tagButtons = document.querySelectorAll(".tag-select");
const containerCard = document.querySelector(".container-card");

tagButtons.forEach((button) => {
	button.addEventListener("click", (e) => {
		e.preventDefault();
		const dropdownContent = button.nextElementSibling;

		// Vérifie si le dropdownContent est actuellement visible
		const isVisible = dropdownContent.classList.contains("show");

		// Cacher tous les autres dropdown-content sauf celui associé au bouton cliqué
		document.querySelectorAll(".dropdown-content").forEach((content) => {
			if (content !== dropdownContent) {
				content.classList.remove("show");
			}
		});

		// Afficher ou cacher le dropdown-content associé au bouton cliqué
		dropdownContent.classList.toggle("show");

		// Déplace les cards vers le bas si le dropdownContent est déroulé
		if (!isVisible) {
			containerCard.style.marginTop = dropdownContent.offsetHeight + "px";
		} else {
			containerCard.style.marginTop = "0";
		}
	});
});
