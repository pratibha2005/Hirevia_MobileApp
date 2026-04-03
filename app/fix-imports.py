import re

with open('src/screens/main/HomeFeedScreen.tsx', 'r') as f:
    content = f.read()

# Add missing Image import if accidentally removed
if "import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';" not in content:
    content = content.replace("import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';", "import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';")

with open('src/screens/main/HomeFeedScreen.tsx', 'w') as f:
    f.write(content)
