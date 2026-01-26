import express from 'express';
import { addComment, getComments } from '../controllers/comment.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/:postId', authMiddleware, addComment);
router.get('/:postId', authMiddleware, getComments);

export default router;
