import jwt from 'jsonwebtoken'

const invalidRefreshToken = []

// Handle tokens in memory
export function invalidateToken (accessToken) {
  invalidRefreshToken.add(accessToken)
}

export function isTokenInvalid (accessToken) {
  invalidRefreshToken.find(accessToken, (exist) => {
    return exist
  })
}
export function deleteOutOfDateTokens () {
  invalidRefreshToken.map((element, index) => {
    const { exp } = jwt.verify(element, process.env.SECRET_ACCESS)
    const date = new Date(exp * 1000)
    if (Date.now() > date) {
      return invalidRefreshToken.splice(index, 1)
    }
    return invalidRefreshToken
  })
}
