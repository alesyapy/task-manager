const prisma = require("../lib/prisma");
const { isValidDate } = require("../lib/validators");
const { deleteImageFiles } = require("../lib/fileCleanup");

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

    if (!title || !title.trim()|| !columnId) {
      return res.status(400).json({ error: "title and columnId are required" });
    }

    const column = await prisma.column.findUnique({
      where: { id: columnId },
    });

    if (!column) {
      return res.status(404).json({ error: "Column not found" });
    }

    if (dueDate !== undefined && dueDate !== null && !isValidDate(dueDate)) {
      return res.status(400).json({ error: "Invalid dueDate" });
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

    const card = await prisma.card.findUnique({
      where: { id },
    });

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    if (columnId !== undefined) {
      const column = await prisma.column.findUnique({
        where: { id: columnId },
      });

      if (!column) {
        return res.status(404).json({ error: "Column not found" });
      }
    }

    if (dueDate !== undefined && dueDate !== null && !isValidDate(dueDate)) {
      return res.status(400).json({ error: "Invalid dueDate" });
    }

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ error: "Title cannot be empty" });
    }

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
      include: {
        images: true,
      },
    });

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    deleteImageFiles(card.images);

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

async function deleteCardImage(req, res) {
  try {
    const { imageId } = req.params;

    const image = await prisma.cardImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    deleteImageFiles([image]); 

    await prisma.cardImage.delete({
      where: { id: imageId },
    });

    res.json({ message: "Image deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete image" });
  }
}

module.exports = {
  getCards,
  createCard,
  updateCard,
  deleteCard,
  uploadCardImages,
  deleteCardImage,
};