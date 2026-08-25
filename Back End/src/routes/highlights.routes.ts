import { Router } from 'express';
import { createHighlight, retrieveHighlights, retrieveUserHighlights, viewHighlight } from '../controllers/highlights.controller';

const router = Router();

router.post('/create',createHighlight);
router.post('/:highlightId/view', viewHighlight);
router.get('/',retrieveHighlights);
router.get('/me',retrieveUserHighlights)
export default router;
