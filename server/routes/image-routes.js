import { Router } from 'express'
import imageController from '../controllers/image-controller.js'
import { checkAuth } from '../utils/checkAuth.js'

const router = Router()

router.post('/postImg', checkAuth, imageController.uploadImage)
router.post('/userPhoto', imageController.uploadImage)

export default router