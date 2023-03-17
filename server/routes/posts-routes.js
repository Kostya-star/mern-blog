import { Router } from 'express';
import postsController from '../controllers/posts-controller.js';
import { checkAuth } from '../utils/checkAuth.js';
import { checkValidationErrors } from '../utils/checkValidationErrors.js';
import { postValidator } from './../validations/post-validator.js';
import multer from 'multer'
import { imageStorageCreator } from '../utils/imageStorageCreator.js';

const router = Router()

const upload = multer(imageStorageCreator(multer)) // multer({ storage })

router.get('/:id', postsController.getOnePost)
router.get('', postsController.getAllPosts)
router.post('', upload.single('image'), checkAuth, postsController.createPost)
router.patch('/edit', upload.single('image'), checkAuth, postsController.updatePost)
router.delete('/:id', checkAuth, postsController.deletePost)

router.post('/like', checkAuth, postsController.likePost)
router.get('/user/:id', postsController.getPostsByUserId)


export default router