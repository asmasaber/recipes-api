const AuthController = require('./controllers/AuthController')
const AuthControllerPolicy = require('./policies/AuthenticationControllerPolicy')
// const stringify = require('json-stringify-safe')
const RecipeController = require('./controllers/RecipeController')
const isAuthenticated = require('./policies/isAuthenticated')

const s3 = require('./config/aws-s3.js')

module.exports = (app) => {
  app.post('/register', s3.upload.single('avatar'), AuthControllerPolicy.register, AuthController.register)
  app.put('/profile', isAuthenticated, s3.upload.single('avatar'), AuthController.updateProfile)
  app.put('/password/reset', isAuthenticated, AuthController.changePassword)
  app.put('/password/send', AuthController.sendPassword)
  app.post('/login', AuthController.login)
  app.get('/recipes', RecipeController.getRecipes)
  app.get('/recipe/:id', RecipeController.getRecipe)
  app.post('/recipe', isAuthenticated, s3.upload.single('avatar'), RecipeController.create)
  app.delete('/recipe/:id', isAuthenticated, RecipeController.delete)
  app.put('/recipe/:id', s3.upload.single('avatar'), isAuthenticated, RecipeController.update)
  app.get('/user/recipes', isAuthenticated, RecipeController.getUserRecipes)
}
