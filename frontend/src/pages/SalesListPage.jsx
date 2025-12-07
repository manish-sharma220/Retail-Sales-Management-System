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
    } catch (err) {
      setError('Failed to load sales data. Please try again.');
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
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
        <h1>Retail Sales Management</h1>
        {pagination && (
          <div className="record-count">
            Showing {sales.length} of {pagination.totalRecords} records
          </div>
        )}
      </header>

      <div className="controls-section">
        <SearchBar 
          value={searchTerm} 
          onChange={handleSearchChange}
          placeholder="Search by customer name or phone number..."
        />
        
        <div className="sort-control">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => handleSort(e.target.value, sortOrder)}
            className="sort-select"
          >
            <option value="date">Date (Newest First)</option>
            <option value="quantity">Quantity</option>
            <option value="customer">Customer Name (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="main-content">
        <aside className="filters-sidebar">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </aside>

        <main className="content-area">
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
        </main>
      </div>
    </div>
  );
}
