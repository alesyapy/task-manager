const prisma = require("../lib/prisma");

async function getColumns(req, res) {
  try {
    const columns = await prisma.column.findMany({
      include: {
        cards: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    res.json(columns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch columns" });
  }
}

async function createColumn(req, res) {
  try {
    const { title, boardId, order } = req.body;

    if (!title || !boardId) {
      return res.status(400).json({ error: "title and boardId are required" });
    }

    const column = await prisma.column.create({
      data: {
        title,
        boardId,
        order: order ?? 0,
      },
    });

    res.status(201).json(column);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create column" });
  }
}

async function updateColumn(req, res) {
  try {
    const { id } = req.params;
    const { title, order, boardId } = req.body;

    const updatedColumn = await prisma.column.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(order !== undefined && { order }),
        ...(boardId !== undefined && { boardId }),
      },
      include: {
        cards: true,
      },
    });

    res.json(updatedColumn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update column" });
  }
}

async function deleteColumn(req, res) {
  try {
    const { id } = req.params;

    const column = await prisma.column.findUnique({
      where: { id },
    });

    if (!column) {
      return res.status(404).json({ error: "Column not found" });
    }

    await prisma.column.delete({
      where: { id },
    });

    res.json({ message: "Column deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete column" });
  }
}

module.exports = {
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
};