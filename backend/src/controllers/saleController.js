import saleService from '../services/saleService.js';
import { validateSaleData } from '../utils/validation.js';

class SaleController {
  async getSales(req, res) {
    try {
      const filterParams = {
        search: req.query.search,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        customerRegion: req.query.customerRegion,
        gender: req.query.gender,
        minAge: req.query.minAge,
        maxAge: req.query.maxAge,
        productCategory: req.query.productCategory,
        tags: req.query.tags,
        paymentMethod: req.query.paymentMethod,
        sortBy: req.query.sortBy || 'date',
        sortOrder: req.query.sortOrder || 'desc',
        page: req.query.page || 1
      };

      const result = await saleService.fetchSalesWithFilters(filterParams);
      
      res.json({
        success: true,
        data: result.sales,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error fetching sales:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch sales records',
        error: error.message
      });
    }
  }

  async createSale(req, res) {
    try {
      const validationResult = validateSaleData(req.body);
      
      if (!validationResult.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationResult.errors
        });
      }

      const newSale = await saleService.addNewSale(req.body);
      
      res.status(201).json({
        success: true,
        data: newSale,
        message: 'Sale recorded successfully'
      });
    } catch (error) {
      console.error('Error creating sale:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create sale record',
        error: error.message
      });
    }
  }

  async getSaleById(req, res) {
    try {
      const sale = await saleService.findSaleById(req.params.id);
      
      if (!sale) {
        return res.status(404).json({
          success: false,
          message: 'Sale record not found'
        });
      }

      res.json({
        success: true,
        data: sale
      });
    } catch (error) {
      console.error('Error fetching sale:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch sale record',
        error: error.message
      });
    }
  }

  async getFilterOptions(req, res) {
    try {
      const options = await saleService.getFilterOptions();
      
      res.json({
        success: true,
        data: options
      });
    } catch (error) {
      console.error('Error fetching filter options:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch filter options',
        error: error.message
      });
    }
  }
}

export default new SaleController();
