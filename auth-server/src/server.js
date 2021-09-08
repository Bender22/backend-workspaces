import './database/mongodb.js'
import express from 'express'
import logger from 'morgan'
import helmet from 'helmet'
import loginRouter from './router/loginRouter.js'
// import errorsHandler from './middleware/errorsHandler.js'

const app = express()

app.use(helmet())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', loginRouter)
// app.use(errorsHandler)
export default app
