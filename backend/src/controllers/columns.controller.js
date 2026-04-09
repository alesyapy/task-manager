const prisma = require("../lib/prisma");
const { deleteImageFiles } = require("../lib/fileCleanup");

async function getColumns(req, res) {
  try {
    const columns = await prisma.column.findMany({
      include: {
        cards: {
          orderBy: {
            order: "asc",
          },
          include: {
            images: true,
          },
        },
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
    let { title, boardId, order } = req.body;

    if (!title || !title.trim() || !boardId) {
      return res.status(400).json({ error: "title and boardId are required" });
    }

    title = title.trim();

    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
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
    let { title, order, boardId } = req.body;


    const column = await prisma.column.findUnique({
      where: { id },
    });

    if (!column) {
      return res.status(404).json({ error: "Column not found" });
    }

    if (boardId !== undefined) {
      const board = await prisma.board.findUnique({
        where: { id: boardId },
      });

      if (!board) {
        return res.status(404).json({ error: "Board not found" });
      }
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ error: "Title cannot be empty" });
      }

      title = title.trim();
    }

    const updatedColumn = await prisma.column.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(order !== undefined && { order }),
        ...(boardId !== undefined && { boardId }),
      },
      include: {
        cards: {
          orderBy: {
            order: "asc",
          },
          include: {
            images: true,
          },
        },
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
      include: {
        cards: {
          include: {
            images: true,
          },
        },
      },
    });

    if (!column) {
      return res.status(404).json({ error: "Column not found" });
    }

    for (const card of column.cards) {
      deleteImageFiles(card.images);
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