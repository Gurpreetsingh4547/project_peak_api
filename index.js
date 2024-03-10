import { app } from "./app.js";

// Packages
import { config } from "dotenv";

// Services
import { connectDatabase } from "./config/database.js";

// Configure env
config({ path: "./config/config.env" });

// Connect Database
connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
