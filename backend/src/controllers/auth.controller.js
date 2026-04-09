const prisma = require("../lib/prisma");

async function login(req, res) {
  try {
    const { username } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({ error: "Username is required" });
    }

    let user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { username },
      });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to login" });
  }
}

module.exports = { login };