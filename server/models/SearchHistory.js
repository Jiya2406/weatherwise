const mongoose = require("mongoose");

/**
 * Stores one record per successful city weather search.
 */
const searchHistorySchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    condition: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    searchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SearchHistory", searchHistorySchema);
