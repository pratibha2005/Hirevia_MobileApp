import re

with open('src/screens/main/HomeFeedScreen.tsx', 'r') as f:
    content = f.read()

# remove reanimated import
content = re.sub(r"import Animated, \{[^}]+\} from 'react-native-reanimated';", "import { Animated, useEffect, useRef } from 'react';", content)
content = content.replace("import { Animated, useEffect, useRef } from 'react';", "import React, { useEffect, useRef } from 'react';\nimport { Animated } from 'react-native';")

# Fix existing React import
content = content.replace("import React from 'react';\nimport React, { useEffect, useRef } from 'react';", "import React, { useEffect, useRef } from 'react';")
# just in case:
content = content.replace("import React from 'react';\n", "")
content = "import React, { useEffect, useRef } from 'react';\n" + content

# Replace Animated.createAnimatedComponent
# already there but let's make sure BlurView is animated component
content = content.replace("const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);", "const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);\n\nconst FadeInView = ({ children, delay, style }: any) => {\n  const opacity = useRef(new Animated.Value(0)).current;\n  const translateY = useRef(new Animated.Value(20)).current;\n  useEffect(() => {\n    Animated.sequence([\n      Animated.delay(delay),\n      Animated.parallel([\n        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),\n        Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),\n      ])\n    ]).start();\n  }, []);\n  return <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>{children}</Animated.View>;\n};\n")

# Replace Animated.View entering={...} with FadeInView
content = re.sub(r"<Animated\.View entering=\{FadeInUp\.delay\(([0-9]+)\)\.duration\([0-9]+\)\}", r"<FadeInView delay={\1}", content)
content = re.sub(r"<Animated\.View entering=\{FadeInRight\.delay\(([0-9]+)\)\.duration\([0-9]+\)\}", r"<FadeInView delay={\1}", content)

# Change closing tags
content = content.replace("</Animated.View>", "</FadeInView>")

with open('src/screens/main/HomeFeedScreen.tsx', 'w') as f:
    f.write(content)

