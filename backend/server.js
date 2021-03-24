import express from 'express';
import dotenv from 'dotenv';
import connectDB from './Config/db.js'
import colors from 'colors'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { notFound, errorHandler } from './middleware/errorMW.js'

dotenv.config()
connectDB();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API IS RUNNING');
});

app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);

app.use(notFound);
app.use(errorHandler);



const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
