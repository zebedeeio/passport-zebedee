/**
 * Parse profile.
 *
 * Parses user profiles as fetched from Zebedee's API.
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */
exports.parse = function (json) {
  if (typeof json === 'string') {
    json = JSON.parse(json);
  }

  const  { data: profile } = json;

  return profile;
};
