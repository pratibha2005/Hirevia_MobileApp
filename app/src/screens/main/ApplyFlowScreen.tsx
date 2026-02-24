import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../api/config';

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

    const questions: string[] = job?.screeningQuestions || [];
    const totalSteps = questions.length > 0 ? 3 : 2; // step 1: resume, step 2 (if questions): answers, final: confirm

    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [answers, setAnswers] = useState<string[]>(questions.map(() => ''));

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else navigation.goBack();
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'You must be logged in to apply.');
                setSubmitting(false);
                return;
            }

            const screeningAnswers = questions.map((q, i) => ({
                question: q,
                answer: answers[i] || '',
            }));

            const res = await fetch(`${API_BASE_URL}/api/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ jobId: job.id, screeningAnswers }),
            });

            const data = await res.json();

            if (!res.ok) {
                Alert.alert('Error', data.message || 'Failed to submit application.');
            } else {
                Alert.alert(
                    '🎉 Application Submitted!',
                    `Your application for ${job?.title} has been sent to the hiring team.`,
                    [{ text: 'Done', onPress: () => navigation.navigate('Main') }]
                );
            }
        } catch {
            Alert.alert('Error', 'Could not reach the server. Check your connection.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!job) return null;

    const isAnswerStep = totalSteps === 3 && step === 2;
    const isConfirmStep = step === totalSteps;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name={step === 1 ? 'close' : 'arrow-back'} size={24} color={THEME.text} />
                </TouchableOpacity>
                <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${(step / totalSteps) * 100}%` }]} />
                    </View>
                    <Text style={styles.stepText}>Step {step} of {totalSteps}</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

                {step === 1 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Review Your Profile</Text>
                        <Text style={styles.stepSubtitle}>
                            You're applying for <Text style={{ color: THEME.primary, fontWeight: '700' }}>{job.title}</Text> at {job.company}.
                        </Text>
                        <View style={styles.resumeCard}>
                            <View style={styles.resumeIcon}>
                                <Ionicons name="document-text" size={32} color={THEME.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.resumeName}>Profile Resume</Text>
                                <Text style={styles.resumeTime}>Your profile will be shared with the recruiter</Text>
                            </View>
                            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                        </View>
                    </View>
                )}

                {isAnswerStep && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Screening Questions</Text>
                        <Text style={styles.stepSubtitle}>The employer requires answers to these questions.</Text>
                        {questions.map((q, i) => (
                            <View key={i} style={styles.questionCard}>
                                <Text style={styles.questionLabel}>QUESTION {i + 1} OF {questions.length}</Text>
                                <Text style={styles.questionText}>{q}</Text>
                                <TextInput
                                    style={styles.inputArea}
                                    multiline
                                    placeholder="Write your answer here..."
                                    placeholderTextColor="#9CA3AF"
                                    value={answers[i]}
                                    onChangeText={(t) => {
                                        const newA = [...answers];
                                        newA[i] = t;
                                        setAnswers(newA);
                                    }}
                                    textAlignVertical="top"
                                />
                            </View>
                        ))}
                    </View>
                )}

                {isConfirmStep && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Confirm & Submit</Text>
                        <Text style={styles.stepSubtitle}>Review your application before submitting.</Text>
                        <View style={styles.summaryCard}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Role</Text>
                                <Text style={styles.summaryValue} numberOfLines={1}>{job.title}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Company</Text>
                                <Text style={styles.summaryValue}>{job.company}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Location</Text>
                                <Text style={styles.summaryValue}>{job.location}</Text>
                            </View>
                            <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                                <Text style={styles.summaryLabel}>Answers</Text>
                                <Text style={styles.summaryValue}>{questions.length} question{questions.length !== 1 ? 's' : ''} answered</Text>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

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
                            {isConfirmStep ? 'Submit Application' : 'Continue'}
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
    content: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 32 },
    stepContainer: {},
    stepTitle: { fontSize: 26, fontWeight: '800', color: THEME.text, marginBottom: 8, letterSpacing: -0.5 },
    stepSubtitle: { fontSize: 15, color: THEME.textMuted, marginBottom: 32, lineHeight: 22 },
    resumeCard: { backgroundColor: THEME.surface, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: THEME.primary, shadowColor: THEME.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 3 },
    resumeIcon: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#EDF2F7', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    resumeName: { fontSize: 15, fontWeight: '700', color: THEME.text, marginBottom: 4 },
    resumeTime: { fontSize: 13, color: THEME.textMuted },
    questionCard: { backgroundColor: THEME.surface, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: THEME.border, marginBottom: 16 },
    questionLabel: { fontSize: 11, fontWeight: '800', color: THEME.primary, letterSpacing: 1, marginBottom: 12 },
    questionText: { fontSize: 17, fontWeight: '600', color: THEME.text, marginBottom: 20, lineHeight: 24 },
    inputArea: { backgroundColor: THEME.background, borderWidth: 1, borderColor: THEME.border, borderRadius: 12, padding: 16, fontSize: 16, color: THEME.text, minHeight: 120 },
    summaryCard: { backgroundColor: THEME.surface, borderRadius: 16, borderWidth: 1, borderColor: THEME.border, overflow: 'hidden' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: THEME.border },
    summaryLabel: { fontSize: 15, color: THEME.textMuted, fontWeight: '500' },
    summaryValue: { fontSize: 15, color: THEME.text, fontWeight: '600', maxWidth: '55%', textAlign: 'right' },
    bottomBar: { paddingHorizontal: 24, paddingVertical: 24, backgroundColor: THEME.surface, borderTopWidth: 1, borderTopColor: THEME.border },
    actionButton: { backgroundColor: THEME.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center', shadowColor: THEME.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    actionButtonText: { color: THEME.primaryForeground, fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
});
