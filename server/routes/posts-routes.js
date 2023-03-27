import { Router } from 'express';
import postsController from '../controllers/posts-controller.js';
import { checkAuth } from '../utils/checkAuth.js';
import { checkValidationErrors } from '../utils/checkValidationErrors.js';
import { postValidator } from './../validations/post-validator.js';

const router = Router()


router.get('/:id', postsController.getOnePost)
router.get('', postsController.getAllPosts)
router.post('', checkAuth, postsController.createPost)
router.patch('/:postId', checkAuth, postsController.updatePost)
router.delete('/:id', checkAuth, postsController.deletePost)

router.post('/like', checkAuth, postsController.likePost)
router.get('/user/:id', postsController.getPostsByUserId)


export default router