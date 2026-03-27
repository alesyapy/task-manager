const prisma = require("../lib/prisma");

async function getCards(req, res) {
  try {
    const cards = await prisma.card.findMany({
      orderBy: {
        order: "asc",
      },
      include: {
        images: true,
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
      include: {
        images: true,
      },
    });

    res.status(201).json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create card" });
  }
}

async function updateCard(req, res) {
  try {
    const { id } = req.params;
    const { title, description, dueDate, order, columnId } = req.body;

    const updatedCard = await prisma.card.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(dueDate !== undefined && {
          dueDate: dueDate ? new Date(dueDate) : null,
        }),
        ...(order !== undefined && { order }),
        ...(columnId !== undefined && { columnId }),
      },
      include: {
        images: true,
      },
    });

    res.json(updatedCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update card" });
  }
}

async function deleteCard(req, res) {
  try {
    const { id } = req.params;

    const card = await prisma.card.findUnique({
      where: { id },
    });

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    await prisma.card.delete({
      where: { id },
    });

    res.json({ message: "Card deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete card" });
  }
}

async function uploadCardImages(req, res) {
  try {
    const { id } = req.params;

    const card = await prisma.card.findUnique({
      where: { id },
    });

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const imagesData = files.map((file) => ({
      url: `/uploads/${file.filename}`,
      cardId: id,
    }));

    await prisma.cardImage.createMany({
      data: imagesData,
    });

    const updatedCard = await prisma.card.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    res.status(201).json(updatedCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload images" });
  }
}

module.exports = {
  getCards,
  createCard,
  updateCard,
  deleteCard,
  uploadCardImages,
};