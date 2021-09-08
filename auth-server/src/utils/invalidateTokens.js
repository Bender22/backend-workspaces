import jwt from 'jsonwebtoken'
import TokenDataModel from '../model/TokenDataModel.js'

// Handle tokens in database
export const invalidate = async (refreshToken) => {
  const { username, exp } = jwt.verify(refreshToken, process.env.SECRET_ACCESS)
  const date = new Date(exp * 1000)
  console.log(date.toLocaleString('es-ES', { timeZone: 'Cuba' }))
  const tokenSaved = new TokenDataModel({
    token: refreshToken,
    username,
    date
  })
  await deleteOutOfDateTokens()

  return await tokenSaved.save()
  //   .then((result) => {
  //   console.log({
  //     message: 'token saved',
  //     result
  //   })
  // }).catch(err => {
  //   console.log(err)
  // })
}

export const isTokenInvalid = async (refreshToken) => {
  const { username, exp } = jwt.decode(refreshToken, process.env.SECRET_ACCESS)
  const toSearch = {
    token: refreshToken,
    username,
    date: new Date(exp * 1000)
  }
  return await TokenDataModel.exists(toSearch)
}

export function deleteOutOfDateTokens () {
  TokenDataModel.deleteMany({ date: { $lt: Date.now() } }).then(() => {
    console.log('Delete all expired refresh token')
  }).catch(e => {
    console.log(e)
  })
}
