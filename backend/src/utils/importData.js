import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import Sale from '../models/Sale.js';

const MAX_RECORDS = 50;

async function importDataFromCSV(filePath) {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/retail_sales';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing existing data...');
    await Sale.deleteMany({});
    console.log('Existing data cleared');

    const records = [];
    let recordCount = 0;

    console.log(`Reading CSV file (limiting to ${MAX_RECORDS} records)...`);

    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          if (recordCount >= MAX_RECORDS) {
            stream.destroy();
            return;
          }

          const record = transformRecord(row);
          if (record) {
            records.push(record);
            recordCount++;
          }
        })
        .on('end', async () => {
          if (records.length > 0) {
            console.log(`Inserting ${records.length} records...`);
            await Sale.insertMany(records);
            console.log('\n=== Import Complete ===');
            console.log(`Total records inserted: ${records.length}`);
          }
          
          await mongoose.connection.close();
          resolve();
        })
        .on('error', (error) => {
          console.error('Error reading CSV:', error);
          reject(error);
        });
    });
  } catch (error) {
    console.error('Import error:', error);
    process.exit(1);
  }
}

function transformRecord(row) {
  try {
    return {
      customerId: row['Customer ID'] || row.customerId,
      customerName: row['Customer Name'] || row.customerName,
      phoneNumber: row['Phone Number'] || row.phoneNumber,
      gender: row['Gender'] || row.gender,
      age: parseInt(row['Age'] || row.age),
      customerRegion: row['Customer Region'] || row.customerRegion,
      customerType: row['Customer Type'] || row.customerType,
      productId: row['Product ID'] || row.productId,
      productName: row['Product Name'] || row.productName,
      brand: row['Brand'] || row.brand,
      productCategory: row['Product Category'] || row.productCategory,
      tags: (row['Tags'] || row.tags || '').split(',').map(t => t.trim()).filter(Boolean),
      quantity: parseInt(row['Quantity'] || row.quantity),
      pricePerUnit: parseFloat(row['Price per Unit'] || row.pricePerUnit),
      discountPercentage: parseFloat(row['Discount Percentage'] || row.discountPercentage || 0),
      totalAmount: parseFloat(row['Total Amount'] || row.totalAmount),
      finalAmount: parseFloat(row['Final Amount'] || row.finalAmount),
      date: new Date(row['Date'] || row.date),
      paymentMethod: row['Payment Method'] || row.paymentMethod,
      orderStatus: row['Order Status'] || row.orderStatus,
      deliveryType: row['Delivery Type'] || row.deliveryType,
      storeId: row['Store ID'] || row.storeId,
      storeLocation: row['Store Location'] || row.storeLocation,
      salespersonId: row['Salesperson ID'] || row.salespersonId,
      employeeName: row['Employee Name'] || row.employeeName
    };
  } catch (error) {
    console.error('Error transforming record:', error);
    return null;
  }
}

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node importData.js <path-to-csv-file>');
  process.exit(1);
}

importDataFromCSV(filePath);
