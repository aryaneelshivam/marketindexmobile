import os
import re

replacements = {
    r'\bbg-white\b': 'bg-white dark:bg-zinc-950',
    r'\btext-zinc-900\b': 'text-zinc-900 dark:text-zinc-100',
    r'\btext-zinc-700\b': 'text-zinc-700 dark:text-zinc-300',
    r'\btext-zinc-600\b': 'text-zinc-600 dark:text-zinc-400',
    r'\btext-zinc-500\b': 'text-zinc-500 dark:text-zinc-400',
    r'\btext-zinc-400\b': 'text-zinc-400 dark:text-zinc-500',
    r'\btext-zinc-200\b': 'text-zinc-200 dark:text-zinc-700',
    r'\bborder-zinc-200\b': 'border-zinc-200 dark:border-zinc-800',
    r'\bborder-zinc-100\b': 'border-zinc-100 dark:border-zinc-800/50',
    r'\bdivide-zinc-100\b': 'divide-zinc-100 dark:divide-zinc-800/50',
    r'\bbg-zinc-50\b': 'bg-zinc-50 dark:bg-zinc-900',
    r'\bbg-zinc-100\b': 'bg-zinc-100 dark:bg-zinc-800',
    r'\bhover:bg-zinc-50\b': 'hover:bg-zinc-50 dark:hover:bg-zinc-800',
    r'\bhover:bg-zinc-100\b': 'hover:bg-zinc-100 dark:hover:bg-zinc-800',
    r'\bhover:bg-zinc-200\b': 'hover:bg-zinc-200 dark:hover:bg-zinc-700',
    r'\bhover:text-black\b': 'hover:text-black dark:hover:text-white',
    r'\btext-black\b': 'text-black dark:text-white',
    r'\bgroup-hover:text-black\b': 'group-hover:text-black dark:group-hover:text-white',
    r'\bgroup-hover:bg-zinc-50\b': 'group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800/50',
    r'\bbg-zinc-900 text-white border-zinc-900\b': 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100',
    r'\bfrom-white\b': 'from-white dark:from-zinc-950',
    r'\bvia-white/80\b': 'via-white/80 dark:via-zinc-950/80',
    r'\bvia-white\b': 'via-white dark:via-zinc-950'
}

# Fix duplicate application issues
def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    for pattern, replacement in replacements.items():
        # Only replace if the dark version isn't already there
        # e.g., for bg-white, if the next word is dark:bg-zinc-950, ignore
        def replace_func(match):
            m = match.group(0)
            return replacement

        content = re.sub(pattern + r'(?!\s*dark:)', replace_func, content)

    with open(filepath, 'w') as f:
        f.write(content)

for root, _, files in os.walk('src/components'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
