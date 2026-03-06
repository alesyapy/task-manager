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

module.exports = {
  getColumns,
  createColumn,
};