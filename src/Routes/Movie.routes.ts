import { Router } from 'express'
const MovieRoutes = Router()

import MovieController from '../Controllers/MovieController'
import Middleware from '../Controllers/Middleware'

MovieRoutes.get('/', MovieController.getAll)
MovieRoutes.post('/', Middleware.checkAuth, MovieController.create)
MovieRoutes.put('/:id', Middleware.checkAuth, MovieController.update)
MovieRoutes.delete('/:id', Middleware.checkAuth, MovieController.delete)

export default MovieRoutes