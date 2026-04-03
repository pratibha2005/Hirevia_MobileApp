with open('src/screens/main/HomeFeedScreen.tsx', 'r') as f:
    content = f.read()

# Looks like `<Animated.View entering=...>` is still there because of regex miss earlier!
import re

content = re.sub(r"<Animated\.View([^>]*entering=[^>]*)>", r"<FadeInView\1>", content)
content = content.replace("entering={FadeInUp.delay(", "delay={")
content = content.replace("entering={FadeInRight.delay(", "delay={")
content = re.sub(r"\)\.duration\([0-9]+\)\}", "}", content)

with open('src/screens/main/HomeFeedScreen.tsx', 'w') as f:
    f.write(content)
