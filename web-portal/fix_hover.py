import re

with open("src/app/jobs/page.tsx", "r") as f:
    text = f.read()

# Fix hover:bg-white/[0.025] or hover:bg-white/5, etc. to hover:bg-surface-low
text = re.sub(r'hover:bg-white/\[?[\d\.]+\]?', 'hover:bg-surface-low', text)

# Fix text-[#374151] to text-on-surface-subtle
text = text.replace('text-[#374151]', 'text-on-surface-subtle')

# Fix text-[#4ADE80] to text-success
text = text.replace('text-[#4ADE80]', 'text-success')

# Fix text-[#F87171] to text-danger
text = text.replace('text-[#F87171]', 'text-danger')

# Fix text-[#9CA3AF] to text-on-surface-variant
text = text.replace('text-[#9CA3AF]', 'text-on-surface-variant')

with open("src/app/jobs/page.tsx", "w") as f:
    f.write(text)

with open("src/components/layout/Sidebar.tsx", "r") as f:
    text = f.read()
text = re.sub(r'hover:bg-white/\[?[\d\.]+\]?', 'hover:bg-surface-low', text)
with open("src/components/layout/Sidebar.tsx", "w") as f:
    f.write(text)

