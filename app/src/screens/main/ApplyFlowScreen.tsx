import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { API_BASE_URL } from '../../api/config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Minimal App Theme ─────────────────────────────────────────────────────────
const C = {
  background:   '#F3F3F3',
  surface:      '#FFFFFF',
  surfaceLow:   '#FAFAFA',
  primary:      '#1A1A1A',
  primaryLight: '#EBEBEB',
  onSurface:    '#1A1A1A',
  onSurfaceVar: '#7A7A7A',
  outlineVar:   '#E6E6E6',
  accent:       '#4F46E5',
  success:      '#10B981',
};

// ─── Animated Input Component ───────────────────────────────────────────────────
function AnimatedInput({ label, value, onChangeText, placeholder, keyboardType, autoCapitalize }: any) {
  const lineWidth = useRef(new Animated.Value(0)).current;
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(lineWidth, { toValue: 1, useNativeDriver: false, tension: 80, friction: 10 }).start();
  };
  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(lineWidth, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const animatedWidth = lineWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.formGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.cleanInput, isFocused && { borderBottomColor: 'transparent' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.outlineVar}
        onFocus={handleFocus}
        onBlur={handleBlur}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {/* Focus underline animation */}
      <View style={styles.inputLineTrack}>
        <Animated.View style={[styles.inputLineFill, { width: animatedWidth }]} />
      </View>
    </View>
  );
}

