import { Router } from 'express'
import authController from '../controllers/auth-controller.js'
import { checkAuth } from '../utils/checkAuth.js'
import { registerValidator, loginValidator } from '../validations/auth-validator.js'

const router = Router()

router.post('/register', registerValidator, authController.register)
router.post('/login', loginValidator, authController.login)
router.get('/me', checkAuth, authController.getUser)

export default router