import mongoose from 'mongoose';

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

const dbConnect = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log('Already connected');
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || '');


    connection.isConnected = db.connections[0].readyState;

    console.log('DB Successfully Connected');
  } catch (err) {
    console.log('Database Connection Failed', err);
    process.exit(1);
  }
};

export default dbConnect;
