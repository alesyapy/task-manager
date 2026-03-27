const express = require("express");
const upload = require("../lib/upload");
const {
  getCards,
  createCard,
  updateCard,
  deleteCard,
  uploadCardImages,
} = require("../controllers/cards.controller");

const router = express.Router();

router.get("/", getCards);
router.post("/", createCard);
router.patch("/:id", updateCard);
router.delete("/:id", deleteCard);
router.post("/:id/images", upload.array("images"), uploadCardImages);

module.exports = router;