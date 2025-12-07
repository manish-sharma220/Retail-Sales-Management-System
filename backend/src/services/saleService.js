import Sale from '../models/Sale.js';

class SaleService {
  async fetchSalesWithFilters(filters) {
    const queryConditions = this.constructQueryConditions(filters);
    const sortCriteria = this.determineSortCriteria(filters.sortBy, filters.sortOrder);
    
    const pageNumber = parseInt(filters.page) || 1;
    const itemsPerPage = 10;
    const skipCount = (pageNumber - 1) * itemsPerPage;

    const salesData = await Sale.find(queryConditions)
      .sort(sortCriteria)
      .skip(skipCount)
      .limit(itemsPerPage)
      .lean();

    const totalCount = await Sale.countDocuments(queryConditions);

    return {
      sales: salesData,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / itemsPerPage),
        totalRecords: totalCount,
        recordsPerPage: itemsPerPage
      }
    };
  }

  constructQueryConditions(filters) {
    const conditions = {};

    if (filters.search && filters.search.trim()) {
      const searchPattern = filters.search.trim();
      conditions.$or = [
        { customerName: { $regex: searchPattern, $options: 'i' } },
        { phoneNumber: { $regex: searchPattern, $options: 'i' } }
      ];
    }

    if (filters.startDate || filters.endDate) {
      conditions.date = {};
      
      if (filters.startDate) {
        const startDateTime = new Date(filters.startDate);
        if (!isNaN(startDateTime.getTime())) {
          startDateTime.setHours(0, 0, 0, 0);
          conditions.date.$gte = startDateTime;
        }
      }
      
      if (filters.endDate) {
        const endDateTime = new Date(filters.endDate);
        if (!isNaN(endDateTime.getTime())) {
          endDateTime.setHours(23, 59, 59, 999);
          conditions.date.$lte = endDateTime;
        }
      }
    }

    if (filters.customerRegion) {
      const regions = Array.isArray(filters.customerRegion) 
        ? filters.customerRegion 
        : [filters.customerRegion];
      if (regions.length > 0) {
        conditions.customerRegion = { $in: regions };
      }
    }

    if (filters.gender) {
      const genders = Array.isArray(filters.gender) 
        ? filters.gender 
        : [filters.gender];
      if (genders.length > 0) {
        conditions.gender = { $in: genders };
      }
    }

    if (filters.minAge || filters.maxAge) {
      conditions.age = {};
      if (filters.minAge) {
        conditions.age.$gte = parseInt(filters.minAge);
      }
      if (filters.maxAge) {
        conditions.age.$lte = parseInt(filters.maxAge);
      }
    }

    if (filters.productCategory) {
      const categories = Array.isArray(filters.productCategory) 
        ? filters.productCategory 
        : [filters.productCategory];
      if (categories.length > 0) {
        conditions.productCategory = { $in: categories };
      }
    }

    if (filters.tags) {
      const tagsList = Array.isArray(filters.tags) 
        ? filters.tags 
        : [filters.tags];
      if (tagsList.length > 0) {
        conditions.tags = { $in: tagsList };
      }
    }

    if (filters.paymentMethod) {
      const methods = Array.isArray(filters.paymentMethod) 
        ? filters.paymentMethod 
        : [filters.paymentMethod];
      if (methods.length > 0) {
        conditions.paymentMethod = { $in: methods };
      }
    }

    return conditions;
  }

  determineSortCriteria(sortField, sortDirection) {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    const fieldMapping = {
      'date': 'date',
      'quantity': 'quantity',
      'customer': 'customerName'
    };

    const actualField = fieldMapping[sortField] || 'date';
    return { [actualField]: direction };
  }

  async addNewSale(saleInfo) {
    const newSale = new Sale(saleInfo);
    return await newSale.save();
  }

  async findSaleById(saleId) {
    return await Sale.findById(saleId);
  }

  async getFilterOptions() {
    const regions = await Sale.distinct('customerRegion');
    const categories = await Sale.distinct('productCategory');
    const tags = await Sale.distinct('tags');
    const paymentMethods = await Sale.distinct('paymentMethod');
    
    return {
      regions: regions.sort(),
      categories: categories.sort(),
      tags: tags.sort(),
      paymentMethods: paymentMethods.sort()
    };
  }
}

export default new SaleService();
