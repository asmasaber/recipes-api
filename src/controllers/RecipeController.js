const { Recipe } = require('../models')

module.exports = {
  async create (req, res) {
    try {
      req.body.avatar = req.file.path
      req.body.userId = req.user.id
      const recipe = await Recipe.create(req.body)
      const recipeJson = recipe.toJSON()
      res.send({
        recipe: recipeJson
      })
    } catch (err) {
      console.log(err)
      res.status(400).send({
        error: 'error on create this recipe'
      })
    }
  },
  async getRecipe (req, res) {
    try {
      const recipe = await Recipe.findOne({
        where: {
          id: req.params.id
        }
      })
      if (recipe) {
        res.send({
          recipe: recipe
        })
      } else {
        res.status(400).send({
          error: 'No Recipe Found'
        })
      }
    } catch (err) {
      console.log(err)
      res.status(400).send({
        error: 'error on get recipes'
      })
    }
  },
  async getRecipes (req, res) {
    try {
      const recipes = await Recipe.findAll()
      if (recipes && recipes.length > 0) {
        res.send({
          recipes: recipes
        })
      } else {
        res.status(400).send({
          error: 'No Recipes Found'
        })
      }
    } catch (err) {
      console.log(err)
      res.status(400).send({
        error: 'error on get recipes'
      })
    }
  },
  async getUserRecipes (req, res) {
    try {
      const recipes = await Recipe.findAll({
        where: {
          userId: req.user.id
        }
      })
      if (recipes && recipes.length > 0) {
        res.send({
          recipes: recipes
        })
      } else {
        res.status(400).send({
          error: 'No Recipes Found'
        })
      }
    } catch (err) {
      res.status(400).send({
        error: 'error on get recipes'
      })
    }
  },
  async update (req, res) {
    try {
      if (req.file) {
        req.body.avatar = req.file.path
      }
      console.log('before update')
      console.log('before update >>>> id = ' + req.params.id)
      req.body.userId = req.user.id
      const recipe = await Recipe.update({
        title: req.body.title,
        description: req.body.description,
        persons: req.body.persons,
        timeNeeded: req.body.timeNeeded,
        category: req.body.category,
        ingredients: req.body.ingredients,
        avatar: req.body.avatar
      },
      {
        where: {
          id: req.params.id
        }
      })
      const recipeJson = recipe.toJSON()
      res.send({
        recipe: recipeJson
      })
    } catch (err) {
      res.status(400).send({
        error: 'error on update this recipe'
      })
    }
  },
  async delete (req, res) {
    try {
      const id = req.params.id
      await Recipe.destroy({
        where: { id: id }
      }).then(deletedRecipe => {
        res.send({
          deletedRecipes: deletedRecipe
        })
      })
    } catch (err) {
      res.status(400).send({
        error: 'error on delete this recipe'
      })
    }
  }
}
