const fs = require('fs');

let content = fs.readFileSync('src/components/StockTable.tsx', 'utf-8');

// Ensure TrendingUp, TrendingDown, Minus are imported
if (!content.includes('Minus')) {
  content = content.replace(
    "import { ArrowUpRight, ArrowDownRight } from 'lucide-react';",
    "import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';"
  );
}

// Add helpers
if (!content.includes('getSectorColor')) {
  const helpers = `
const getSectorColor = (sector: string) => {
  const colors = [
    'text-blue-600', 'text-violet-600', 
    'text-amber-600', 'text-cyan-600', 
    'text-fuchsia-600', 'text-orange-600', 'text-teal-600'
  ];
  let hash = 0;
  for (let i = 0; i < sector.length; i++) {
    hash = sector.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getSignalStyles = (signal: string) => {
  const s = signal.toLowerCase();
  if (s.includes('bull')) return { color: 'text-emerald-600', Icon: TrendingUp };
  if (s.includes('bear')) return { color: 'text-rose-600', Icon: TrendingDown };
  return { color: 'text-zinc-500', Icon: Minus };
};
`;
  content = content.replace("interface StockTableProps", helpers + "\ninterface StockTableProps");
}

// Patch Sector Column
content = content.replace(
  '<td className="px-1.5 py-0.5 text-zinc-700">{stock.sector}</td>',
  '<td className={`px-1.5 py-0.5 font-medium ${getSectorColor(stock.sector)}`}>{stock.sector}</td>'
);

// Patch Trend Verdict Column
content = content.replace(
  '<td className="px-1.5 py-0.5 ">\n                    <div className="flex flex-col gap-0.5 text-[9px]">\n                      <span className="text-zinc-900 font-semibold">{stripEmojis(stock.trend_verdict)}</span>\n                      <span className="text-zinc-500">{stripEmojis(stock.adx_label)}</span>\n                    </div>\n                  </td>',
  `<td className="px-1.5 py-0.5 ">
                    <div className="flex flex-col gap-0.5 text-[9px]">
                      <span className={\`font-semibold flex items-center gap-1 \${getSignalStyles(stripEmojis(stock.trend_verdict)).color}\`}>
                        {(() => {
                          const { Icon } = getSignalStyles(stripEmojis(stock.trend_verdict));
                          return <Icon className="w-3 h-3" />;
                        })()}
                        {stripEmojis(stock.trend_verdict)}
                      </span>
                      <span className="text-zinc-500">{stripEmojis(stock.adx_label)}</span>
                    </div>
                  </td>`
);

// Patch MACD Column
content = content.replace(
  '<td className="px-1.5 py-0.5">\n                    <div className="flex flex-col gap-0.5 text-[9px] text-zinc-700">\n                      <span className="font-semibold text-zinc-900 text-[11px]">{stripEmojis(stock.macd_status)}</span>\n                      <span>Hist: {stock.macd_hist.toFixed(2)} | L: {stock.macd.toFixed(2)} | S: {stock.macd_signal.toFixed(2)}</span>\n                    </div>\n                  </td>',
  `<td className="px-1.5 py-0.5">
                    <div className="flex flex-col gap-0.5 text-[9px] text-zinc-700">
                      <span className={\`font-semibold text-[11px] flex items-center gap-1 \${getSignalStyles(stripEmojis(stock.macd_status)).color}\`}>
                        {(() => {
                          const { Icon } = getSignalStyles(stripEmojis(stock.macd_status));
                          return <Icon className="w-3 h-3" />;
                        })()}
                        {stripEmojis(stock.macd_status)}
                      </span>
                      <span>Hist: {stock.macd_hist.toFixed(2)} | L: {stock.macd.toFixed(2)} | S: {stock.macd_signal.toFixed(2)}</span>
                    </div>
                  </td>`
);

fs.writeFileSync('src/components/StockTable.tsx', content);
