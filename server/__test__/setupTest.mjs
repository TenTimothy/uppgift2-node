
import { beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { connectDb } from '../config/mongo.mjs';


beforeAll(async () => {
    await connectDb(); 
});


afterAll(async () => {
    await mongoose.connection.close(); 
});
