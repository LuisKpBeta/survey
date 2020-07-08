import setUpMiddlewares from './middleware'
import setUpRoutes from './routes'
import express from 'express'
const app = express()
setUpMiddlewares(app)
setUpRoutes(app)
export default app
