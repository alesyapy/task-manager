const express = require("express");
const {
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
} = require("../controllers/columns.controller");

const router = express.Router();

router.get("/", getColumns);
router.post("/", createColumn);
router.patch("/:id", updateColumn);
router.delete("/:id", deleteColumn);

module.exports = router;