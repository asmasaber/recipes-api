// const config = require('../config/config.js')
const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

function hashPassword (user, options) {
  const SALT_FACTOR = 8
  if (!user.changed('password')) {
    return
  }

  return bcrypt
    .genSaltAsync(SALT_FACTOR)
    .then(salt => bcrypt.hashAsync(user.password, salt, null))
    .then(hash => {
      user.setDataValue('password', hash)
    })
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    bio: DataTypes.STRING,
    avatar: DataTypes.STRING
    // avatar: {
    //   type: DataTypes.STRING,
    //   get: function () {
    //     if (this.getDataValue('avatar')) {
    //       return config.host.concat(':', config.port).concat('/', this.getDataValue('avatar').replace('\',\'/'))
    //     }
    //   },
    //   set: function (val) {
    //     return this.setDataValue('avatar', val.replace(config.host.concat(':', config.port).concat('/'), ''))
    //   }
    // }
  },
  {
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword
    },
    individualHooks: true
  })

  User.prototype.comparePassword = function (password) {
    return bcrypt.compareAsync(password, this.password)
  }

  return User
}
