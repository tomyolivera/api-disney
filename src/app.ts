import express, { Application } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import CharacterRoutes from './Routes/Character.routes'
import MovieRoutes from './Routes/Movie.routes'
import AuthRoutes from './Routes/Auth.routes'

const app: Application = express()

export const CorsOptions = {
    origin: '*',
    credentials: true,
    cors: true
}

app.use(cors(CorsOptions))
app.use(bodyParser.json())

// Routes
app.use('/api/characters', CharacterRoutes)
app.use('/api/movies', MovieRoutes)
app.use('/api/auth', AuthRoutes)

export default app