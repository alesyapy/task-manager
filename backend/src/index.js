const express = require("express");
const cors = require("cors");
require("dotenv").config();

const usersRoutes = require("./routes/users.routes");
const boardsRoutes = require("./routes/boards.routes");
const columnsRoutes = require("./routes/columns.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/users", usersRoutes);
app.use("/boards", boardsRoutes);
app.use("/columns", columnsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});