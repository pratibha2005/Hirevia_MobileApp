import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const THEME = {
    primary: '#0F4C5C',
    primaryForeground: '#FFFFFF',
    accent: '#B7725D',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: '#1A202C',
    textMuted: '#6B7280',
    border: '#E2E8F0',
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
                    {job.noticePeriod ? (
                        <View style={styles.tagBadge}>
                            <Ionicons name="calendar-outline" size={14} color={THEME.textMuted} />
                            <Text style={styles.tagText}>{job.noticePeriod} Notice</Text>
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

                {(job.currentCTCRequired || job.relocationRequired) && (
                    <>
                        <Text style={styles.sectionTitle}>Key Requirements</Text>
                        <View style={styles.skillsContainer}>
                            {job.currentCTCRequired && (
                                <View style={[styles.skillBadge, { backgroundColor: '#FFF4ED', borderColor: '#FFDDC2' }]}>
                                    <Text style={[styles.skillText, { color: '#C25A00' }]}>Current CTC Required</Text>
                                </View>
                            )}
                            {job.relocationRequired && (
                                <View style={[styles.skillBadge, { backgroundColor: '#F3E8FF', borderColor: '#E8CAFF' }]}>
                                    <Text style={[styles.skillText, { color: '#7E22CE' }]}>Relocation Required</Text>
                                </View>
                            )}
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
    headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
    headerTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: THEME.text, marginHorizontal: 8 },
    iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: THEME.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: THEME.border },
    errorText: { textAlign: 'center', marginTop: 100, color: THEME.textMuted, fontSize: 16 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 120, paddingTop: 12 },
    logoContainer: { width: 70, height: 70, borderRadius: 16, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    logoText: { color: '#fff', fontSize: 28, fontWeight: '800' },
    jobTitle: { fontSize: 26, fontWeight: '800', color: THEME.text, marginBottom: 6, letterSpacing: -0.4 },
    companyName: { fontSize: 17, fontWeight: '600', color: THEME.primary, marginBottom: 20 },
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
    tagBadge: { backgroundColor: THEME.surface, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8, borderWidth: 1, borderColor: THEME.border, flexDirection: 'row', alignItems: 'center', gap: 5 },
    tagText: { fontSize: 12, fontWeight: '600', color: THEME.textMuted },
    skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 20 },
    skillBadge: { backgroundColor: 'rgba(15, 76, 92, 0.08)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 7, borderWidth: 1, borderColor: 'rgba(15, 76, 92, 0.15)' },
    skillText: { fontSize: 12, fontWeight: '600', color: THEME.primary },
    divider: { height: 1, backgroundColor: THEME.border, marginBottom: 28 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: THEME.text, marginBottom: 14, letterSpacing: -0.2 },
    paragraph: { fontSize: 15, lineHeight: 23, color: '#4B5563', marginBottom: 28 },
    questionsBox: { backgroundColor: THEME.surface, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: THEME.border, gap: 10, marginBottom: 28 },
    questionRow: { flexDirection: 'row', gap: 7 },
    questionNum: { fontSize: 14, fontWeight: '700', color: THEME.primary, marginTop: 1 },
    questionText: { flex: 1, fontSize: 14, lineHeight: 21, color: THEME.text },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 18, backgroundColor: THEME.background, borderTopWidth: 1, borderTopColor: THEME.border },
    applyButton: { backgroundColor: THEME.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, gap: 7 },
    applyButtonText: { color: THEME.primaryForeground, fontSize: 16, fontWeight: '700' },
});
