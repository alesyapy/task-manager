const express = require("express");
const {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
} = require("../controllers/boards.controller");

const router = express.Router();

router.get("/", getBoards);
router.get("/:id", getBoardById);
router.post("/", createBoard);
router.patch("/:id", updateBoard);
router.delete("/:id", deleteBoard);

module.exports = router;