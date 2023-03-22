import { Router } from 'express'
import profileController from '../controllers/profile-controller.js'
import { checkAuth } from '../utils/checkAuth.js'

const router = Router()

router.get('/:id', profileController.getUser)
router.post('/follow', checkAuth, profileController.follow_unfollow)
router.get('/followers/:id', profileController.getUserFollowers)
router.delete('/follower/:id', checkAuth, profileController.deleteUserFollower)

export default router