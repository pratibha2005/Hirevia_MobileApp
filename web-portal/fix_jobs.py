import re

with open("src/app/jobs/page.tsx", "r") as f:
    text = f.read()

# Replace main tbody background
text = re.sub(
    r'<tbody\s*style=\{\{\s*background:\s*\'rgba\(11,16,32,0\.6\)\'\s*\}\}>',
    '<tbody className="bg-surface-base/60 backdrop-blur-md">',
    text
)

# Replace table row background for generic table rows (if exists)

# There are several places like style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)'...}}
# Let's replace the common border patterns globally:
text = text.replace(
    "style={{ background: '#0E1525', border: '1px solid rgba(255,255,255,0.09)' }}",
    "className=\"bg-surface-base border border-glass-border\""
)

text = text.replace(
    "style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}",
    "className=\"bg-surface-lowest border border-glass-border\""
)

text = text.replace(
    "style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}",
    "className=\"bg-surface-lowest border border-glass-border\""
)

text = text.replace(
    "style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', transition: 'width 0.2s ease, border-color 0.15s' }}",
    "className=\"bg-surface-lowest border border-glass-border transition-all duration-200\""
)

text = text.replace(
    "style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}",
    "className=\"bg-danger-bg border border-danger/30\""
)

text = text.replace(
    "style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}",
    "className=\"bg-surface-lowest border border-glass-border\""
)

text = text.replace(
    "style={{ borderTop: '1px solid rgba(255,255,255,0.055)', background: 'rgba(255,255,255,0.02)' }}",
    "className=\"border-t border-glass-border bg-surface-lowest/50\""
)

# And inline background hover things:
text = text.replace(
    "style={{\n          backgroundColor: isSelected ? 'rgba(99,102,241,0.05)' : 'transparent'\n        }}",
    "style={{ backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent' }}"
)

with open("src/app/jobs/page.tsx", "w") as f:
    f.write(text)
