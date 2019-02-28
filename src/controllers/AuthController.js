const { User } = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const ses = require('../config/aws-ses.js')
const s3 = require('../config/aws-s3.js')
// const stringify = require('json-stringify-safe')

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
  })
}
module.exports = {
  async register (req, res) {
    try {
      if (req.file) {
        req.body.avatar = req.file.location
      }
      const user = await User.create(req.body)
      const userJson = user.toJSON()
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (err) {
      res.status(400).send({
        error: 'this email acount is already in use.'
      })
    }
  },
  async login (req, res) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({
        where: {
          email: email
        }
      })
      if (!user) {
        res.status(403).send({
          error: 'The login information was incorrect'
        })
      }
      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        res.status(403).send({
          error: 'The login information was incorrect'
        })
      }
      const userJson = user.toJSON()
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error occured trying to login'
      })
    }
  },
  async updateProfile (req, res) {
    try {
      const { id } = req.body
      if (req.file) {
        req.body.avatar = req.file.location
        const user = await User.findOne({
          where: {
            id: id
          }
        })
        s3.delete(user.avatar)
      }
      const result = await User.update(
        req.body,
        { where: { id: id } }
      )
      if (result) {
        const user = await User.findOne({
          where: {
            id: id
          }
        })
        const userJson = user.toJSON()
        res.send({
          user: userJson,
          token: jwtSignUser(userJson)
        })
      }
    } catch (err) {
      res.status(400).send({
        error: 'Error in update profile info.'
      })
    }
  },
  async changePassword (req, res) {
    try {
      const { id, oldPassword, newPassword } = req.body
      return User.findOne({
        where: { id: id }
      }).then(function (result) {
        const isPasswordValid = result.comparePassword(oldPassword)
        if (!isPasswordValid) {
          res.status(403).send({
            error: 'Incorrect password'
          })
        } else {
          return result.update({ password: newPassword }).then(function (result) {
            const userJson = result.toJSON()
            res.send({
              user: userJson,
              token: jwtSignUser(userJson)
            })
          })
        }
      })
    } catch (err) {
      res.status(400).send({
        error: 'Error in Change password'
      })
    }
  },
  async sendPassword (req, res) {
    try {
      const { email } = req.body
      return User.findOne({
        where: { email: email }
      }).then(function (result) {
        if (result) {
          ses.sendResetPasswordMail(result.email)
        }
      })
    } catch (err) {
      console.log(err)
      res.status(400).send({
        error: 'Error in Change password'
      })
    }
  }
}
