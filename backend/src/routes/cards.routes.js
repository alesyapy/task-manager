const express = require("express");
const {
  getCards,
  createCard,
  updateCard,
  deleteCard,
} = require("../controllers/cards.controller");

const router = express.Router();

router.get("/", getCards);
router.post("/", createCard);
router.patch("/:id", updateCard);
router.delete("/:id", deleteCard);

module.exports = router;