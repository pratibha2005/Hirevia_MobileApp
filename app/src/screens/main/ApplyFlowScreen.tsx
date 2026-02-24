import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
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

export default function ApplyFlowScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const job = route.params?.job;

    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [answer, setAnswer] = useState('');

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            Alert.alert(
                "Application Submitted",
                `Your application for ${job?.title} has been sent!`,
                [{ text: "Done", onPress: () => navigation.navigate('Home') }]
            );
        }, 1500);
    };

    if (!job) return null;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="close" size={24} color={THEME.text} />
                </TouchableOpacity>
                <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
                    </View>
                    <Text style={styles.stepText}>Step {step} of 3</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                {step === 1 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Review Profile & Resume</Text>
                        <Text style={styles.stepSubtitle}>We will submit the resume currently attached to your Hirevia profile.</Text>

                        <View style={styles.resumeCard}>
                            <View style={styles.resumeIcon}>
                                <Ionicons name="document-text" size={32} color={THEME.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.resumeName}>Alex_Johnson_Resume_2023.pdf</Text>
                                <Text style={styles.resumeTime}>Updated 2 weeks ago</Text>
                            </View>
                            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                        </View>
                    </View>
                )}

                {step === 2 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Screening Questions</Text>
                        <Text style={styles.stepSubtitle}>The employer requires answers to the following questions.</Text>

                        <View style={styles.questionCard}>
                            <Text style={styles.questionLabel}>QUESTION 1 OF 1</Text>
                            <Text style={styles.questionText}>Why do you want to join {job.company} as a {job.title}?</Text>
                            <TextInput
                                style={styles.inputArea}
                                multiline
                                placeholder="Write your answer here..."
                                placeholderTextColor="#9CA3AF"
                                value={answer}
                                onChangeText={setAnswer}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>
                )}

                {step === 3 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Confirm Application</Text>
                        <Text style={styles.stepSubtitle}>Review your application details before submitting.</Text>

                        <View style={styles.summaryCard}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Role</Text>
                                <Text style={styles.summaryValue}>{job.title}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Company</Text>
                                <Text style={styles.summaryValue}>{job.company}</Text>
                            </View>
                            <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                                <Text style={styles.summaryLabel}>Resume</Text>
                                <Text style={styles.summaryValue}>Alex_Johnson_Resume_2023.pdf</Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.actionButton}
                    activeOpacity={0.8}
                    onPress={handleNext}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color={THEME.primaryForeground} />
                    ) : (
                        <Text style={styles.actionButtonText}>
                            {step < 3 ? "Continue" : "Submit Application"}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, backgroundColor: THEME.surface, borderBottomWidth: 1, borderBottomColor: THEME.border },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
    progressContainer: { flex: 1, alignItems: 'center' },
    progressTrack: { width: '80%', height: 4, backgroundColor: THEME.border, borderRadius: 2, marginBottom: 8, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: THEME.primary, borderRadius: 2 },
    stepText: { fontSize: 13, fontWeight: '600', color: THEME.text },
    content: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
    stepContainer: { flex: 1 },
    stepTitle: { fontSize: 26, fontWeight: '800', color: THEME.text, marginBottom: 8, letterSpacing: -0.5 },
    stepSubtitle: { fontSize: 15, color: THEME.textMuted, marginBottom: 40, lineHeight: 22 },
    resumeCard: { backgroundColor: THEME.surface, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: THEME.primary, shadowColor: THEME.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 3 },
    resumeIcon: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#EDF2F7', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    resumeName: { fontSize: 15, fontWeight: '700', color: THEME.text, marginBottom: 4 },
    resumeTime: { fontSize: 13, color: THEME.textMuted },
    questionCard: { backgroundColor: THEME.surface, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
    questionLabel: { fontSize: 11, fontWeight: '800', color: THEME.primary, letterSpacing: 1, marginBottom: 12 },
    questionText: { fontSize: 17, fontWeight: '600', color: THEME.text, marginBottom: 20, lineHeight: 24 },
    inputArea: { backgroundColor: THEME.background, borderWidth: 1, borderColor: THEME.border, borderRadius: 12, padding: 16, fontSize: 16, color: THEME.text, minHeight: 160 },
    summaryCard: { backgroundColor: THEME.surface, borderRadius: 16, borderWidth: 1, borderColor: THEME.border, overflow: 'hidden' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: THEME.border },
    summaryLabel: { fontSize: 15, color: THEME.textMuted, fontWeight: '500' },
    summaryValue: { fontSize: 15, color: THEME.text, fontWeight: '600' },
    bottomBar: { paddingHorizontal: 24, paddingVertical: 24, backgroundColor: THEME.surface, borderTopWidth: 1, borderTopColor: THEME.border },
    actionButton: { backgroundColor: THEME.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center', shadowColor: THEME.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    actionButtonText: { color: THEME.primaryForeground, fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
});
