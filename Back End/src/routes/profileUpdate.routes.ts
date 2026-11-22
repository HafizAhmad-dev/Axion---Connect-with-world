import { Router } from 'express';
import { updateDisplayName, updatePassword, updateProfilePicture, updateUsername } from '../controllers/profile.controller';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getUserProfile } from '../controllers/profile.controller';

import upload from '../middlewares/multer.upload.js';

const router = Router();

router.get('/', authMiddleware, getUserProfile);
router.patch('/displayname', authMiddleware, updateDisplayName);
router.patch('/username', authMiddleware, updateUsername);
router.patch('/password', authMiddleware, updatePassword);
router.post('/profile-picture', authMiddleware,upload.single('avatar'),updateProfilePicture); 



export default router;