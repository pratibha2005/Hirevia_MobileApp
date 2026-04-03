import re

toggle_code = '''
import { ThemeToggleAuth } from '@/components/auth/ThemeToggleAuth';
'''

for fname in ["src/app/login/page.tsx", "src/app/signup/page.tsx"]:
    with open(fname, "r") as f:
        text = f.read()

    # Add import
    if "ThemeToggleAuth" not in text:
        text = text.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport { ThemeToggleAuth } from '@/components/auth/ThemeToggleAuth';")

    # Insert toggle in Right Panel
    if "<ThemeToggleAuth />" not in text:
        text = text.replace(
            '{/* Right panel \u2014 form */}',
            '{/* Right panel \u2014 form */}\n      <ThemeToggleAuth />'
        )

    with open(fname, "w") as f:
        f.write(text)
