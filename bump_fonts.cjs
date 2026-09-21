const fs = require('fs');

function bumpFonts(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/text-\[11px\]/g, 'text-xs');
  content = content.replace(/text-\[10px\]/g, 'text-[11px]');
  content = content.replace(/text-\[9px\]/g, 'text-[10px]');
  fs.writeFileSync(filePath, content);
}

bumpFonts('src/components/StockTable.tsx');
bumpFonts('src/components/Badge.tsx');
