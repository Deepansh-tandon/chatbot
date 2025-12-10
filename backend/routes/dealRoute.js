import express from 'express';
import { 
  getAllDeals, 
  getDealById, 
  createDeal, 
  updateDeal, 
  deleteDeal,
  getCategories 
} from '../controllers/deals.controller.js';

const router = express.Router();

router.get('/', getAllDeals);
router.get('/categories', getCategories);
router.get('/:dealId', getDealById);

router.post('/', createDeal);
router.put('/:dealId', updateDeal);
router.delete('/:dealId', deleteDeal);

export default router;
