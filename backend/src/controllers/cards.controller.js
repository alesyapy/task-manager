const prisma = require("../lib/prisma");

async function getCards(req, res) {
  try {
    const cards = await prisma.card.findMany({
      orderBy: {
        order: "asc",
      },
    });

    res.json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cards" });
  }
}

async function createCard(req, res) {
  try {
    const { title, description, dueDate, order, columnId } = req.body;

    if (!title || !columnId) {
      return res.status(400).json({ error: "title and columnId are required" });
    }

    const card = await prisma.card.create({
      data: {
        title,
        description: description ?? null,
        dueDate: dueDate ? new Date(dueDate) : null,
        order: order ?? 0,
        columnId,
      },
    });

    res.status(201).json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create card" });
  }
}

module.exports = {
  getCards,
  createCard,
};