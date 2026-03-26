const express = require("express");
const {
  getCards,
  createCard,
  updateCard,
} = require("../controllers/cards.controller");

const router = express.Router();

router.get("/", getCards);
router.post("/", createCard);
router.patch("/:id", updateCard);

module.exports = router;