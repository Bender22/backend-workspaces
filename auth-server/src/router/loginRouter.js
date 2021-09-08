import express from 'express'
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserDataModel from '../model/UserDataModel.js'
import { invalidate } from '../utils/invalidateTokens.js'
import loginMiddleware from '../middleware/loginMiddleware.js'

const router = express.Router()

router.post('/auth', loginMiddleware, async (req, res) => {
  console.log(req.body)
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
  const accessTokenExpire = 10
  const refreshTokenExpire = 60
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

router.post('/logout', async (req, res) => {
  const { refresh_token } = req.body
  try {
    const invalid = await invalidate(refresh_token)
    res.send({ invalid })
  } catch (e) {
    res.send(e)
  }
})

export default router
