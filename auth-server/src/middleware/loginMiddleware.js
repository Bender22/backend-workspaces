import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  const { grant_type } = req.body
  let userData = {}
  if (grant_type === 'refresh_token') {
    const { refresh_token } = req.body
    const decodedToken = jwt.verify(refresh_token, process.env.SECRET_ACCESS)
    userData = {
      grant_type,
      username: decodedToken.username
    }
  } else if (grant_type === 'password') {
    const { username, password } = req.body
    userData = {
      grant_type,
      username,
      password
    }
  }
  req.userData = userData
  next()
}
