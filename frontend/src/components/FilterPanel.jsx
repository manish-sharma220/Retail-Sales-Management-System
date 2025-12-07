import React, { useState, useEffect } from 'react';
import { saleService } from '../services/saleService';

export default function FilterPanel({ filters, onFilterChange, onClearFilters }) {
  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    categories: [],
    tags: [],
    paymentMethods: []
  });

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const response = await saleService.getFilterOptions();
      if (response.success) {
        setFilterOptions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
    }
  };

  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleMultiSelect = (field, value) => {
    const currentValues = filters[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    handleChange(field, newValues.length > 0 ? newValues : undefined);
  };

  const hasActiveFilters = filters.startDate || filters.endDate || 
                          filters.customerRegion?.length > 0 ||
                          filters.gender?.length > 0 ||
                          filters.minAge || filters.maxAge ||
                          filters.productCategory?.length > 0 ||
                          filters.tags?.length > 0 ||
                          filters.paymentMethod?.length > 0;

  return (
    <div className="filter-panel">
      <div className="filter-section">
        <h3>Date Range</h3>
        <div className="filter-row">
          <div className="filter-group">
            <label>Start Date</label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label>End Date</label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="filter-input"
            />
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h3>Customer Filters</h3>
        <div className="filter-group">
          <label>Gender</label>
          <div className="checkbox-group">
            {['Male', 'Female', 'Other'].map(gender => (
              <label key={gender} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.gender?.includes(gender) || false}
                  onChange={() => handleMultiSelect('gender', gender)}
                />
                {gender}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Age Range</label>
          <div className="filter-row">
            <input
              type="number"
              placeholder="Min"
              value={filters.minAge || ''}
              onChange={(e) => handleChange('minAge', e.target.value)}
              className="filter-input-small"
              min="0"
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxAge || ''}
              onChange={(e) => handleChange('maxAge', e.target.value)}
              className="filter-input-small"
              min="0"
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Region</label>
          <div className="checkbox-group scrollable">
            {filterOptions.regions.map(region => (
              <label key={region} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.customerRegion?.includes(region) || false}
                  onChange={() => handleMultiSelect('customerRegion', region)}
                />
                {region}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h3>Product Filters</h3>
        <div className="filter-group">
          <label>Category</label>
          <div className="checkbox-group scrollable">
            {filterOptions.categories.map(category => (
              <label key={category} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.productCategory?.includes(category) || false}
                  onChange={() => handleMultiSelect('productCategory', category)}
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Tags</label>
          <div className="checkbox-group scrollable">
            {filterOptions.tags.map(tag => (
              <label key={tag} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.tags?.includes(tag) || false}
                  onChange={() => handleMultiSelect('tags', tag)}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h3>Payment Method</h3>
        <div className="checkbox-group">
          {filterOptions.paymentMethods.map(method => (
            <label key={method} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.paymentMethod?.includes(method) || false}
                onChange={() => handleMultiSelect('paymentMethod', method)}
              />
              {method}
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button onClick={onClearFilters} className="clear-filters-btn">
          Clear All Filters
        </button>
      )}
    </div>
  );
}
