import re

with open('src/screens/main/HomeFeedScreen.tsx', 'r') as f:
    content = f.read()

# Make sure imports are clean
content = re.sub(r"import Animated, \{[^}]+\} from 'react-native-reanimated';", "", content)
content = content.replace("import Animated, { FadeInUp, FadeInRight, FadeIn } from 'react-native-reanimated';", "")
content = content.replace("import { Animated } from 'react-native';", "")
content = content.replace("import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';", "import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Animated } from 'react-native';")

with open('src/screens/main/HomeFeedScreen.tsx', 'w') as f:
    f.write(content)

with open('babel.config.js', 'w') as f:
    f.write('''module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo']
  };
};''')
