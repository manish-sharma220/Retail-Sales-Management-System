import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SalesListPage from '../pages/SalesListPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SalesListPage />} />
    </Routes>
  );
}
