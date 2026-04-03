with open('src/screens/main/HomeFeedScreen.tsx', 'r') as f:
    lines = f.readlines()

output = []
seen_react = False
for line in lines:
    if line.strip().startswith("import React,"):
        if not seen_react:
            seen_react = True
            output.append("import React, { useEffect, useRef } from 'react';\n")
    elif line.strip().startswith("import React from"):
        if not seen_react:
            seen_react = True
            output.append("import React, { useEffect, useRef } from 'react';\n")
    else:
        output.append(line)

with open('src/screens/main/HomeFeedScreen.tsx', 'w') as f:
    f.writelines(output)
