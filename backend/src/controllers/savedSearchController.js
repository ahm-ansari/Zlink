const SavedSearch = require("../models/SavedSearch");
const { serializeDoc, serializeList } = require("../utils/serialize");

async function listSavedSearches(_req, res) {
  const savedSearches = await SavedSearch.find({ deletedAt: null }).sort({ updatedAt: -1 });
  res.json({ savedSearches: serializeList(savedSearches) });
}

async function createSavedSearch(req, res) {
  const savedSearch = await SavedSearch.create(req.body);
  res.status(201).json({ savedSearch: serializeDoc(savedSearch) });
}

async function updateSavedSearch(req, res) {
  const savedSearch = await SavedSearch.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!savedSearch) return res.status(404).json({ error: "Saved search not found" });
  return res.json({ savedSearch: serializeDoc(savedSearch) });
}

module.exports = {
  listSavedSearches,
  createSavedSearch,
  updateSavedSearch
};
