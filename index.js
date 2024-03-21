import { app } from "./app.js";

// Services
import { connectDatabase } from "./config/database.js";

// Connect Database
connectDatabase();

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
