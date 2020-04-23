import express from 'express'
import setUpMiddlewares from './middleware'
import setUpRoutes from './routes'
const app = express()
setUpMiddlewares(app)
setUpRoutes(app)
export default app
