const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('CpvfAdmin2026!', 10);
// Replace $2b$ with $2y$ for PHP compatibility
const phpHash = '$2y$' + hash.substring(4);
console.log('admin:' + phpHash);
