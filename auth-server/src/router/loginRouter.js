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
  const userForToken = {
    id: user._id,
    name: user.name,
    username: user.username
  }

  const access_token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 30
  })
  const refresh_token = jwt.sign(userForToken, process.env.SECRET_ACCESS, {
    expiresIn: 60 * 60 * 24 * 7
  })
  res.status(200).json({
    access_token,
    refresh_token
  })
})

export default router
