import { Router } from 'express';
import chatsController from '../controllers/chats-controller.js';
import { checkAuth } from '../utils/checkAuth.js';

const router = Router()

router.get('/:userName', checkAuth, chatsController.getChatByUserName)
// router.get('', postsController.getAllPosts)
// router.post('', checkAuth, postsController.createPost)
// router.patch('/:postId', checkAuth, postsController.updatePost)
// router.delete('/:id', checkAuth, postsController.deletePost)

// router.post('/like', checkAuth, postsController.likePost)
// router.get('/user/:id', postsController.getPostsByUserId)


export default router