function serializeDoc(doc) {
  if (!doc) return null;
  const data = doc.toObject ? doc.toObject() : doc;
  const serialized = { ...data, id: String(data._id || data.id) };
  delete serialized._id;
  delete serialized.__v;
  return serialized;
}

function serializeList(docs) {
  return docs.map(serializeDoc);
}

module.exports = {
  serializeDoc,
  serializeList
};
