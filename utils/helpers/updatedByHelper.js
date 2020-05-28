function updatedByHelper(payload) {
  const { firstName, lastName, documentId, role } = payload;

  const updatedBy = {
    firstName,
    lastName,
    documentId,
    role,
  };

  return updatedBy;
}

module.exports = updatedByHelper;