// ─── Step Dots Component ────────────────────────────────────────────────────────
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }).map((_, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < current;
        const isActive = stepNum === current;
        return (
          <React.Fragment key={i}>
            <View style={[
              styles.dot,
              isCompleted && styles.dotCompleted,
              isActive && styles.dotActive,
            ]}>
              {isCompleted && <Ionicons name="checkmark" size={10} color="#FFF" />}
              {isActive && <View style={styles.dotInner} />}
            </View>
            {i < total - 1 && (
              <View style={[styles.dotLine, isCompleted && styles.dotLineCompleted]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

// ─── Success Overlay ────────────────────────────────────────────────────────────
function SuccessOverlay({ jobTitle, company, onDone }: { jobTitle: string; company: string; onDone: () => void }) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.spring(checkScale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
      Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(btnOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.successOverlay, { opacity }]}>
      <Animated.View style={[styles.successCard, { transform: [{ scale }] }]}>
        
        {/* Animated Checkmark */}
        <Animated.View style={[styles.successCheckCircle, { transform: [{ scale: checkScale }] }]}>
          <Ionicons name="checkmark" size={40} color="#FFF" />
        </Animated.View>

        <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
          <Text style={styles.successTitle}>Application Sent</Text>
          <Text style={styles.successRole}>{jobTitle}</Text>
          <View style={styles.successDivider} />
          <Text style={styles.successCompany}>{company}</Text>
          <Text style={styles.successBlurb}>
            Your narrative has been submitted. The hiring team will review your profile and respond within 5-7 business days.
          </Text>
        </Animated.View>

        <Animated.View style={{ opacity: btnOpacity, width: '100%', marginTop: 32 }}>
          <TouchableOpacity style={styles.successBtn} onPress={onDone} activeOpacity={0.8}>
            <Text style={styles.successBtnText}>BACK TO DASHBOARD</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>

      </Animated.View>
    </Animated.View>
  );
}

// ─── Main Screen ────────────────────────────────────────────────────────────────
export default function ApplyFlowScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const job = route.params?.job;

  const questions: string[] = job?.screeningQuestions || [];
  const hasReqs = job?.relocationRequired || job?.currentCTCRequired;
  let computedTotalSteps = 2;
  if (hasReqs) computedTotalSteps++;
  if (questions.length > 0) computedTotalSteps++;
  const totalSteps = computedTotalSteps;

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [answers, setAnswers] = useState<string[]>(questions.map(() => ''));
  const [relocationAnswer, setRelocationAnswer] = useState('Open to discuss');
  const [ctcAnswer, setCtcAnswer] = useState('');
  const [profileResumeUrl, setProfileResumeUrl] = useState<string | null>(null);
  const [resumeOption, setResumeOption] = useState<'existing' | 'new'>('existing');
  const [newResume, setNewResume] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [philosophy, setPhilosophy] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Animations
  const progressAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const resumeCheckAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { fetchUserProfile(); }, []);

  // Animate progress bar on step change
  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: step / totalSteps,
      useNativeDriver: false,
      tension: 60,
      friction: 12,
    }).start();
  }, [step]);

  // Animate resume check when file selected
  useEffect(() => {
    if (newResume || profileResumeUrl) {
      Animated.spring(resumeCheckAnim, { toValue: 1, useNativeDriver: true, tension: 100, friction: 6 }).start();
    }
  }, [newResume, profileResumeUrl]);

  const animateStepTransition = (nextStep: number) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setStep(nextStep);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }),
      ]).start();
    });
  };

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.user) {
        if (data.user.resumeUrl) setProfileResumeUrl(data.user.resumeUrl);
        if (data.user.name) setFullName(data.user.name);
        if (data.user.email) setEmail(data.user.email);
      }
    } catch { console.log('Failed to fetch profile'); }
    finally { setLoadingProfile(false); }
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
    } catch { Alert.alert('Error', 'Could not pick document.'); }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      animateStepTransition(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) animateStepTransition(step - 1);
    else navigation.goBack();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) { Alert.alert('Error', 'You must be logged in to apply.'); setSubmitting(false); return; }

      const formData = new FormData();
      formData.append('jobId', job.id);
      formData.append('screeningAnswers', JSON.stringify(questions.map((q, i) => ({ question: q, answer: answers[i] || '' }))));
      if (job.relocationRequired) formData.append('relocationAnswer', relocationAnswer);
      if (job.currentCTCRequired) formData.append('ctcAnswer', ctcAnswer);
      if (resumeOption === 'existing') {
        formData.append('useExistingResume', 'true');
      } else if (newResume) {
        formData.append('resume', { uri: newResume.uri, type: newResume.mimeType || 'application/pdf', name: newResume.name } as any);
      }

      const res = await fetch(`${API_BASE_URL}/api/applications`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Error', data.message || 'Failed to submit application.');
      } else {
        setShowSuccess(true);
      }
    } catch { Alert.alert('Error', 'Could not reach the server.'); }
    finally { setSubmitting(false); }
  };

  if (!job) return null;

  const reqStepIndex = hasReqs ? 2 : -1;
  const answerStepIndex = questions.length > 0 ? (hasReqs ? 3 : 2) : -1;
  const isReqStep = step === reqStepIndex;
  const isAnswerStep = step === answerStepIndex;
  const isConfirmStep = step === totalSteps;

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  // ─── Success Overlay ──────────────────────────────────────────────────────
  if (showSuccess) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <SuccessOverlay
          jobTitle={job.title}
          company={job.company}
          onDone={() => navigation.navigate('Main')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

        {/* ─── Progress Bar ─────────────────────────────────────────── */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>

        {/* ─── Header ───────────────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <Ionicons name="close" size={24} color={C.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerCompanyText}>{(job.company || 'COMPANY').toUpperCase()}</Text>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>{step}/{totalSteps}</Text>
          </View>
        </View>

        {/* ─── Step Dots ────────────────────────────────────────────── */}
        <StepDots current={step} total={totalSteps} />

        {/* ─── Content ──────────────────────────────────────────────── */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

            {step === 1 && (
              <View>
                {/* Job Badge */}
                <View style={styles.jobBadge}>
                  <View style={styles.jobBadgeLogo}>
                    <Text style={styles.jobBadgeLogoText}>{(job.company || 'C').charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.jobBadgeTitle} numberOfLines={1}>{job.title}</Text>
                    <Text style={styles.jobBadgeMeta}>{job.company} • {job.location}</Text>
                  </View>
                </View>

                <Text style={styles.overline}>APPLICATION PROGRESS</Text>
                <Text style={styles.mainTitle}>Candidate Profile</Text>
                <Text style={styles.descriptionText}>
                  {job.title} — {job.description?.slice(0, 100) || 'We are looking for an architect of narrative to define the next era.'}...
                </Text>

                <AnimatedInput label="FULL NAME" value={fullName} onChangeText={setFullName} placeholder="Your full name" />
                <AnimatedInput label="PROFESSIONAL EMAIL" value={email} onChangeText={setEmail} placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none" />

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>PORTFOLIO / DOSSIER</Text>
                  {loadingProfile ? (
                    <ActivityIndicator size="small" color={C.primary} style={{ marginTop: 20 }} />
                  ) : (
                    <TouchableOpacity style={styles.uploadBox} onPress={handlePickResume} activeOpacity={0.7}>
                      <Animated.View style={{ transform: [{ scale: newResume || profileResumeUrl ? resumeCheckAnim : new Animated.Value(1) }] }}>
                        <Ionicons
                          name={newResume || profileResumeUrl ? "checkmark-circle" : "cloud-upload-outline"}
                          size={32}
                          color={newResume || profileResumeUrl ? C.success : C.onSurfaceVar}
                        />
                      </Animated.View>
                      <Text style={styles.uploadText}>
                        {newResume ? newResume.name.toUpperCase() : (profileResumeUrl ? "EXISTING PROFILE ARCHIVE" : "TAP TO UPLOAD RESUME")}
                      </Text>
                      {(newResume || profileResumeUrl) && (
                        <View style={styles.uploadedPill}>
                          <Ionicons name="document-text" size={12} color={C.success} />
                          <Text style={styles.uploadedPillText}>ATTACHED</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>COVER NOTE (OPTIONAL)</Text>
                  <View style={styles.textareaContainer}>
                    <TextInput
                      style={styles.textareaInput}
                      value={philosophy}
                      onChangeText={setPhilosophy}
                      placeholder="Briefly articulate your strategic lens..."
                      placeholderTextColor={C.onSurfaceVar}
                      multiline
                      textAlignVertical="top"
                    />
                    <Text style={styles.charCount}>{philosophy.length}/500</Text>
                  </View>
                </View>
              </View>
            )}

            {isReqStep && (
              <View>
                <Text style={styles.overline}>ADDITIONAL REQUIREMENTS</Text>
                <Text style={styles.mainTitle}>Logistics</Text>
                <Text style={styles.descriptionText}>The employer requires some operational details.</Text>

                {job.relocationRequired && (
                  <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>RELOCATION REQUIRED</Text>
                    <Text style={styles.subText}>Will you be able to relocate?</Text>
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                      {['Yes', 'No', 'Discuss'].map((opt) => (
                        <TouchableOpacity
                          key={opt}
                          style={[styles.pillBtn, relocationAnswer === opt && styles.pillBtnActive]}
                          onPress={() => setRelocationAnswer(opt)}
                        >
                          <Text style={[styles.pillBtnText, relocationAnswer === opt && styles.pillBtnTextActive]}>{opt.toUpperCase()}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {job.currentCTCRequired && (
                  <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>CURRENT CTC & EXPECTATIONS</Text>
                    <View style={styles.textareaContainer}>
                      <TextInput
                        style={styles.textareaInput}
                        multiline
                        placeholder="e.g. Current CTC: ₹8L, Expected: ₹12L"
                        placeholderTextColor={C.onSurfaceVar}
                        value={ctcAnswer}
                        onChangeText={setCtcAnswer}
                        textAlignVertical="top"
                      />
                    </View>
                  </View>
                )}
              </View>
            )}

            {isAnswerStep && (
              <View>
                <Text style={styles.overline}>EVALUATION</Text>
                <Text style={styles.mainTitle}>Screening</Text>
                <Text style={styles.descriptionText}>Provide insights for the hiring team.</Text>
                {questions.map((q, i) => (
                  <View key={i} style={styles.formGroup}>
                    <Text style={styles.inputLabel}>QUESTION 0{i + 1}</Text>
                    <Text style={[styles.subText, { marginBottom: 12 }]}>{q}</Text>
                    <View style={styles.textareaContainer}>
                      <TextInput
                        style={styles.textareaInput}
                        multiline
                        placeholder="Write your answer here..."
                        placeholderTextColor={C.onSurfaceVar}
                        value={answers[i]}
                        onChangeText={(t) => { const newA = [...answers]; newA[i] = t; setAnswers(newA); }}
                        textAlignVertical="top"
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}

            {isConfirmStep && (
              <View>
                <Text style={styles.overline}>FINALIZATION</Text>
                <Text style={styles.mainTitle}>Confirm Submission</Text>
                <Text style={styles.descriptionText}>Review your narrative before submitting.</Text>

                <View style={styles.summaryCard}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>ROLE</Text>
                    <Text style={styles.summaryValue} numberOfLines={1}>{job.title}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>COMPANY</Text>
                    <Text style={styles.summaryValue}>{job.company}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>LOCATION</Text>
                    <Text style={styles.summaryValue}>{job.location}</Text>
                  </View>
                  <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.summaryLabel}>RESUME</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <Ionicons name="checkmark-circle" size={14} color={C.success} />
                      <Text style={{ fontSize: 14, fontWeight: '600', color: C.success }}>Attached</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

          </Animated.View>
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ─── Bottom Bar ───────────────────────────────────────────── */}
        <View style={styles.bottomBar}>
          {step > 1 ? (
            <TouchableOpacity style={styles.iconBackBtn} onPress={handleBack}>
              <Ionicons name="chevron-back" size={24} color={C.onSurfaceVar} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 44 }} />
          )}

          <TouchableOpacity
            style={[styles.submitBtn, (step === 1 && !profileResumeUrl && !newResume) && styles.submitBtnDisabled]}
            activeOpacity={0.8}
            onPress={handleNext}
            disabled={submitting || (step === 1 && !profileResumeUrl && !newResume)}
          >
            {submitting ? (
              <ActivityIndicator color={C.surface} size="small" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={styles.submitBtnText}>
                  {isConfirmStep ? 'SUBMIT APPLICATION' : 'CONTINUE'}
                </Text>
                <Ionicons name={isConfirmStep ? "checkmark" : "arrow-forward"} size={16} color="#FFF" />
              </View>
            )}
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.surface },

  // Progress bar
  progressTrack: {
    height: 3,
    backgroundColor: C.outlineVar,
    width: '100%',
  },
  progressFill: {
    height: 3,
    backgroundColor: C.primary,
    borderRadius: 2,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  headerBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerCompanyText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: C.onSurfaceVar,
  },
  stepBadge: {
    backgroundColor: C.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.primary,
    letterSpacing: 0.5,
  },

  // Step dots
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 48,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: C.outlineVar,
    backgroundColor: C.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotCompleted: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  dotActive: {
    borderColor: C.primary,
    borderWidth: 2,
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.primary,
  },
  dotLine: {
    flex: 1,
    height: 2,
    backgroundColor: C.outlineVar,
    marginHorizontal: 4,
  },
  dotLineCompleted: {
    backgroundColor: C.primary,
  },

  // Content
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },

  // Job Badge
  jobBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surfaceLow,
    borderRadius: 12,
    padding: 14,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: C.outlineVar,
  },
  jobBadgeLogo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: C.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  jobBadgeLogoText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  jobBadgeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.onSurface,
    marginBottom: 2,
  },
  jobBadgeMeta: {
    fontSize: 12,
    color: C.onSurfaceVar,
    fontWeight: '500',
  },

  // Typography
  overline: {
    fontSize: 10,
    fontWeight: '700',
    color: C.onSurfaceVar,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: C.onSurface,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: C.onSurfaceVar,
    lineHeight: 24,
    marginBottom: 32,
  },

  // Forms
  formGroup: { marginBottom: 28 },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.onSurfaceVar,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  subText: {
    fontSize: 15,
    color: C.onSurface,
    fontWeight: '500',
  },
  cleanInput: {
    borderBottomWidth: 1,
    borderBottomColor: C.outlineVar,
    paddingVertical: 10,
    fontSize: 17,
    color: C.onSurface,
    fontWeight: '400',
  },
  inputLineTrack: {
    height: 2,
    backgroundColor: 'transparent',
    marginTop: -1,
    overflow: 'hidden',
  },
  inputLineFill: {
    height: 2,
    backgroundColor: C.primary,
    borderRadius: 1,
  },

  // Upload
  uploadBox: {
    borderWidth: 1.5,
    borderColor: C.outlineVar,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surfaceLow,
  },
  uploadText: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '700',
    color: C.onSurfaceVar,
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  uploadedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
  },
  uploadedPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: C.success,
    letterSpacing: 1,
  },

  // Textarea
  textareaContainer: {
    backgroundColor: C.surfaceLow,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.outlineVar,
  },
  textareaInput: {
    fontSize: 15,
    color: C.onSurface,
    minHeight: 100,
    fontWeight: '400',
    lineHeight: 22,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 10,
    color: C.onSurfaceVar,
    marginTop: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Pills
  pillBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: C.outlineVar,
    alignItems: 'center',
  },
  pillBtnActive: {
    backgroundColor: C.onSurface,
    borderColor: C.onSurface,
  },
  pillBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.onSurfaceVar,
    letterSpacing: 1,
  },
  pillBtnTextActive: { color: C.surface },

  // Summary
  summaryCard: {
    backgroundColor: C.surfaceLow,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: C.outlineVar,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.outlineVar,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.onSurfaceVar,
    letterSpacing: 1,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: C.onSurface,
    maxWidth: '60%',
    textAlign: 'right',
  },

  // Bottom
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.outlineVar,
  },
  iconBackBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.outlineVar,
  },
  submitBtn: {
    backgroundColor: C.primary,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 100,
    flexDirection: 'row',
  },
  submitBtnDisabled: { opacity: 0.35 },
  submitBtnText: {
    color: C.surface,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },

  // Success Overlay
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: C.surface,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    zIndex: 100,
  },
  successCard: {
    alignItems: 'center',
    width: '100%',
  },
  successCheckCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: C.onSurfaceVar,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  successRole: {
    fontSize: 28,
    fontWeight: '800',
    color: C.onSurface,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  successDivider: {
    width: 40,
    height: 2,
    backgroundColor: C.outlineVar,
    marginBottom: 16,
  },
  successCompany: {
    fontSize: 14,
    fontWeight: '600',
    color: C.onSurfaceVar,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  successBlurb: {
    fontSize: 14,
    color: C.onSurfaceVar,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  successBtn: {
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 100,
    width: '100%',
  },
  successBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});
