import React, { useState, useEffect } from 'react';
import { saleService } from '../services/saleService';
import { useDebounce } from '../hooks/useDebounce';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import SalesTable from '../components/SalesTable';
import Pagination from '../components/Pagination';

export default function SalesListPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    customerRegion: [],
    gender: [],
    minAge: '',
    maxAge: '',
    productCategory: [],
    tags: [],
    paymentMethod: []
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [summary, setSummary] = useState({
    totalUnits: 0,
    totalAmount: 0,
    totalDiscount: 0
  });

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchSales();
  }, [debouncedSearch, filters, sortBy, sortOrder, currentPage]);

  const fetchSales = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        search: debouncedSearch,
        sortBy,
        sortOrder,
        page: currentPage
      };

      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.customerRegion?.length > 0) params.customerRegion = filters.customerRegion;
      if (filters.gender?.length > 0) params.gender = filters.gender;
      if (filters.minAge) params.minAge = filters.minAge;
      if (filters.maxAge) params.maxAge = filters.maxAge;
      if (filters.productCategory?.length > 0) params.productCategory = filters.productCategory;
      if (filters.tags?.length > 0) params.tags = filters.tags;
      if (filters.paymentMethod?.length > 0) params.paymentMethod = filters.paymentMethod;

      const response = await saleService.getSales(params);
      setSales(response.data);
      setPagination(response.pagination);
      
      calculateSummary(response.data);
    } catch (err) {
      setError('Failed to load sales data. Please try again.');
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (salesData) => {
    const totalUnits = salesData.reduce((sum, sale) => sum + (sale.quantity || 0), 0);
    const totalAmount = salesData.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
    const totalDiscount = salesData.reduce((sum, sale) => {
      const discount = (sale.totalAmount || 0) - (sale.finalAmount || 0);
      return sum + discount;
    }, 0);

    setSummary({ totalUnits, totalAmount, totalDiscount });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      customerRegion: [],
      gender: [],
      minAge: '',
      maxAge: '',
      productCategory: [],
      tags: [],
      paymentMethod: []
    });
    setCurrentPage(1);
  };

  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="sales-list-page">
      <header className="page-header">
        <h1>Sales Management System</h1>
        <SearchBar 
          value={searchTerm} 
          onChange={handleSearchChange}
          placeholder="Name, Phone no..."
        />
      </header>

      <div className="filters-row">
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
        
        <div className="sort-dropdown">
          <label>Sort by:</label>
          <select 
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              handleSort(field, order);
            }}
          >
            <option value="customer-asc">Customer Name (A-Z)</option>
            <option value="customer-desc">Customer Name (Z-A)</option>
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="quantity-desc">Quantity (High to Low)</option>
            <option value="quantity-asc">Quantity (Low to High)</option>
          </select>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-label">
            Total units sold
            <span className="info-icon">ⓘ</span>
          </div>
          <div className="summary-value">{summary.totalUnits}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">
            Total Amount
            <span className="info-icon">ⓘ</span>
          </div>
          <div className="summary-value">₹{summary.totalAmount.toLocaleString()} ({sales.length} SRs)</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">
            Total Discount
            <span className="info-icon">ⓘ</span>
          </div>
          <div className="summary-value">₹{summary.totalDiscount.toLocaleString()} ({sales.length} SRs)</div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          <SalesTable
            sales={sales}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          {pagination && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
