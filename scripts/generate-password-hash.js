const bcrypt = require('bcryptjs');

// コマンドライン引数からパスワードを取得
const password = process.argv[2];

if (!password) {
  console.error('使用方法: node scripts/generate-password-hash.js <パスワード>');
  process.exit(1);
}

// パスワードをハッシュ化
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('ハッシュ生成エラー:', err);
    process.exit(1);
  }
  
  console.log('パスワードハッシュ:');
  console.log(hash);
  console.log('\n.env.localファイルに以下を追加してください:');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
});