const express = require("express");
const {
  getBoards,
  getBoardById,
  createBoard,
} = require("../controllers/boards.controller");

const router = express.Router();

router.get("/", getBoards);
router.get("/:id", getBoardById);
router.post("/", createBoard);

module.exports = router;