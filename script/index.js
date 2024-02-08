import Model from './model.js';

// display section

function displayRecipes(list) {
    const container = document.querySelector(".recipe-section");
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
}

function displayList(list, listName) {
    let container = document.querySelector(".result-" + CSS.escape(listName))
    container.innerHTML = ''
    for (let i = 0; i < list.length; i++) {
        container.innerHTML += `
        <p class="list-element">${list[i]}</p>
        `
    }
}

function tagArray() {
    let tagArray = []
}

function displayTag(listName) {
    let tagArray = []
    let container = document.querySelector(".tag-section")
    document.querySelector('.result-' + CSS.escape(listName)).addEventListener("click", (e) => {
        let value = e.target.innerText;

        if (tagArray.includes(value) === false) {
            tagArray.push(value);
            container.innerHTML += `
    <div class="tag">
    <p>${value}</p>
    <i class="fa-solid fa-xmark delete-x"></i>
    </div>
    `
        }
        console.log(tagArray)
    }
    )
    deleteTag(tagArray)
    console.log(tagArray)
}



function deleteTag(tagArray) {
    const container = document.querySelector(".tag-section");

    container.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-x")) {
            const tag = e.target.parentElement;
            const value = tag.querySelector("p").textContent;
            tagArray = tagArray.filter(tagValue => tagValue !== value);
            tag.remove();
            return tagArray;
        }
    });
}

// search section

function searchElement(searchInput, list) {
    let ResultArray = []
    for (let i = 0; i < list.length; i++) {
        if ((list[i].toLowerCase()).includes(searchInput.toLowerCase())) {
            ResultArray.push(list[i])
        }

    }
    return ResultArray
}

function searchListener(list, listName) {
    document.querySelector('#searchbar-' + CSS.escape(listName)).addEventListener("input", (e) => {
        let value = e.target.value
        let array = searchElement(value, list)
        searchElement(value, list)
        displayList(array, listName)
    }
    )
}



// page init

async function initializeRecipePage() {
    const model = new Model();

    const [listRecipes, listUstensils, listAppliances, listIngredients] = await Promise.all([
        model.getData(),
        model.getUstensils(),
        model.getAppliances(),
        model.getIngredients()
    ]);

    const lists = [
        { data: listIngredients, name: 'ingredients' },
        { data: listAppliances, name: 'appareils' },
        { data: listUstensils, name: 'ustensils' }
    ];

    displayRecipes(listRecipes);
    lists.forEach(({ data, name }) => {
        displayList(data, name);
        searchListener(data, name);
        displayTag(name);
    });
}

initializeRecipePage();
