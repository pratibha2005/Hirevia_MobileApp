import re

with open("src/context/ThemeContext.tsx", "r") as f:
    text = f.read()

text = text.replace(
    'if (theme === null) return <div style={{ visibility: "hidden" }}>{children}</div>;',
    'if (theme === null) return <ThemeContext.Provider value={{ theme: "dark", toggleTheme: () => {} }}><div style={{ visibility: "hidden" }}>{children}</div></ThemeContext.Provider>;'
)

with open("src/context/ThemeContext.tsx", "w") as f:
    f.write(text)
