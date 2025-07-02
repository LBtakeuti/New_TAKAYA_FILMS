// JWT Secret生成スクリプト
// 強力なランダム文字列を生成します

const crypto = require('crypto');

// 64バイトのランダムな文字列を生成
const generateSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

const secret = generateSecret();

console.log('=================================');
console.log('JWT Secret (これをコピーしてください):');
console.log('=================================');
console.log(secret);
console.log('=================================');
console.log('');
console.log('この値を環境変数 JWT_SECRET に設定してください。');
console.log('注意: この値は誰にも共有しないでください！');