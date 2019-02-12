const config = require('../config/config.js')

module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define('Recipe', {
    title: DataTypes.STRING,
    persons: DataTypes.INTEGER,
    timeNeeded: DataTypes.INTEGER,
    description: DataTypes.STRING,
    avatar: {
      type: DataTypes.STRING,
      get: function () {
        return config.host.concat(':', config.port).concat('/', this.getDataValue('avatar').replace('\',\'/'))
      },
      set: function (val) {
        const nv = val.replace(config.host.concat(':', config.port).concat('/'), '')
        console.log('new value >>>>>>>>>>> ' + nv)
        return this.setDataValue('avatar', nv)
      }
    },
    category: DataTypes.STRING,
    ingredients: {
      type: DataTypes.STRING,
      get: function () {
        return JSON.parse(this.getDataValue('ingredients'))
      },
      set: function (val) {
        return this.setDataValue('ingredients', val)
      }
    },
    userId: DataTypes.INTEGER
  })
  return Recipe
}
