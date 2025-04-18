const crypto = require('crypto');

function hashIp(ip) {
  const salt = process.env.RATE_LIMIT_SALT || '';
  return crypto.createHash('sha256').update(ip + salt).digest('hex');
}

module.exports = hashIp;