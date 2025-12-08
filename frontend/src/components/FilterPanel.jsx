import React, { useState, useEffect } from 'react';
import { saleService } from '../services/saleService';

export default function FilterPanel({ filters, onFilterChange }) {
  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    categories: [],
    tags: [],
    paymentMethods: []
  });
  const [openDropdown, setOpenDropdown] = useState(null);

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

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleMultiSelect = (field, value) => {
    const currentValues = filters[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    handleChange(field, newValues.length > 0 ? newValues : []);
  };

  const getSelectedCount = (field) => {
    return filters[field]?.length || 0;
  };

  return (
    <div className="filter-panel-horizontal">
      <button className="refresh-btn" onClick={() => window.location.reload()}>
        ↻
      </button>

      <div className="filter-dropdown">
        <button 
          className="filter-btn"
          onClick={() => toggleDropdown('region')}
        >
          Customer Region {getSelectedCount('customerRegion') > 0 && `(${getSelectedCount('customerRegion')})`}
          <span className="arrow">▼</span>
        </button>
        {openDropdown === 'region' && (
          <div className="dropdown-menu">
            {filterOptions.regions.map(region => (
              <label key={region} className="dropdown-item">
                <input
                  type="checkbox"
                  checked={filters.customerRegion?.includes(region) || false}
                  onChange={() => handleMultiSelect('customerRegion', region)}
                />
                {region}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter-dropdown">
        <button 
          className="filter-btn"
          onClick={() => toggleDropdown('gender')}
        >
          Gender {getSelectedCount('gender') > 0 && `(${getSelectedCount('gender')})`}
          <span className="arrow">▼</span>
        </button>
        {openDropdown === 'gender' && (
          <div className="dropdown-menu">
            {['Male', 'Female', 'Other'].map(gender => (
              <label key={gender} className="dropdown-item">
                <input
                  type="checkbox"
                  checked={filters.gender?.includes(gender) || false}
                  onChange={() => handleMultiSelect('gender', gender)}
                />
                {gender}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter-dropdown">
        <button 
          className="filter-btn"
          onClick={() => toggleDropdown('age')}
        >
          Age Range {(filters.minAge || filters.maxAge) && '(✓)'}
          <span className="arrow">▼</span>
        </button>
        {openDropdown === 'age' && (
          <div className="dropdown-menu age-range">
            <input
              type="number"
              placeholder="Min"
              value={filters.minAge || ''}
              onChange={(e) => handleChange('minAge', e.target.value)}
              className="age-input"
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxAge || ''}
              onChange={(e) => handleChange('maxAge', e.target.value)}
              className="age-input"
            />
          </div>
        )}
      </div>

      <div className="filter-dropdown">
        <button 
          className="filter-btn"
          onClick={() => toggleDropdown('category')}
        >
          Product Category {getSelectedCount('productCategory') > 0 && `(${getSelectedCount('productCategory')})`}
          <span className="arrow">▼</span>
        </button>
        {openDropdown === 'category' && (
          <div className="dropdown-menu">
            {filterOptions.categories.map(category => (
              <label key={category} className="dropdown-item">
                <input
                  type="checkbox"
                  checked={filters.productCategory?.includes(category) || false}
                  onChange={() => handleMultiSelect('productCategory', category)}
                />
                {category}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter-dropdown">
        <button 
          className="filter-btn"
          onClick={() => toggleDropdown('tags')}
        >
          Tags {getSelectedCount('tags') > 0 && `(${getSelectedCount('tags')})`}
          <span className="arrow">▼</span>
        </button>
        {openDropdown === 'tags' && (
          <div className="dropdown-menu">
            {filterOptions.tags.map(tag => (
              <label key={tag} className="dropdown-item">
                <input
                  type="checkbox"
                  checked={filters.tags?.includes(tag) || false}
                  onChange={() => handleMultiSelect('tags', tag)}
                />
                {tag}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter-dropdown">
        <button 
          className="filter-btn"
          onClick={() => toggleDropdown('payment')}
        >
          Payment Method {getSelectedCount('paymentMethod') > 0 && `(${getSelectedCount('paymentMethod')})`}
          <span className="arrow">▼</span>
        </button>
        {openDropdown === 'payment' && (
          <div className="dropdown-menu">
            {filterOptions.paymentMethods.map(method => (
              <label key={method} className="dropdown-item">
                <input
                  type="checkbox"
                  checked={filters.paymentMethod?.includes(method) || false}
                  onChange={() => handleMultiSelect('paymentMethod', method)}
                />
                {method}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter-dropdown">
        <button 
          className="filter-btn"
          onClick={() => toggleDropdown('date')}
        >
          Date {(filters.startDate || filters.endDate) && '(✓)'}
          <span className="arrow">▼</span>
        </button>
        {openDropdown === 'date' && (
          <div className="dropdown-menu date-range">
            <label>Start Date</label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="date-input"
            />
            <label>End Date</label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="date-input"
            />
          </div>
        )}
      </div>
    </div>
  );
}
