import { recipes } from '../data/recipes.js'

class Model {
    static data = null;
    async getData() {
        if (this.data == null) {
            this.data = recipes;
        }

        return this.data;
    }

    async getAppliances() {
        const data = await this.getData();
        const appliances = data.map(recipe => recipe.appliance);
        return [...new Set(appliances)];
    }

    async getUstensils() {
        const data = await this.getData();
        const ustensils = data.reduce((acc, recipe) => {
            acc.push(...recipe.ustensils);
            return acc;
        }, []);
        return [...new Set(ustensils)];
    }

    async getIngredients() {
        const data = await this.getData();
        const ingredients = data.reduce((accumulator, recipe) => {
            recipe.ingredients.forEach(ingredient => {
                accumulator.push(ingredient.ingredient);
            });
            return [...new Set(accumulator)];
        }, []);
        return [...new Set(ingredients)];
    }

    async getDescriptions() {
        const data = await this.getData();
        const descriptions = data.map(recipe => recipe.description);
        return [...new Set(descriptions)];
    }

    async getAll() {
        const asyncFunctions = [
            this.getAppliances(),
            this.getIngredients(),
            this.getUstensils(),
            this.getDescriptions()
        ];
        const all = (await Promise.all(asyncFunctions)).reduce((accumulator, all) => {
            all.forEach(all => {
                accumulator.push(all);
            });
            return [...new Set(accumulator)];
        }, []);

        return all;
    }
}

export default Model;