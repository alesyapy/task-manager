const prisma = require("../lib/prisma");

async function getBoards(req, res) {
  try {
    const boards = await prisma.board.findMany({
      include: {
        owner: true
      }
    });

    res.json(boards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
}

async function createBoard(req, res) {
  try {
    const { title, ownerId } = req.body;

    if (!title || !ownerId) {
      return res.status(400).json({
        error: "title and ownerId are required"
      });
    }

    const board = await prisma.board.create({
      data: {
        title,
        ownerId
      }
    });

    res.status(201).json(board);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create board" });
  }
}

module.exports = {
  getBoards,
  createBoard
};