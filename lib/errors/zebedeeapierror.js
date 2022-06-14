/**
 * `ZebedeeAPIError` error.
 *
 * @constructor
 * @param {string} [message]
 * @param {number} [code]
 * @access public
 */
function ZebedeeAPIError(message, code) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'ZebedeeAPIError';
  this.message = message;
  this.code = code;
}

// Inherit from `Error`.
ZebedeeAPIError.prototype.__proto__ = Error.prototype;


// Expose constructor.
module.exports = ZebedeeAPIError;
