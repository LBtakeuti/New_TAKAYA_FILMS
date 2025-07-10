const fs = require('fs');
const path = require('path');

// 置換対象のディレクトリ
const targetDirs = ['app', 'components', 'lib', 'utils'];
const excludeDirs = ['node_modules', '.next', 'public'];
const fileExtensions = ['.ts', '.tsx', '.js', '.jsx'];

// logger.tsファイルは除外
const excludeFiles = ['logger.ts', 'replace-console-logs.js'];

let totalReplacements = 0;

// ディレクトリを再帰的に処理
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        processDirectory(filePath);
      }
    } else if (stat.isFile() && shouldProcessFile(filePath)) {
      processFile(filePath);
    }
  });
}

// ファイルを処理すべきか判定
function shouldProcessFile(filePath) {
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath);
  
  return fileExtensions.includes(ext) && !excludeFiles.includes(fileName);
}

// ファイル内のconsole.logを置換
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let replacements = 0;
  
  // インポート文を追加（まだない場合）
  if (!content.includes("import { logger }") && 
      (content.includes('console.log') || content.includes('console.error') || 
       content.includes('console.warn') || content.includes('console.info'))) {
    
    // 既存のインポートの後に追加
    const importMatch = content.match(/^import .* from .*;$/m);
    if (importMatch) {
      const lastImportIndex = content.lastIndexOf(importMatch[0]) + importMatch[0].length;
      content = content.slice(0, lastImportIndex) + 
                "\nimport { logger } from '@/utils/logger';" + 
                content.slice(lastImportIndex);
    } else {
      // インポートがない場合は先頭に追加
      content = "import { logger } from '@/utils/logger';\n\n" + content;
    }
  }
  
  // console.log → logger.log
  const logPattern = /console\.log\(/g;
  if (logPattern.test(content)) {
    content = content.replace(logPattern, 'logger.log(');
    replacements += content.match(/logger\.log\(/g)?.length || 0;
  }
  
  // console.error → logger.error
  const errorPattern = /console\.error\(/g;
  if (errorPattern.test(content)) {
    content = content.replace(errorPattern, 'logger.error(');
    replacements += content.match(/logger\.error\(/g)?.length || 0;
  }
  
  // console.warn → logger.warn
  const warnPattern = /console\.warn\(/g;
  if (warnPattern.test(content)) {
    content = content.replace(warnPattern, 'logger.warn(');
    replacements += content.match(/logger\.warn\(/g)?.length || 0;
  }
  
  // console.info → logger.info
  const infoPattern = /console\.info\(/g;
  if (infoPattern.test(content)) {
    content = content.replace(infoPattern, 'logger.info(');
    replacements += content.match(/logger\.info\(/g)?.length || 0;
  }
  
  if (replacements > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${filePath}: ${replacements} replacements`);
    totalReplacements += replacements;
  }
}

// メイン処理
console.log('🔍 Replacing console.log with logger...\n');

targetDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    processDirectory(dirPath);
  }
});

console.log(`\n✨ Total replacements: ${totalReplacements}`);
console.log('\n⚠️  Please review the changes and test your application.');
console.log('💡 Tip: Use "git diff" to see all changes.');