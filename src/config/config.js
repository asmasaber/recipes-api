module.exports = {
  port: process.env.PORT || 8087,
  host: 'https://foodrecipesapp.herokuapp.com',
  db: {
    database: process.env.DB_NAME || 'recipes',
    user: process.env.DB_USER || 'recipes',
    password: process.env.DB_PASS || 'recipes',
    options: {
      dialect: process.env.DIALECT || 'sqlite',
      host: process.env.HOST || 'localhost',
      storage: './recipes.sqlite',
      operatorsAliases: false
    }
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  }
}
