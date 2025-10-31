import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import app from './app.js';
import { createAdminIfMissing } from './services/admin.service.js';
dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    await createAdminIfMissing();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('Startup error', err);
    process.exit(1);
  }
})();
