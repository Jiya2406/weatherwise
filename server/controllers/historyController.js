const SearchHistory = require("../models/SearchHistory");

/**
 * Saves a search record. Called internally after a successful city lookup,
 * so failures here should never break the weather response — we just log them.
 */
const saveSearch = async (weather) => {
  try {
    await SearchHistory.create({
      city: weather.city,
      country: weather.country,
      temperature: weather.temperature,
      condition: weather.condition,
      icon: weather.icon,
    });
  } catch (error) {
    console.error(`⚠️  Could not save search history: ${error.message}`);
  }
};

/**
 * GET /api/history
 * Returns the most recent searches (newest first, capped at 20).
 */
const getHistory = async (req, res, next) => {
  try {
    const history = await SearchHistory.find()
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, count: history.length, data: history });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/history/:id
 * Deletes a single search history entry.
 */
const deleteHistoryItem = async (req, res, next) => {
  try {
    const deleted = await SearchHistory.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "History item not found." });
    }
    res.json({ success: true, message: "History item deleted." });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/history
 * Clears the entire search history.
 */
const clearHistory = async (req, res, next) => {
  try {
    await SearchHistory.deleteMany({});
    res.json({ success: true, message: "Search history cleared." });
  } catch (error) {
    next(error);
  }
};

module.exports = { saveSearch, getHistory, deleteHistoryItem, clearHistory };
