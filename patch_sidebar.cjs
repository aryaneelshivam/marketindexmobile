const fs = require('fs');

let content = fs.readFileSync('src/components/FundamentalsSidebar.tsx', 'utf-8');

if (!content.includes('stripEmojis')) {
  content = content.replace(
    "import { X, ExternalLink",
    "const stripEmojis = (str: string) => str ? str.replace(/[\\u{1F300}-\\u{1F9FF}]|[\\u{2600}-\\u{26FF}]|[\\u{2700}-\\u{27BF}]|\\u{FE0F}/gu, '').trim() : '';\nimport { X, ExternalLink"
  );
  
  content = content.replace(
    "{data.analyst_targets?.recommendation || 'N/A'}",
    "{data.analyst_targets?.recommendation ? stripEmojis(data.analyst_targets.recommendation) : 'N/A'}"
  );
  
  fs.writeFileSync('src/components/FundamentalsSidebar.tsx', content);
}
