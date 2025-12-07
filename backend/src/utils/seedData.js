import 'dotenv/config';
import mongoose from 'mongoose';
import Sale from '../models/Sale.js';

const sampleSales = [
  {
    customerName: 'Rajesh Kumar',
    customerPhone: '9876543210',
    productName: 'Samsung Galaxy S23',
    category: 'electronics',
    quantity: 1,
    amount: 74999,
    paymentMethod: 'card',
    saleDate: new Date('2024-12-01T10:30:00')
  },
  {
    customerName: 'Priya Sharma',
    customerPhone: '9123456789',
    productName: 'Nike Running Shoes',
    category: 'clothing',
    quantity: 2,
    amount: 8999,
    paymentMethod: 'upi',
    saleDate: new Date('2024-12-02T14:15:00')
  },
  {
    customerName: 'Amit Patel',
    customerPhone: '9988776655',
    productName: 'Dell Laptop',
    category: 'electronics',
    quantity: 1,
    amount: 65000,
    paymentMethod: 'card',
    saleDate: new Date('2024-12-02T16:45:00')
  },
  {
    customerName: 'Sneha Reddy',
    customerPhone: '9445566778',
    productName: 'Organic Rice 10kg',
    category: 'food',
    quantity: 3,
    amount: 1500,
    paymentMethod: 'cash',
    saleDate: new Date('2024-12-03T09:20:00')
  },
  {
    customerName: 'Vikram Singh',
    customerPhone: '9334455667',
    productName: 'Office Chair',
    category: 'furniture',
    quantity: 1,
    amount: 12500,
    paymentMethod: 'upi',
    saleDate: new Date('2024-12-03T11:00:00')
  },
  {
    customerName: 'Anjali Mehta',
    customerPhone: '9223344556',
    productName: 'iPhone 15 Pro',
    category: 'electronics',
    quantity: 1,
    amount: 134900,
    paymentMethod: 'card',
    saleDate: new Date('2024-12-04T13:30:00')
  },
  {
    customerName: 'Rahul Verma',
    customerPhone: '9112233445',
    productName: 'Levi\'s Jeans',
    category: 'clothing',
    quantity: 2,
    amount: 5998,
    paymentMethod: 'cash',
    saleDate: new Date('2024-12-04T15:10:00')
  },
  {
    customerName: 'Kavita Desai',
    customerPhone: '9001122334',
    productName: 'Study Table',
    category: 'furniture',
    quantity: 1,
    amount: 8500,
    paymentMethod: 'upi',
    saleDate: new Date('2024-12-05T10:45:00')
  },
  {
    customerName: 'Suresh Nair',
    customerPhone: '9890011223',
    productName: 'Wireless Headphones',
    category: 'electronics',
    quantity: 1,
    amount: 3499,
    paymentMethod: 'upi',
    saleDate: new Date('2024-12-05T12:20:00')
  },
  {
    customerName: 'Meera Iyer',
    customerPhone: '9778899001',
    productName: 'Basmati Rice 5kg',
    category: 'food',
    quantity: 2,
    amount: 800,
    paymentMethod: 'cash',
    saleDate: new Date('2024-12-05T14:00:00')
  },
  {
    customerName: 'Karthik Rao',
    customerPhone: '9667788990',
    productName: 'Adidas T-Shirt',
    category: 'clothing',
    quantity: 3,
    amount: 4497,
    paymentMethod: 'card',
    saleDate: new Date('2024-12-06T09:30:00')
  },
  {
    customerName: 'Divya Pillai',
    customerPhone: '9556677889',
    productName: 'Bookshelf',
    category: 'furniture',
    quantity: 1,
    amount: 6500,
    paymentMethod: 'upi',
    saleDate: new Date('2024-12-06T11:15:00')
  }
];

async function seedDatabase() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/retail_sales';
    await mongoose.connect(MONGODB_URI);
    
    console.log('Connected to MongoDB');
    
    await Sale.deleteMany({});
    console.log('Cleared existing sales data');
    
    await Sale.insertMany(sampleSales);
    console.log(`Inserted ${sampleSales.length} sample sales records`);
    
    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
