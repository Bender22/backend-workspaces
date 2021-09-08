import express from 'express'
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserDataModel from '../model/UserDataModel.js'
import loginMiddleware from '../middleware/loginMiddleware.js'

const router = express.Router()

router.post('/login', loginMiddleware, async (req, res) => {
  console.log(req.body)
  // let userData = {
  //   username: '',
  //   password: ''
  //
  // }
  // if (grant_type === 'refresh_token') {
  //   const { refresh_token } = req.body
  //   const { decodedToken } = jwt.verify(refresh_token, process.env.SECRET_ACCESS)
  //   console.log({ data: decodedToken })
  //   userData = {
  //     username: decodedToken.username
  //   }
  // } else if (grant_type === 'password') {
  //   const { username, password } = req.body
  //   userData = {
  //     username,
  //     password
  //   }
  // }
  const userData = req.userData
  const user = await UserDataModel.findOne({ username: userData.username })
  if (userData.grant_type === 'password') {
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(userData.password, user.passwordHash)

    if (!(userData.username && passwordCorrect)) {
      return res.status(401).json({
        err: 'Invalid username or password'
      })
    }
  }
  const dataAccessToken = {
    id: user._id,
    username: user.username
  }
  const dataRefreshToken = {
    username: user.username
  }
  const dataIdToken = {
    id: user._id,
    name: user.name
  }
  const accessTokenExpire = 60 * 15
  const refreshTokenExpire = 60 * 60 * 24 * 7
  const idTokenExpire = 60 * 60 * 10

  const access_token = jwt.sign(dataAccessToken, process.env.SECRET, {
    expiresIn: accessTokenExpire
  })
  const refresh_token = jwt.sign(dataRefreshToken, process.env.SECRET_ACCESS, {
    expiresIn: refreshTokenExpire
  })
  const id_token = jwt.sign(dataIdToken, process.env.SECRET_ACCESS, {
    expiresIn: idTokenExpire
  })
  res.status(200).json({
    access_token,
    expires_in: accessTokenExpire,
    token_type: 'Bearer',
    refresh_token,
    refresh_token_expires_in: refreshTokenExpire,
    id_token
  })
})

export default router
