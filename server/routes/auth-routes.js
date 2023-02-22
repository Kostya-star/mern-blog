import { Router } from 'express'
import controller from '../controllers/auth-controller.js'
import { registerValidator } from '../validations/auth-validator.js'

const router = Router()

router.post('/register', registerValidator, controller.register)
router.post('/login', controller.login)

export default router