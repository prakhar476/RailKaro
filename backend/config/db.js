const mongoose = require('mongoose');

const connectDB = async (retries = 5, delay = 3000) => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('\n❌  MONGO_URI is not set in your .env file!');
    console.error('    Copy backend/.env.example to backend/.env and fill in your MongoDB URI.\n');
    process.exit(1);
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });
      console.log('\n✅  MongoDB connected to: ' + conn.connection.host);
      return;
    } catch (error) {
      console.error('\n⚠️   MongoDB attempt ' + attempt + '/' + retries + ' failed: ' + error.message);

      if (error.message.includes('ECONNREFUSED')) {
        console.error('    Make sure MongoDB is running:');
        console.error('      Windows : net start MongoDB  (or mongod.exe)');
        console.error('      macOS   : brew services start mongodb-community');
        console.error('      Linux   : sudo systemctl start mongod');
        console.error('    Or use a free Atlas URI at https://mongodb.com/atlas\n');
      }

      if (attempt === retries) {
        console.error('\n❌  Could not connect to MongoDB. Exiting.\n');
        process.exit(1);
      }

      console.log('    Retrying in ' + (delay / 1000) + 's...\n');
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

module.exports = connectDB;
