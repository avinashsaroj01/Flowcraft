const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const flowchartRoutes = require("./routes/flowchartRoutes");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Flowchart API",
      version: "1.0.0",
      description: "API for managing flowcharts",
    },
  },
  apis: ["./routes/flowchartRoutes.js"]

};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  res.send("API is working!");
});

app.use("/api/flowcharts", flowchartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
