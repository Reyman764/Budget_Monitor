// Central place to turn a caught error into an HTTP response.
// Sequelize validation/uniqueness errors are user-caused (bad input,
// duplicate value) so they come back as 400 with a readable message,
// not as a raw 500 with an internal error string.
function sendError(res, err) {
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const message = err.errors?.[0]?.message || 'Invalid input';
    return res.status(400).json({ error: message });
  }

  // Almost always means the request pointed at something that no longer
  // exists (stale session, deleted household, etc.), not a real server
  // fault — surface a plain-language 400 instead of the raw constraint text.
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    console.error(err);
    return res.status(400).json({
      error: 'That request referenced something that no longer exists. Try logging out and back in.'
    });
  }

  console.error(err);
  return res.status(500).json({ error: err.message || 'Something went wrong. Please try again.' });
}

module.exports = { sendError };
