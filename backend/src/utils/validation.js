function validateSaleData(data) {
  const validationErrors = [];

  if (!data.customerId || typeof data.customerId !== 'string') {
    validationErrors.push('Customer ID is required');
  }

  if (!data.customerName || typeof data.customerName !== 'string' || data.customerName.trim().length === 0) {
    validationErrors.push('Customer name is required');
  }

  if (!data.phoneNumber || typeof data.phoneNumber !== 'string') {
    validationErrors.push('Phone number is required');
  } else {
    const phoneDigits = data.phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      validationErrors.push('Phone number must have at least 10 digits');
    }
  }

  const allowedGenders = ['Male', 'Female', 'Other'];
  if (!data.gender || !allowedGenders.includes(data.gender)) {
    validationErrors.push('Valid gender is required (Male, Female, Other)');
  }

  const ageValue = parseInt(data.age);
  if (isNaN(ageValue) || ageValue < 0) {
    validationErrors.push('Age must be a positive number');
  }

  if (!data.customerRegion || typeof data.customerRegion !== 'string') {
    validationErrors.push('Customer region is required');
  }

  if (!data.customerType || typeof data.customerType !== 'string') {
    validationErrors.push('Customer type is required');
  }

  if (!data.productId || typeof data.productId !== 'string') {
    validationErrors.push('Product ID is required');
  }

  if (!data.productName || typeof data.productName !== 'string' || data.productName.trim().length === 0) {
    validationErrors.push('Product name is required');
  }

  if (!data.brand || typeof data.brand !== 'string') {
    validationErrors.push('Brand is required');
  }

  if (!data.productCategory || typeof data.productCategory !== 'string') {
    validationErrors.push('Product category is required');
  }

  const qty = parseInt(data.quantity);
  if (isNaN(qty) || qty < 1) {
    validationErrors.push('Quantity must be at least 1');
  }

  const price = parseFloat(data.pricePerUnit);
  if (isNaN(price) || price < 0) {
    validationErrors.push('Price per unit must be a positive number');
  }

  const discount = parseFloat(data.discountPercentage || 0);
  if (isNaN(discount) || discount < 0 || discount > 100) {
    validationErrors.push('Discount percentage must be between 0 and 100');
  }

  const total = parseFloat(data.totalAmount);
  if (isNaN(total) || total < 0) {
    validationErrors.push('Total amount must be a positive number');
  }

  const final = parseFloat(data.finalAmount);
  if (isNaN(final) || final < 0) {
    validationErrors.push('Final amount must be a positive number');
  }

  if (!data.paymentMethod || typeof data.paymentMethod !== 'string') {
    validationErrors.push('Payment method is required');
  }

  if (!data.orderStatus || typeof data.orderStatus !== 'string') {
    validationErrors.push('Order status is required');
  }

  if (!data.deliveryType || typeof data.deliveryType !== 'string') {
    validationErrors.push('Delivery type is required');
  }

  if (!data.storeId || typeof data.storeId !== 'string') {
    validationErrors.push('Store ID is required');
  }

  if (!data.storeLocation || typeof data.storeLocation !== 'string') {
    validationErrors.push('Store location is required');
  }

  if (!data.salespersonId || typeof data.salespersonId !== 'string') {
    validationErrors.push('Salesperson ID is required');
  }

  if (!data.employeeName || typeof data.employeeName !== 'string') {
    validationErrors.push('Employee name is required');
  }

  if (data.date) {
    const dateValue = new Date(data.date);
    if (isNaN(dateValue.getTime())) {
      validationErrors.push('Invalid date format');
    }
  }

  return {
    isValid: validationErrors.length === 0,
    errors: validationErrors
  };
}

export { validateSaleData };
