const prisma = require("../lib/prisma");

async function getBoards(req, res) {
  try {
    const boards = await prisma.board.findMany({
      include: {
        owner: true,
      },
    });

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
          orderBy: {
            order: "asc",
          },
          include: {
            cards: {
              orderBy: {
                order: "asc",
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
    const { title, ownerId } = req.body;

    if (!title || !ownerId) {
      return res.status(400).json({
        error: "title and ownerId are required",
      });
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

module.exports = {
  getBoards,
  getBoardById,
  createBoard,
};