const express = require("express");
const {
  getColumns,
  createColumn,
  updateColumn,
} = require("../controllers/columns.controller");

const router = express.Router();

router.get("/", getColumns);
router.post("/", createColumn);
router.patch("/:id", updateColumn);

module.exports = router;