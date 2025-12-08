import express from 'express';
import saleController from '../controllers/saleController.js';

const router = express.Router();

router.get('/filter-options', saleController.getFilterOptions.bind(saleController));
router.get('/:id', saleController.getSaleById.bind(saleController));
router.get('/', saleController.getSales.bind(saleController));
router.post('/', saleController.createSale.bind(saleController));

export default router;
