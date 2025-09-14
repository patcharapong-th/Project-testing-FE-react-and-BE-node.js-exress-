const express = require("express");
const cors = require("cors");
const { connectDb } = require("./config/databasepg");
const errorHandler = require("./middleware/errorHandler.js");

connectDb();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// routes
app.use("/api/user", require("./routes/userRoutes.js"));
app.use("/api/product", require("./routes/productRoutes.js"));
app.use("/api/order", require("./routes/orderRoutes.js"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
