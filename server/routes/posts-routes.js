import { Router } from 'express'
import { checkAuth } from '../utils/checkAuth.js'
import postsController from '../controllers/posts-controller.js'
import { postValidator } from './../validations/post-validator.js';

const router = Router()

router.get('/:id', postsController.getOnePost)
router.get('', postsController.getAllPosts)
router.post('', checkAuth, postValidator, postsController.createPost) 
// router.patch('/', postsController.updatePost) update
router.delete('/:id', checkAuth, postsController.deletePost)


export default router