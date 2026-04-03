import re

with open("src/app/jobs/page.tsx", "r") as f:
    text = f.read()

text = text.replace("bg-[#0B1020]/95", "bg-surface-base/95 backdrop-blur-md")
text = text.replace("bg: 'rgba(255,255,255,0.05)'", "bg: 'var(--surface-lowest)'")
text = text.replace("border: 'rgba(255,255,255,0.1)'", "border: 'var(--glass-border)'")
text = text.replace("borderColor: 'rgba(255,255,255,0.055)'", "borderColor: 'var(--glass-border)'")
text = text.replace("border: '1px solid rgba(255,255,255,0.07)'", "border: '1px solid var(--glass-border)'")
text = text.replace("borderBottom: '1px solid rgba(255,255,255,0.1)'", "borderBottom: '1px solid var(--glass-border)'")
text = text.replace("borderBottom: '1px solid rgba(255,255,255,0.07)'", "borderBottom: '1px solid var(--glass-border)'")
text = text.replace("e.target.style.borderColor = 'rgba(255,255,255,0.07)'", "e.target.style.borderColor = 'var(--glass-border)'")

with open("src/app/jobs/page.tsx", "w") as f:
    f.write(text)
