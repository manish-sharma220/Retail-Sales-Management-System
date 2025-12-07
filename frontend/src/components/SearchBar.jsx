import React from 'react';

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search by customer name or phone..."}
        className="search-input"
      />
    </div>
  );
}
