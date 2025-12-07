import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function SalesTable({ sales, sortBy, sortOrder, onSort }) {
  const handleSort = (field) => {
    const newOrder = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc';
    onSort(field, newOrder);
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (!sales || sales.length === 0) {
    return (
      <div className="empty-state">
        <p>No sales records found</p>
        <p className="empty-hint">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="sales-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('date')} className="sortable">
              Date {getSortIcon('date')}
            </th>
            <th onClick={() => handleSort('customer')} className="sortable">
              Customer {getSortIcon('customer')}
            </th>
            <th>Phone</th>
            <th>Region</th>
            <th>Product</th>
            <th>Category</th>
            <th onClick={() => handleSort('quantity')} className="sortable">
              Qty {getSortIcon('quantity')}
            </th>
            <th>Price</th>
            <th>Discount</th>
            <th>Final Amount</th>
            <th>Payment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale._id}>
              <td>{formatDate(sale.date)}</td>
              <td>
                <div className="customer-info">
                  <div className="customer-name">{sale.customerName}</div>
                  <div className="customer-meta">{sale.gender}, {sale.age}y</div>
                </div>
              </td>
              <td>{sale.phoneNumber}</td>
              <td>{sale.customerRegion}</td>
              <td>
                <div className="product-info">
                  <div className="product-name">{sale.productName}</div>
                  <div className="product-brand">{sale.brand}</div>
                </div>
              </td>
              <td>
                <span className="category-badge">
                  {sale.productCategory}
                </span>
              </td>
              <td className="quantity">{sale.quantity}</td>
              <td>{formatCurrency(sale.pricePerUnit)}</td>
              <td className="discount">{sale.discountPercentage}%</td>
              <td className="amount">{formatCurrency(sale.finalAmount)}</td>
              <td>
                <span className={`payment-badge ${sale.paymentMethod.toLowerCase()}`}>
                  {sale.paymentMethod}
                </span>
              </td>
              <td>
                <span className={`status-badge ${sale.orderStatus.toLowerCase().replace(' ', '-')}`}>
                  {sale.orderStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
