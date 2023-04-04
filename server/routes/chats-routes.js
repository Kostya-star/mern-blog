import { Router } from 'express';
import chatsController from '../controllers/chats-controller.js';
import { checkAuth } from '../utils/checkAuth.js';

const router = Router()

router.get('/:interlocutorId', checkAuth, chatsController.accessChat) // if there is the chat then it is returned, otherwise the chat is created and returned(but not saved in the DB)
router.get('', checkAuth, chatsController.getAllChats)
// router.post('', checkAuth, postsController.createPost)
// router.patch('/:postId', checkAuth, postsController.updatePost)
// router.delete('/:id', checkAuth, postsController.deletePost)

// router.post('/like', checkAuth, postsController.likePost)
// router.get('/user/:id', postsController.getPostsByUserId)


export default router