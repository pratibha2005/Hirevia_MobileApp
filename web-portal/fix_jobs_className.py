import re

with open("src/app/jobs/page.tsx", "r") as f:
    text = f.read()

# Fix the duplicate block 112/113
#             className="absolute right-0 top-8 w-40 rounded-xl overflow-hidden z-50 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
#             className="bg-surface-base border border-glass-border"
text = re.sub(
    r'className="([^"]+)"\s*className="bg-surface-base border border-glass-border"',
    r'className="\1 bg-surface-base border border-glass-border"',
    text,
    flags=re.MULTILINE
)

# Replace other duplicate combinations globally:
text = re.sub(r'className="([^"]+)"\s*className="bg-surface-lowest border border-glass-border"', r'className="\1 bg-surface-lowest border border-glass-border"', text)

text = re.sub(r'className="([^"]+)"\s*className="bg-surface-lowest border border-glass-border transition-all duration-200"', r'className="\1 bg-surface-lowest border border-glass-border transition-all duration-200"', text)

text = re.sub(r'className="([^"]+)"\s*className="bg-danger-bg border border-danger/30"', r'className="\1 bg-danger-bg border border-danger/30"', text)

text = re.sub(r'className="([^"]+)"\s*className="border-t border-glass-border bg-surface-lowest/50"', r'className="\1 border-t border-glass-border bg-surface-lowest/50"', text)

with open("src/app/jobs/page.tsx", "w") as f:
    f.write(text)
