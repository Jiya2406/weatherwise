const express = require("express");
const router = express.Router();
const {
  getHistory,
  deleteHistoryItem,
  clearHistory,
} = require("../controllers/historyController");

// GET    /api/history        -> recent searches
router.get("/", getHistory);

// DELETE /api/history        -> clear all
router.delete("/", clearHistory);

// DELETE /api/history/:id     -> delete one
router.delete("/:id", deleteHistoryItem);

module.exports = router;
