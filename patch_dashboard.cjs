const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// Imports
content = content.replace(
  "import { RefreshCw, LayoutDashboard, Filter, Lock, LogIn, LogOut } from 'lucide-react';",
  "import { RefreshCw, LayoutDashboard, Filter, Lock, LogIn, LogOut, Sun, Moon } from 'lucide-react';"
);

content = content.replace(
  "import { useAuth } from '../contexts/AuthContext';",
  "import { useAuth } from '../contexts/AuthContext';\nimport { useTheme } from '../contexts/ThemeContext';"
);

content = content.replace(
  "const { user, signInWithGoogle, logout } = useAuth();",
  "const { user, signInWithGoogle, logout } = useAuth();\n  const { theme, toggleTheme } = useTheme();"
);

// Toggle button before Refresh
content = content.replace(
  `<button 
              onClick={fetchDashboardData}`,
  `<button
              onClick={toggleTheme}
              className="w-[26px] h-[26px] flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 rounded-sm border border-zinc-200 dark:border-zinc-800 transition-colors mr-2"
            >
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
            <button 
              onClick={fetchDashboardData}`
);

fs.writeFileSync('src/components/Dashboard.tsx', content);
