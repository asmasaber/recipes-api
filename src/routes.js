const AuthController = require('./controllers/AuthController')
const AuthControllerPolicy = require('./policies/AuthenticationControllerPolicy')
// const stringify = require('json-stringify-safe')

const RecipeController = require('./controllers/RecipeController')

const isAuthenticated = require('./policies/isAuthenticated')

var multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split('/')
    let extension = extArray[extArray.length - 1]
    cb(null, Date.now() + '.' + extension)
  }
})

var upload = multer({ storage: storage })

module.exports = (app) => {
  app.post('/register', upload.single('avatar'), AuthControllerPolicy.register, AuthController.register)
  app.put('/profile', isAuthenticated, upload.single('avatar'), AuthController.updateProfile)
  app.put('/password', isAuthenticated, AuthController.changePassword)
  app.post('/login', AuthController.login)
  app.get('/recipes', RecipeController.getRecipes)
  app.get('/recipe/:id', RecipeController.getRecipe)
  app.post('/recipe', isAuthenticated, upload.single('avatar'), RecipeController.create)
  app.delete('/recipe/:id', isAuthenticated, RecipeController.delete)
  app.put('/recipe/:id', upload.single('avatar'), isAuthenticated, RecipeController.update)
  app.get('/user/recipes', isAuthenticated, RecipeController.getUserRecipes)
}
