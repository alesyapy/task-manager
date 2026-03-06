const express = require("express");
const {
  getCards,
  createCard,
} = require("../controllers/cards.controller");

const router = express.Router();

router.get("/", getCards);
router.post("/", createCard);

module.exports = router;