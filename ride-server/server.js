import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import app from './app.js';

dotenv.config({
    path: './config.env',
})

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('[SERVER] DB connection successful!');

    const server = http.createServer(app);

    server.listen(process.env.PORT, () => {
        console.log(`[SERVER] App running on port ${process.env.PORT}...`);
    });
})
.catch((err)=>
{
    console.error('[SERVER] DB connection failed:', err);
    process.exit(1);
})
