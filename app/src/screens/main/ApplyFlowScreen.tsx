import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
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
    const hasReqs = job?.relocationRequired || job?.currentCTCRequired;
    // Step 1: Resume. Step 2 (Optional): Requirements. Step 3 (Optional): Questions. Final: Confirm
    let computedTotalSteps = 2;
    if (hasReqs) computedTotalSteps++;
    if (questions.length > 0) computedTotalSteps++;
    const totalSteps = computedTotalSteps;

    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [answers, setAnswers] = useState<string[]>(questions.map(() => ''));
    const [relocationAnswer, setRelocationAnswer] = useState('Open to discuss');
    const [ctcAnswer, setCtcAnswer] = useState('');
    const [profileResumeUrl, setProfileResumeUrl] = useState<string | null>(null);
    const [resumeOption, setResumeOption] = useState<'existing' | 'new'>('existing');
    const [newResume, setNewResume] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success && data.user.resumeUrl) {
                setProfileResumeUrl(data.user.resumeUrl);
            }
        } catch (err) {
            console.log('Failed to fetch profile');
        } finally {
            setLoadingProfile(false);
        }
    };

    const handlePickResume = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setNewResume(result.assets[0]);
                setResumeOption('new');
            }
        } catch (err) {
            Alert.alert('Error', 'Could not pick document.');
        }
    };

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

            const formData = new FormData();
            formData.append('jobId', job.id);
            formData.append('screeningAnswers', JSON.stringify(questions.map((q, i) => ({
                question: q,
                answer: answers[i] || '',
            }))));

            if (job.relocationRequired) {
                formData.append('relocationAnswer', relocationAnswer);
            }
            if (job.currentCTCRequired) {
                formData.append('ctcAnswer', ctcAnswer);
            }

            if (resumeOption === 'existing') {
                formData.append('useExistingResume', 'true');
            } else if (newResume) {
                formData.append('resume', {
                    uri: newResume.uri,
                    type: newResume.mimeType || 'application/pdf',
                    name: newResume.name,
                } as any);
            }

            const res = await fetch(`${API_BASE_URL}/api/applications`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
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

    const reqStepIndex = hasReqs ? 2 : -1;
    const answerStepIndex = questions.length > 0 ? (hasReqs ? 3 : 2) : -1;
    
    const isReqStep = step === reqStepIndex;
    const isAnswerStep = step === answerStepIndex;
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
                        <Text style={styles.stepTitle}>Choose Your Resume</Text>
                        <Text style={styles.stepSubtitle}>
                            You're applying for <Text style={{ color: THEME.primary, fontWeight: '700' }}>{job.title}</Text> at {job.company}.
                        </Text>

                        {loadingProfile ? (
                            <ActivityIndicator size="large" color={THEME.primary} style={{ marginTop: 20 }} />
                        ) : (
                            <>
                                {profileResumeUrl && (
                                    <TouchableOpacity
                                        style={[
                                            styles.resumeCard,
                                            resumeOption === 'existing' && styles.resumeCardSelected
                                        ]}
                                        onPress={() => setResumeOption('existing')}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.resumeIcon}>
                                            <Ionicons name="document-text" size={32} color={THEME.primary} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.resumeName}>Profile Resume</Text>
                                            <Text style={styles.resumeTime}>Resume from your profile</Text>
                                        </View>
                                        <Ionicons
                                            name={resumeOption === 'existing' ? 'checkmark-circle' : 'radio-button-off'}
                                            size={24}
                                            color={resumeOption === 'existing' ? '#10B981' : THEME.textMuted}
                                        />
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    style={[
                                        styles.resumeCard,
                                        { marginTop: profileResumeUrl ? 16 : 0 },
                                        resumeOption === 'new' && styles.resumeCardSelected
                                    ]}
                                    onPress={handlePickResume}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.resumeIcon}>
                                        <Ionicons name="cloud-upload" size={32} color={THEME.accent} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.resumeName}>
                                            {newResume ? newResume.name : 'Upload New Resume'}
                                        </Text>
                                        <Text style={styles.resumeTime}>
                                            {newResume ? `${(newResume.size! / 1024).toFixed(0)} KB` : 'Choose a different resume'}
                                        </Text>
                                    </View>
                                    <Ionicons
                                        name={resumeOption === 'new' ? 'checkmark-circle' : 'add-circle'}
                                        size={24}
                                        color={resumeOption === 'new' ? '#10B981' : THEME.textMuted}
                                    />
                                </TouchableOpacity>

                                {!profileResumeUrl && !newResume && (
                                    <View style={styles.warningBox}>
                                        <Ionicons name="warning" size={20} color="#F59E0B" />
                                        <Text style={styles.warningText}>Please upload a resume to continue</Text>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                )}

                {isReqStep && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Additional Requirements</Text>
                        <Text style={styles.stepSubtitle}>The employer requires some additional details.</Text>

                        {job.relocationRequired && (
                            <View style={styles.questionCard}>
                                <Text style={styles.questionLabel}>RELOCATION REQUIRED</Text>
                                <Text style={styles.questionText}>Will you be able to relocate?</Text>
                                <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                                    {['Yes', 'No', 'Open to discuss'].map((opt) => (
                                        <TouchableOpacity
                                            key={opt}
                                            style={[styles.resumeCard, { flex: 1, padding: 12 }, relocationAnswer === opt && styles.resumeCardSelected]}
                                            onPress={() => setRelocationAnswer(opt)}
                                        >
                                            <Text style={[styles.resumeName, { textAlign: 'center', fontSize: 13, marginBottom: 0 }]}>{opt}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {job.currentCTCRequired && (
                            <View style={styles.questionCard}>
                                <Text style={styles.questionLabel}>CURRENT CTC & EXPECTATIONS</Text>
                                <Text style={styles.questionText}>What is your current CTC and expectations?</Text>
                                <TextInput
                                    style={styles.inputArea}
                                    multiline
                                    placeholder="e.g. Current CTC: ₹8,00,000, Expected: ₹12,00,000"
                                    placeholderTextColor="#9CA3AF"
                                    value={ctcAnswer}
                                    onChangeText={setCtcAnswer}
                                    textAlignVertical="top"
                                />
                            </View>
                        )}
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
                            {hasReqs && (
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Reqs Answered</Text>
                                    <Text style={styles.summaryValue}>Yes</Text>
                                </View>
                            )}
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
                    style={[
                        styles.actionButton,
                        (step === 1 && !profileResumeUrl && !newResume) && styles.actionButtonDisabled
                    ]}
                    activeOpacity={0.8}
                    onPress={handleNext}
                    disabled={submitting || (step === 1 && !profileResumeUrl && !newResume)}
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
    actionButtonDisabled: { backgroundColor: THEME.textMuted, opacity: 0.5 },
    actionButtonText: { color: THEME.primaryForeground, fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
    resumeCardSelected: { borderColor: THEME.primary, borderWidth: 2, backgroundColor: '#F0F9FF' },
    warningBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', padding: 16, borderRadius: 12, marginTop: 16, gap: 12 },
    warningText: { fontSize: 14, color: '#92400E', fontWeight: '600', flex: 1 },
});
