import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
                <View style={styles.headerBar}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                        <Ionicons name="chevron-back" size={24} color={THEME.text} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.errorText}>Job data not found.</Text>
            </SafeAreaView>
        );
    }

    const skills: string[] = job.tags || job.skills || [];
    const questions: string[] = job.screeningQuestions || [];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Ionicons name="chevron-back" size={24} color={THEME.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{job.title}</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Company Avatar */}
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>{(job.company || 'C').charAt(0)}</Text>
                </View>

                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.companyName}>{job.company}</Text>

                <View style={styles.tagsContainer}>
                    <View style={styles.tagBadge}>
                        <Ionicons name="location-outline" size={14} color={THEME.textMuted} />
                        <Text style={styles.tagText}>{job.location}</Text>
                    </View>
                    {job.salary ? (
                        <View style={styles.tagBadge}>
                            <Ionicons name="cash-outline" size={14} color={THEME.textMuted} />
                            <Text style={styles.tagText}>{job.salary}</Text>
                        </View>
                    ) : null}
                    {job.type ? (
                        <View style={styles.tagBadge}>
                            <Ionicons name="time-outline" size={14} color={THEME.textMuted} />
                            <Text style={styles.tagText}>{job.type}</Text>
                        </View>
                    ) : null}
                </View>

                {skills.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Skills Required</Text>
                        <View style={styles.skillsContainer}>
                            {skills.map((s: string, i: number) => (
                                <View key={i} style={styles.skillBadge}>
                                    <Text style={styles.skillText}>{s}</Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>About the Role</Text>
                <Text style={styles.paragraph}>
                    {job.description || `As a ${job.title} at ${job.company}, you will be responsible for delivering high-quality work that has real impact on the business and its users.`}
                </Text>

                {questions.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Screening Questions</Text>
                        <View style={styles.questionsBox}>
                            {questions.map((q: string, i: number) => (
                                <View key={i} style={styles.questionRow}>
                                    <Text style={styles.questionNum}>{i + 1}.</Text>
                                    <Text style={styles.questionText}>{q}</Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}
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
    headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
    headerTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: THEME.text, marginHorizontal: 8 },
    iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: THEME.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: THEME.border },
    errorText: { textAlign: 'center', marginTop: 100, color: THEME.textMuted, fontSize: 16 },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 120, paddingTop: 16 },
    logoContainer: { width: 80, height: 80, borderRadius: 20, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    logoText: { color: '#fff', fontSize: 32, fontWeight: '800' },
    jobTitle: { fontSize: 28, fontWeight: '800', color: THEME.text, marginBottom: 8, letterSpacing: -0.5 },
    companyName: { fontSize: 18, fontWeight: '600', color: THEME.primary, marginBottom: 24 },
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
    tagBadge: { backgroundColor: THEME.surface, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: THEME.border, flexDirection: 'row', alignItems: 'center', gap: 6 },
    tagText: { fontSize: 13, fontWeight: '600', color: THEME.textMuted },
    skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
    skillBadge: { backgroundColor: '#E8F4F2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#A8D5CE' },
    skillText: { fontSize: 13, fontWeight: '600', color: THEME.primary },
    divider: { height: 1, backgroundColor: THEME.border, marginBottom: 32 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: THEME.text, marginBottom: 16, letterSpacing: -0.3 },
    paragraph: { fontSize: 15, lineHeight: 24, color: '#4B5563', marginBottom: 32 },
    questionsBox: { backgroundColor: THEME.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: THEME.border, gap: 12, marginBottom: 32 },
    questionRow: { flexDirection: 'row', gap: 8 },
    questionNum: { fontSize: 14, fontWeight: '700', color: THEME.primary, marginTop: 1 },
    questionText: { flex: 1, fontSize: 14, lineHeight: 22, color: THEME.text },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: THEME.background, borderTopWidth: 1, borderTopColor: THEME.border },
    applyButton: { backgroundColor: THEME.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16, gap: 8 },
    applyButtonText: { color: THEME.primaryForeground, fontSize: 16, fontWeight: '700' },
});
