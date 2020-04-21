import express from 'express'
import setUpMiddlewares from './middleware'
const app = express()
setUpMiddlewares(app)
export default app
