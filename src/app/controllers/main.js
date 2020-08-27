const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

module.exports = {
    index(req, res) {
        Recipe.all(function (recipes) {
            return res.render('main/index', { recipes });
        });
    },
    about(req, res) {
        return res.render('main/about');
    },
    recipes(req, res) {
        let { search, page, limit } = req.query;

        page = page || 1;
        limit = limit || 6;
        let offset = limit * (page - 1);

        const params = {
            search,
            page,
            limit,
            offset,
            callback(recipes) {
                let pagination = '';

                if (recipes.length == 0) {
                    pagination = {
                        total: 1,
                        page
                    };
                } else {
                    pagination = {
                        total: Math.ceil(recipes[0].total / limit),
                        page
                    };
                }

                if (search) return res.render('main/result', { recipes, search, pagination });

                return res.render('main/recipes', { recipes, pagination });
            }
        };

        Recipe.recipes(params);
    },
    showRecipe(req, res) {
        Recipe.find(req.params.id, function (recipe) {
            if (!recipe) return res.send('Receita não encontrada!');

            return res.render('main/recipe', { recipe });
        });
    },
    chefs(req, res) {
        Chef.all(function (chefs) {
            return res.render('main/chefs', { chefs });
        });
    },
    showChef(req, res) {
        Chef.find(req.params.id, function (chef) {
            Chef.chefRecipes(req.params.id, function (recipes) {
                if (!chef) res.send('Chef não encontrado!');

                return res.render('main/chef', { chef, recipes });
            });
        });
    }
};