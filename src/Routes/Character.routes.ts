import { Router } from 'express'
const CharacterRoutes = Router()

import CharacterController from '../Controllers/CharacterController'
import Middleware from '../Controllers/Middleware'

CharacterRoutes.get('/', CharacterController.getAll)
CharacterRoutes.post('/', Middleware.checkAuth, CharacterController.create)
CharacterRoutes.put('/:id', Middleware.checkAuth, CharacterController.update)
CharacterRoutes.delete('/:id', Middleware.checkAuth, CharacterController.delete)

export default CharacterRoutes