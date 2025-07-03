const crypto = require('crypto');

// Generate a secure random JWT secret
const secret = crypto.randomBytes(64).toString('hex');

console.log('Generated JWT Secret:');
console.log(secret);
console.log('\nAdd this to your .env.local file:');
console.log(`JWT_SECRET=${secret}`);