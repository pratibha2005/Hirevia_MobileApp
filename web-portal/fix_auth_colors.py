import re

for fname in ["src/app/login/page.tsx", "src/app/signup/page.tsx"]:
    with open(fname, "r") as f:
        text = f.read()

    # Drop inline backgrounds and use tailwind classes
    text = text.replace('style={{ background: \'#080D1C\' }}', '')
    text = text.replace('className="min-h-screen flex"', 'className="min-h-screen flex bg-background text-on-surface transition-colors duration-300"')
    
    # Text replacements explicitly
    text = text.replace('text-[#D1D5DB]', 'text-on-surface')
    text = text.replace('text-[#E5E7EB]', 'text-on-surface')
    text = text.replace('text-[#9CA3AF]', 'text-on-surface-variant')
    text = text.replace('text-[#4B5563]', 'text-on-surface-subtle')
    text = text.replace('text-[#6B7280]', 'text-on-surface-subtle')
    text = text.replace('text-[#6366F1]', 'text-primary')
    text = text.replace('text-[#F87171]', 'text-danger')
    text = text.replace('text-[#22C55E]', 'text-success')
    text = text.replace('border-[#22C55E]', 'border-success')
    text = text.replace('border-[#4F46E5]', 'border-primary')
    
    text = text.replace('bg-white/5', 'bg-surface-low')
    text = text.replace('border-white/10', 'border-glass-border')
    text = text.replace('border-white/[0.08]', 'border-glass-border')
    text = text.replace('focus:border-white/20', 'focus:border-primary/50')
    text = text.replace('focus:bg-white/[0.07]', 'focus:bg-surface-mid')
    text = text.replace('bg-[#151B2E]', 'bg-surface-base')

    # Gradient replace on left panel
    text = re.sub(
        r'className="hidden lg:flex lg:w-\[45%\] relative flex-col justify-between p-12 overflow-hidden"\s*style={{ background: \'linear-gradient.*?\' }}',
        'className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 overflow-hidden bg-surface-lowest border-r border-glass-border"',
        text
    )

    with open(fname, "w") as f:
        f.write(text)
