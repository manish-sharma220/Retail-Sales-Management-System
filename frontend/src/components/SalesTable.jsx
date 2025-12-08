import React from 'react';
import { formatDate } from '../utils/formatters';

export default function SalesTable({ sales }) {
  if (!sales || sales.length === 0) {
    return (
      <div className="empty-state">
        <p>No sales records found</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="sales-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Customer ID</th>
            <th>Customer name</th>
            <th>Phone Number</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Product Category</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale, index) => (
            <tr key={sale._id || index}>
              <td>{sale.customerId || 'N/A'}</td>
              <td>{sale.date ? new Date(sale.date).toISOString().split('T')[0] : 'N/A'}</td>
              <td>{sale.customerId || 'N/A'}</td>
              <td>{sale.customerName || 'N/A'}</td>
              <td>
                {sale.phoneNumber || 'N/A'}
                {sale.phoneNumber && <span className="copy-icon">📋</span>}
              </td>
              <td>{sale.gender || 'N/A'}</td>
              <td>{sale.age || 'N/A'}</td>
              <td>{sale.productCategory || 'N/A'}</td>
              <td>{sale.quantity || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
