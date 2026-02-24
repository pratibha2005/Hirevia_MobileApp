import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const THEME = {
    primary: '#0F4C5C',
    primaryForeground: '#FFFFFF',
    accent: '#E2725B',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#12171A',
    textMuted: '#6B7280',
    border: '#E5E7EB',
};

export default function JobDetailsScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const job = route.params?.job;

    if (!job) {
        return (
            <SafeAreaView style={styles.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={THEME.text} />
                </TouchableOpacity>
                <Text style={styles.errorText}>Job data not found.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Ionicons name="chevron-back" size={24} color={THEME.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="bookmark-outline" size={24} color={THEME.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.logoContainer}>
                    <Image source={{ uri: job.logo }} style={styles.companyLogo} />
                </View>

                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.companyName}>{job.company}</Text>

                <View style={styles.tagsContainer}>
                    <View style={styles.tagBadge}>
                        <Ionicons name="location-outline" size={14} color={THEME.textMuted} />
                        <Text style={styles.tagText}>{job.location}</Text>
                    </View>
                    <View style={styles.tagBadge}>
                        <Ionicons name="cash-outline" size={14} color={THEME.textMuted} />
                        <Text style={styles.tagText}>{job.salary}</Text>
                    </View>
                    <View style={styles.tagBadge}>
                        <Ionicons name="time-outline" size={14} color={THEME.textMuted} />
                        <Text style={styles.tagText}>{job.type}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>About the Role</Text>
                <Text style={styles.paragraph}>
                    As a {job.title} at {job.company}, you will be responsible for building robust and scalable user interfaces. You will work closely with our product and design teams to deliver high-quality experiences to millions of users worldwide.
                </Text>

                <Text style={styles.sectionTitle}>Requirements</Text>
                <View style={styles.bulletList}>
                    {[
                        "5+ years of experience with React/React Native.",
                        "Strong proficiency in TypeScript and modern JavaScript.",
                        "Experience with scalable state management (Redux, Zustand, etc.).",
                        "A keen eye for pixel-perfect design implementation."
                    ].map((item, index) => (
                        <View key={index} style={styles.bulletItem}>
                            <View style={styles.bulletDot} />
                            <Text style={styles.bulletText}>{item}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.applyButton}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('ApplyFlow', { job })}
                >
                    <Text style={styles.applyButtonText}>Apply Now</Text>
                    <Ionicons name="arrow-forward" size={20} color={THEME.primaryForeground} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.background },
    headerBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
    iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: THEME.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
    errorText: { textAlign: 'center', marginTop: 100, color: THEME.textMuted, fontSize: 16 },
    backButton: { position: 'absolute', top: 60, left: 24, zIndex: 10 },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 120, paddingTop: 16 },
    logoContainer: { width: 80, height: 80, borderRadius: 20, backgroundColor: THEME.surface, justifyContent: 'center', alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 4 },
    companyLogo: { width: 48, height: 48, borderRadius: 8 },
    jobTitle: { fontSize: 28, fontWeight: '800', color: THEME.text, marginBottom: 8, letterSpacing: -0.5 },
    companyName: { fontSize: 18, fontWeight: '600', color: THEME.primary, marginBottom: 24 },
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 32 },
    tagBadge: { backgroundColor: THEME.surface, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: THEME.border, flexDirection: 'row', alignItems: 'center', gap: 6 },
    tagText: { fontSize: 13, fontWeight: '600', color: THEME.textMuted },
    divider: { height: 1, backgroundColor: THEME.border, marginBottom: 32 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: THEME.text, marginBottom: 16, letterSpacing: -0.3 },
    paragraph: { fontSize: 15, lineHeight: 24, color: '#4B5563', marginBottom: 32 },
    bulletList: { gap: 14 },
    bulletItem: { flexDirection: 'row', paddingRight: 20 },
    bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: THEME.primary, marginTop: 9, marginRight: 12 },
    bulletText: { fontSize: 15, lineHeight: 24, color: '#4B5563', flex: 1 },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 36, backgroundColor: THEME.surface, borderTopWidth: 1, borderTopColor: THEME.border },
    applyButton: { backgroundColor: THEME.primary, borderRadius: 16, paddingVertical: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, shadowColor: THEME.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 5 },
    applyButtonText: { color: THEME.primaryForeground, fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
});
