import express from 'express';
import saleController from '../controllers/saleController.js';

const router = express.Router();

router.get('/', saleController.getSales.bind(saleController));
router.get('/filter-options', saleController.getFilterOptions.bind(saleController));
router.post('/', saleController.createSale.bind(saleController));
router.get('/:id', saleController.getSaleById.bind(saleController));

export default router;
