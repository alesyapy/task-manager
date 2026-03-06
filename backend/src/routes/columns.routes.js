const express = require("express");
const {
  getColumns,
  createColumn,
} = require("../controllers/columns.controller");

const router = express.Router();

router.get("/", getColumns);
router.post("/", createColumn);

module.exports = router;