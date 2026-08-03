import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    res.json({
      reply: `Backend received: ${message}`,
    });
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

export default router;