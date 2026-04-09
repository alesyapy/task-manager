const prisma = require("../lib/prisma");
const { deleteImageFiles } = require("../lib/fileCleanup");

async function getBoards(req, res) {
  try {
    const boards = await prisma.board.findMany();
    res.json(boards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
}

async function getBoardById(req, res) {
  try {
    const { id } = req.params;

    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        columns: {
          orderBy: { order: "asc" },
          include: {
            cards: {
              orderBy: { order: "asc" },
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    res.json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch board" });
  }
}

async function createBoard(req, res) {
  try {
    let { title, ownerId } = req.body;

    if (!title || !title.trim() || !ownerId) {
      return res.status(400).json({ error: "title and ownerId are required" });
    }

    title = title.trim();

    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const board = await prisma.board.create({
      data: {
        title,
        ownerId,
      },
    });

    res.status(201).json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create board" });
  }
}

async function updateBoard(req, res) {
  try {
    const { id } = req.params;
    let { title, ownerId } = req.body;

    const board = await prisma.board.findUnique({
      where: { id },
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    if (ownerId !== undefined) {
      const owner = await prisma.user.findUnique({
        where: { id: ownerId },
      });

      if (!owner) {
        return res.status(404).json({ error: "Owner not found" });
      }
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ error: "Title cannot be empty" });
      }

      title = title.trim();
    }

    const updatedBoard = await prisma.board.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(ownerId !== undefined && { ownerId }),
      },
    });

    res.json(updatedBoard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update board" });
  }
}

async function deleteBoard(req, res) {
  try {
    const { id } = req.params;

    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        columns: {
          include: {
            cards: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    for (const column of board.columns) {
      for (const card of column.cards) {
        deleteImageFiles(card.images);
      }
    }

    await prisma.board.delete({
      where: { id },
    });

    res.json({ message: "Board deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete board" });
  }
}

module.exports = {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
};