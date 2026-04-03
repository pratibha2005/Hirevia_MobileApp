with open("web-portal/src/app/jobs/page.tsx", "r") as f:
    text = f.read()

# Replace hardcoded light/dark text colors with CSS vars
text = text.replace("text-[#E5E7EB]", "text-on-surface")
text = text.replace("text-[#6B7280]", "text-on-surface-variant")
text = text.replace("text-[#4B5563]", "text-on-surface-subtle")
text = text.replace("text-[#6B7480]", "text-on-surface-subtle")
text = text.replace("text-[#C9D1D9]", "text-on-surface")
text = text.replace("text-[#52576B]", "text-on-surface-subtle")
text = text.replace("hover:text-white", "hover:text-primary")

with open("web-portal/src/app/jobs/page.tsx", "w") as f:
    f.write(text)
