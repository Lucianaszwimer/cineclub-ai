import mongoose from 'mongoose';

export const connectToDB = async (uri: string) => {
  try {
    const dbName = "cineclub";
    await mongoose.connect(uri, { dbName });
    
    console.log("✅ Conectado a MongoDB");
    console.log("Base de datos actual:", mongoose.connection.db?.databaseName);
    
    return mongoose.connection;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(`❌ Error conectando a MongoDB: ${err.message}`);
    if (process.env.NODE_ENV !== "test") {
      process.exit(1); 
    }
    throw err; 
  }
};