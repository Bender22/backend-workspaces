import jwt from 'jsonwebtoken'
import { isTokenInvalid } from '../utils/invalidateTokens.js'

export default async (req, res, next) => {
  const { grant_type } = req.body
  let userData = {}

  if (grant_type === 'refresh_token') {
    const { refresh_token } = req.body

    const result = await isTokenInvalid(refresh_token)
    console.log(result)
    if (!result) {
      const decodedToken = jwt.decode(refresh_token, process.env.SECRET_ACCESS)
      if (new Date(decodedToken.exp * 1000) > Date.now()) {
        console.log(decodedToken)
        console.log(new Date(decodedToken.exp * 1000).toLocaleString('es-ES', { timeZone: 'Cuba' }))
        userData = {
          grant_type,
          username: decodedToken.username
        }
      } else {
        return res.status(401).json({
          err: 'Invalid username or password'
        })
      }
    } else if (result) {
      return res.status(401).json({
        err: 'Invalid username or password'
      })
    }
  } else if (grant_type === 'password') {
    const {
      username,
      password
    } = req.body
    userData = {
      grant_type,
      username,
      password
    }
  }
  req.userData = userData
  next()
}
