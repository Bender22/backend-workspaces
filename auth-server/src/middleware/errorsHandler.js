const ERRORS = {
  UnauthorizedError: (err, res) => res.status(err.status).send({ message: err.message })
}
export default (err, req, res, next) => {
  const error = ERRORS[err.name]
  error(err, res)
  // next()
}
