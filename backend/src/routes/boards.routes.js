const express = require("express");
const {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
} = require("../controllers/boards.controller");

const router = express.Router();

router.get("/", getBoards);
router.get("/:id", getBoardById);
router.post("/", createBoard);
router.patch("/:id", updateBoard);

module.exports = router;