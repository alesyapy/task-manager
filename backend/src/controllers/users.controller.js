const prisma = require("../lib/prisma");

async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

async function createUser(req, res) {
  try {
    const { username } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({ error: "Username is required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const user = await prisma.user.create({
      data: { username },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (username !== undefined && !username.trim()) {
      return res.status(400).json({ error: "Username cannot be empty" });
    }

    if (username !== undefined) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id },
        },
      });

      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(username !== undefined && { username }),
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user" });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const boards = await prisma.board.findFirst({
      where: { ownerId: id },
    });

    if (boards) {
      return res.status(400).json({
        error: "Cannot delete user because they have boards",
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete user" });
  }
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};