/* eslint-disable import/extensions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
import Model from './Model.js';

// Variables globales
let tagArray = [];
let globalIngredients = [];
let globalUstensils = [];
let globalAppliances = [];

// Affiche le nombre de recette afficher à l'écran
function displayNumberRecipes(length) {
  const container = document.querySelector('.filter-amount');
  container.innerHTML = `<p class="recipe-amount">${length} recettes</p>`;
}

// Affiche les listes d'éléments en dessous des champs de recherche
function displayList(list, listName) {
  const container = document.querySelector(`.result-${CSS.escape(listName)}`);
  container.innerHTML = '';
  for (let i = 0; i < list.length; i++) {
    container.innerHTML += `
        <p class="list-element">${list[i]}</p>
        `;
  }
}

// Récupère les ustensils, les ingrédients et les appareils des recettes affichées
function refreshList(list) {
  for (let i = 0; i < list.length; i++) {
    const newListAppliances = list.map((recipe) => recipe.appliance);
    globalAppliances = [...new Set(newListAppliances)];

    const newListUstensils = list.reduce((acc, recipe) => {
      acc.push(...recipe.ustensils);
      return acc;
    }, []);
    globalUstensils = [...new Set(newListUstensils)];

    const newListIngriedents = list.reduce((accumulator, recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        accumulator.push(ingredient.ingredient);
      });
      return [...new Set(accumulator)];
    }, []);
    globalIngredients = [...new Set(newListIngriedents)];
  }

  const lists = [
    { data: globalIngredients, name: 'ingredients' },
    { data: globalAppliances, name: 'appareils' },
    { data: globalUstensils, name: 'ustensils' },
  ];

  lists.forEach(({ data, name }) => {
    displayList(data, name);
  });
}

// Affiche une liste de recette
function displayRecipes(list) {
  const container = document.querySelector('.recipe-section');
  container.innerHTML = '';
  for (let i = 0; i < list.length; i++) {
    const recipeId = list[i].id;
    const recipeName = list[i].name;
    const recipeIngredientsList = list[i].ingredients;
    const recipeImage = list[i].image;
    const recipeDescription = list[i].description;
    const recipeTime = list[i].time;

    const cardHTML = `
                <article class="card">
                  <img src="../assets/Photos P7 JS Les petits plats/${recipeImage}" alt="${recipeName} portrait">
                  <h2>${recipeName}</h2>
                  <div class="card-recette">
                    <h1 class="card-section_title">RECETTE</h1>
                    <p>${recipeDescription}</p>
                  </div>
                  <div class="card-ingredients">
                    <h1 class="card-section_title">INGRÉDIENTS</h1>
                    <div class="ingredients-container ingredients-container-${recipeId}"></div>
                  </div>
                  <p class='timer'>${recipeTime}min</p>
                </article>
                `;
    container.innerHTML += cardHTML;

    for (let j = 0; j < recipeIngredientsList.length; j++) {
      const ingredientsContainer = document.querySelector(`.ingredients-container-${recipeId}`);
      const ingredientName = recipeIngredientsList[j].ingredient;
      const ingredientQuantity = recipeIngredientsList[j].quantity !== undefined ? recipeIngredientsList[j].quantity : '-';
      const ingredientUnit = recipeIngredientsList[j].unit !== undefined ? recipeIngredientsList[j].unit : ' ';

      ingredientsContainer.innerHTML += `
                <div class="ingredients-div">
                  <h1>${ingredientName}</h1>
                  <p>${ingredientQuantity} ${ingredientUnit}</p>
                </div>
                `;
    }
  }
  displayNumberRecipes(list.length);
  refreshList(list);
}

// Affiche un message d'erreur si aucune recette ne correspond
function displayError() {
  const searchInput = document.querySelector('#searchbar-banner').value.trim().toLowerCase();
  const container = document.querySelector('.recipe-section');
  container.innerHTML = `<p class='error-msg'>Aucune recette ne contient ‘${searchInput}’ vous pouvez chercher «
      tarte aux pommes », « poisson », etc.</p>`;
}

// Ajoute le tag dans le dom
function displayTag(value, container) {
  // eslint-disable-next-line no-param-reassign
  container.innerHTML += `
            <div class="tag">
              <p>${value}</p>
              <i class="fa-solid fa-xmark delete-x"></i>
            </div>
        `;
}

// Supprime le tag du dom et de la varaiable global
function deleteTag(icon) {
  const tag = icon.parentElement;
  const value = tag.querySelector('p').textContent;
  tagArray = tagArray.filter((tagValue) => tagValue !== value);
  tag.remove();
}

// Vérifie si la recette contient le mot recherché ainsi que les tags
function matchesFilter(recipe, searchInput) {
  const lowerCaseSearchInput = searchInput.toLowerCase();
  const lowerCaseRecipeName = recipe.name.toLowerCase();
  const lowerCaseRecipeDescription = recipe.description.toLowerCase();

  const nameMatch = lowerCaseRecipeName.includes(lowerCaseSearchInput);
  const descriptionMatch = lowerCaseRecipeDescription.includes(lowerCaseSearchInput);
  const ingredientMatch = recipe.ingredients.some(
    (ingredient) => ingredient.ingredient.toLowerCase().includes(lowerCaseSearchInput),
  );

  if (nameMatch || descriptionMatch || ingredientMatch) {
    const tagMatches = tagArray.every((tag) => {
      const applianceMatch = recipe.appliance && recipe.appliance
        .toLowerCase().includes(tag.toLowerCase());
      const ustensilMatch = recipe.ustensils.some((ustensil) => ustensil
        .toLowerCase().includes(tag.toLowerCase()));
      const ingredientTagMatch = recipe.ingredients.some((ingredient) => ingredient.ingredient
        .toLowerCase().includes(tag.toLowerCase()));
      return applianceMatch || ustensilMatch || ingredientTagMatch;
    });

    return tagMatches;
  }

  return false;
}

// affiche les recettes après filtrage
function displayRecipesByFilter(listRecipes) {
  const searchInput = document.querySelector('#searchbar-banner').value.trim().toLowerCase();
  const filteredRecipes = [];

  for (const recipe of listRecipes) {
    if (matchesFilter(recipe, searchInput)) {
      filteredRecipes.push(recipe);
    }
  }

  if (filteredRecipes.length === 0) {
    displayError(tagArray);
    displayNumberRecipes(filteredRecipes.length);
  } else {
    displayRecipes(filteredRecipes);
  }
}

// Ajoute un eventlistener à chaque création de tag
function addTagEventListeners(listRecipes, listName) {
  const deleteIcons = document.querySelectorAll('.tag-section .delete-x');
  deleteIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
      deleteTag(icon);
      displayRecipesByFilter(listRecipes, listName);
    });
  });
}

// Détecte les entrées et actualise l'affichage selon la taille de l'entrée
function searchbarManager(listRecipes) {
  const searchInput = document.querySelector('#searchbar-banner');

  searchInput.addEventListener('input', (e) => {
    const searchInputResult = e.target.value.trim().toLowerCase();
    if (searchInputResult.length >= 3) {
      displayRecipesByFilter(listRecipes);
    } else {
      displayRecipes(listRecipes);
    }
  });
}

// Lance les différentes fonctions nécessaires au fonctionnement des tags
function tagManager(listRecipes, listName) {
  const container = document.querySelector('.tag-section');
  const element = document.querySelector(`.result-${CSS.escape(listName)}`);
  element.addEventListener('click', (e) => {
    const value = e.target.innerText;

    if (tagArray.includes(value) === false) {
      displayTag(value, container);
      tagArray.push(value);
      displayRecipesByFilter(listRecipes, listName);
      addTagEventListeners(listRecipes, listName);
      document.querySelector('#searchbar-banner').innerText = '';
    }
  });
}

// Renvoie les éléments contenant la valeur du champ de recherche
function filterListBySearchInput(searchInput, list) {
  const resultArray = [];
  for (let i = 0; i < list.length; i++) {
    if ((list[i].toLowerCase()).includes(searchInput.toLowerCase())) {
      resultArray.push(list[i]);
    }
  }
  return resultArray;
}

// Détecte l'éntrée dans le champ de recherche et lance les fonctions associées
function handleListSearch(list, listName) {
  document.querySelector(`#searchbar-${CSS.escape(listName)}`).addEventListener('input', (e) => {
    const { value } = e.target;
    const array = filterListBySearchInput(value, list);
    filterListBySearchInput(value, list);
    displayList(array, listName);
  });
}

// Initialisation de la page
async function initializeRecipePage() {
  const model = new Model();
  const [listRecipes,
    listUstensils,
    listAppliances,
    listIngredients,
    listAll] = await Promise.all([
    model.getData(),
    model.getUstensils(),
    model.getAppliances(),
    model.getIngredients(),
    model.getAll()]);

  const lists = [
    { data: listIngredients, name: 'ingredients' },
    { data: listAppliances, name: 'appareils' },
    { data: listUstensils, name: 'ustensils' },
    { data: listAll, name: 'banner' }];

  displayRecipes(listRecipes);
  searchbarManager(listRecipes);
  lists.forEach(({ data, name }) => {
    displayList(data, name);
    handleListSearch(data, name);
    tagManager(listRecipes, name);
  });
}

initializeRecipePage();
