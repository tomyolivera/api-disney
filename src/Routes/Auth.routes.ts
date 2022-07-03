import { Router } from 'express'
const AuthRoutes = Router()

import AuthController from '../Controllers/AuthController'

AuthRoutes.post('/register', AuthController.register)
AuthRoutes.post('/login', AuthController.login)

export default AuthRoutes