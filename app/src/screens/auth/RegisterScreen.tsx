import React, { useState, useRef } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert, Image, Animated, ImageBackground, StatusBar
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../../api/config';

// ─── Home Screen "Pure Matte" Sync ───────────────────────────────────────────
const THEME = {
    primary: '#2C2C2C',     // Deep Matte Dark Grey
    background: '#F3F3F3',  // Pure Matte Light Grey
    surface: '#FFFFFF',     // Pure White
    text: '#1A1A1A',        // Matte Black
    textMuted: '#7A7A7A',   // Matte Medium Grey
    border: '#E6E6E6',      // Ultra-soft grey
    radius: 100,            // Pill geometry
};

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function RegisterScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [resume, setResume] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingText, setLoadingText] = useState('JOIN HIREVIA');
    
    // OTP State
    const [step, setStep] = useState<'DETAILS' | 'OTP'>('DETAILS');
    const [otp, setOtp] = useState('');

    // Animations
    const nameFocusAnim = useRef(new Animated.Value(0)).current;
    const emailFocusAnim = useRef(new Animated.Value(0)).current;
    const phoneFocusAnim = useRef(new Animated.Value(0)).current;
    const passFocusAnim = useRef(new Animated.Value(0)).current;
    const otpFocusAnim = useRef(new Animated.Value(0)).current;

    const nameScaleAnim = useRef(new Animated.Value(1)).current;
    const emailScaleAnim = useRef(new Animated.Value(1)).current;
    const phoneScaleAnim = useRef(new Animated.Value(1)).current;
    const passScaleAnim = useRef(new Animated.Value(1)).current;
    const otpScaleAnim = useRef(new Animated.Value(1)).current;

    const animateFocus = (anim: Animated.Value, scaleAnim: Animated.Value, toValue: number) => {
        Animated.parallel([
            Animated.timing(anim, {
                toValue,
                duration: 250,
                useNativeDriver: false,
            }),
            Animated.spring(scaleAnim, {
                toValue: toValue === 1 ? 1.02 : 1.0,
                useNativeDriver: true,
                friction: 8,
                tension: 40,
            })
        ]).start();
    };

    const handlePickResume = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setResume(result.assets[0]);
            }
        } catch (err) {
            Alert.alert('Error', 'Could not pick document.');
        }
    };

    const handleRegister = async () => {
        if (!fullName || !email || !password) {
            setError('Full name, email and password are required.');
            return;
        }
        setError('');
        setLoading(true);
        setLoadingText('Connecting...');

        // Waking up Render logic
        const timer = setTimeout(() => {
            setLoadingText('Waking up server...');
        }, 5000);

        try {
            const formData = new FormData();
            formData.append('name', fullName);
            formData.append('email', email);
            formData.append('password', password);
            if (phone) formData.append('phone', phone);
            
            if (resume) {
                formData.append('resume', {
                    uri: resume.uri,
                    type: resume.mimeType || 'application/pdf',
                    name: resume.name,
                } as any);
            }

            // Using AbortController for Timeout (30s)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 35000);

            const res = await fetch(`${API_BASE_URL}/api/auth/register/applicant`, {
                method: 'POST',
                body: formData,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Registration failed.');
            } else {
                setStep('OTP');
                Alert.alert('OTP Broadcasted', 'Your account is created. Please check your email for the verification code.');
            }
        } catch (err: any) {
            if (err.name === 'AbortError') {
                setError('Server is taking too long. It might be waking up—please try again in 30 seconds.');
            } else {
                setError('Connectivity error. Check your internet or backend URL.');
            }
        } finally {
            clearTimeout(timer);
            setLoading(false);
            setLoadingText('JOIN HIREVIA');
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length < 6) {
            setError('Please enter a valid 6-digit OTP.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Verification failed.');
            } else {
                Alert.alert('Success', `Welcome, ${data.user.name}!`);
                navigation.navigate('Login');
            }
        } catch (err) {
            setError('Could not reach the server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            
            {/* 1. Immersive Floating Header Overlay */}
            <View style={[styles.floatingHeader, { paddingTop: insets.top + 8 }]}>
                <Text style={styles.headerLogo}>Hire<Text style={styles.headerLogoBold}>Via</Text></Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                    <Ionicons name="close-outline" size={28} color={THEME.text} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent} 
                    showsVerticalScrollIndicator={false} 
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                >
                    {/* 2. 'Airy Growth' Immersive Hero (Edge-to-Edge) */}
                    <View style={styles.heroContainer}>
                        <ImageBackground 
                            source={require('../../../assets/images/hero_airy.png')} 
                            style={styles.heroImage}
                            resizeMode="cover"
                        >
                            <LinearGradient
                                colors={['rgba(255,255,255,0)', 'rgba(243,243,243,0.7)', '#F3F3F3']}
                                locations={[0, 0.4, 1]}
                                style={styles.heroGradient}
                            />
                            <View style={styles.heroTextContent}>
                                <Text style={styles.heroLabel}>WORKSPACE EXCELLENCE</Text>
                                <Text style={styles.heroTitle}>Architecture of a career.</Text>
                            </View>
                        </ImageBackground>
                    </View>

                    {/* 3. Pure Matte Form Area */}
                    <View style={styles.formArea}>
                        <View style={styles.textHeader}>
                            <Text style={styles.title}>{step === 'DETAILS' ? 'Create your narrative' : 'Verify Email'}</Text>
                            <Text style={styles.subtitle}>{step === 'DETAILS' ? 'Join a curated network of professionals shaping the future.' : `Enter code sent to ${email}`}</Text>
                        </View>

                        {step === 'DETAILS' ? (
                            <View style={styles.form}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>FULL NAME</Text>
                                    <Animated.View style={{ transform: [{ scale: nameScaleAnim }] }}>
                                        <AnimatedTextInput
                                            style={[styles.input, { borderBottomColor: nameFocusAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [THEME.border, THEME.primary]
                                            }) }]}
                                            placeholder="Julian Sterling"
                                            placeholderTextColor="#A0AEC0"
                                            value={fullName}
                                            onChangeText={setFullName}
                                            onFocus={() => animateFocus(nameFocusAnim, nameScaleAnim, 1)}
                                            onBlur={() => animateFocus(nameFocusAnim, nameScaleAnim, 0)}
                                        />
                                        <Animated.View style={[styles.focusLine, { width: nameFocusAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%']
                                        }) }]} />
                                    </Animated.View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>PHONE NUMBER</Text>
                                    <Animated.View style={{ transform: [{ scale: phoneScaleAnim }] }}>
                                        <AnimatedTextInput
                                            style={[styles.input, { borderBottomColor: phoneFocusAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [THEME.border, THEME.primary]
                                            }) }]}
                                            placeholder="+1 (555) 000-0000"
                                            placeholderTextColor="#A0AEC0"
                                            value={phone}
                                            onChangeText={setPhone}
                                            keyboardType="phone-pad"
                                            onFocus={() => animateFocus(phoneFocusAnim, phoneScaleAnim, 1)}
                                            onBlur={() => animateFocus(phoneFocusAnim, phoneScaleAnim, 0)}
                                        />
                                        <Animated.View style={[styles.focusLine, { width: phoneFocusAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%']
                                        }) }]} />
                                    </Animated.View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>EMAIL ADDRESS</Text>
                                    <Animated.View style={{ transform: [{ scale: emailScaleAnim }] }}>
                                        <AnimatedTextInput
                                            style={[styles.input, { borderBottomColor: emailFocusAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [THEME.border, THEME.primary]
                                            }) }]}
                                            placeholder="julian@atelier.design"
                                            placeholderTextColor="#A0AEC0"
                                            value={email}
                                            onChangeText={setEmail}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            onFocus={() => animateFocus(emailFocusAnim, emailScaleAnim, 1)}
                                            onBlur={() => animateFocus(emailFocusAnim, emailScaleAnim, 0)}
                                        />
                                        <Animated.View style={[styles.focusLine, { width: emailFocusAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%']
                                        }) }]} />
                                    </Animated.View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>RESUME (PDF/DOCX)</Text>
                                    <TouchableOpacity
                                        style={styles.resumeBtn}
                                        onPress={handlePickResume}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons name="document-attach-outline" size={20} color={resume ? THEME.primary : THEME.textMuted} />
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.resumeBtnText, resume && { color: THEME.primary, fontWeight: '700' }]}>
                                                {resume ? resume.name : 'Select PDF or Word doc'}
                                            </Text>
                                        </View>
                                        {resume ? <TouchableOpacity onPress={() => setResume(null)}><Ionicons name="close-circle" size={18} color={THEME.textMuted} /></TouchableOpacity> : <Text style={styles.browseText}>BROWSE</Text>}
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>SECURE PASSWORD</Text>
                                    <Animated.View style={{ transform: [{ scale: passScaleAnim }] }}>
                                        <AnimatedTextInput
                                            style={[styles.input, { borderBottomColor: passFocusAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [THEME.border, THEME.primary]
                                            }) }]}
                                            placeholder="••••••••"
                                            placeholderTextColor="#A0AEC0"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry
                                            onFocus={() => animateFocus(passFocusAnim, passScaleAnim, 1)}
                                            onBlur={() => animateFocus(passFocusAnim, passScaleAnim, 0)}
                                        />
                                        <Animated.View style={[styles.focusLine, { width: passFocusAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%']
                                        }) }]} />
                                    </Animated.View>
                                </View>

                                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                                <TouchableOpacity
                                    style={styles.pillBtn}
                                    activeOpacity={0.8}
                                    onPress={handleRegister}
                                    disabled={loading}
                                >
                                    {loading ? <ActivityIndicator color="#FFF" style={{ marginRight: 10 }} /> : null}
                                    <Text style={styles.pillBtnText}>{loading ? loadingText.toUpperCase() : 'JOIN HIREVIA'}</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.form}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>ENTER VERIFICATION CODE</Text>
                                    <Animated.View style={{ transform: [{ scale: otpScaleAnim }] }}>
                                        <AnimatedTextInput
                                            style={[styles.input, { borderBottomColor: otpFocusAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [THEME.border, THEME.primary]
                                            }), textAlign: 'center', letterSpacing: 8 }]}
                                            placeholder="000000"
                                            placeholderTextColor="#A0AEC0"
                                            value={otp}
                                            onChangeText={setOtp}
                                            keyboardType="number-pad"
                                            maxLength={6}
                                            onFocus={() => animateFocus(otpFocusAnim, otpScaleAnim, 1)}
                                            onBlur={() => animateFocus(otpFocusAnim, otpScaleAnim, 0)}
                                        />
                                        <Animated.View style={[styles.focusLine, { width: otpFocusAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%']
                                        }) }]} />
                                    </Animated.View>
                                </View>

                                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                                <TouchableOpacity
                                    style={styles.pillBtn}
                                    activeOpacity={0.8}
                                    onPress={handleVerifyOtp}
                                    disabled={loading}
                                >
                                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.pillBtnText}>VERIFY & JOIN</Text>}
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={styles.backBtn} 
                                    onPress={() => setStep('DETAILS')}
                                >
                                    <Ionicons name="arrow-back" size={16} color={THEME.textMuted} />
                                    <Text style={styles.backBtnText}>Back to Details</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.footer}>
                            <Text style={styles.footerText}>Already part of the network? <Text style={styles.joinText}>Sign In</Text></Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 60 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: THEME.background },
    
    // 1. Floating Header Overlay
    floatingHeader: { 
        position: 'absolute', 
        top: 0, left: 0, right: 0, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        zIndex: 100,
        backgroundColor: 'transparent',
    },
    headerLogo: { fontSize: 18, fontWeight: '300', color: THEME.text, letterSpacing: -0.5 },
    headerLogoBold: { fontWeight: '800', color: THEME.primary },
    closeBtn: { padding: 4 },

    scrollContent: { flexGrow: 1 },

    // 2. 'Airy Growth' Immersive Hero
    heroContainer: { 
        height: 480, 
        width: '100%',
        backgroundColor: '#FFFFFF',
    },
    heroImage: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 32, paddingBottom: 80 },
    heroGradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '80%' },
    heroTextContent: { zIndex: 2 },
    heroLabel: { 
        fontSize: 10, 
        fontWeight: '800', 
        color: THEME.textMuted, 
        letterSpacing: 2.0,
        marginBottom: 8,
    },
    heroTitle: { 
        fontSize: 28, 
        fontWeight: '800', 
        color: THEME.text, 
        letterSpacing: -0.5,
        lineHeight: 34,
    },

    // 3. Form Area
    formArea: { paddingHorizontal: 32, marginTop: -20 },
    textHeader: { marginBottom: 40 },
    title: { 
        fontSize: 36, 
        fontWeight: '800', 
        color: THEME.text, 
        marginBottom: 8, 
        letterSpacing: -1.2,
    },
    subtitle: { 
        fontSize: 16, 
        color: THEME.textMuted, 
        lineHeight: 24,
        fontWeight: '500',
    },

    // Form
    form: { gap: 8 },
    inputGroup: { marginBottom: 32, position: 'relative' },
    label: { 
        fontSize: 10, 
        fontWeight: '800', 
        color: THEME.textMuted, 
        marginBottom: 10, 
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    input: { 
        borderBottomWidth: 1.5, 
        borderBottomColor: '#E2E8F0', 
        paddingVertical: 12, 
        fontSize: 18, 
        color: THEME.text,
        fontWeight: '400',
    },
    focusLine: { position: 'absolute', bottom: 0, left: 0, height: 2, backgroundColor: THEME.primary, zIndex: 2 },
    
    resumeBtn: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 12, 
        gap: 12,
        borderBottomWidth: 1.5,
        borderBottomColor: '#E2E8F0',
    },
    resumeBtnText: { fontSize: 18, color: THEME.textMuted, fontWeight: '400' },
    browseText: { fontSize: 10, fontWeight: '800', color: THEME.primary, opacity: 0.6 },

    errorText: { color: '#E53E3E', fontSize: 13, marginBottom: 16, textAlign: 'center', fontWeight: '600' },
    pillBtn: { 
        backgroundColor: THEME.primary, 
        paddingVertical: 20, 
        borderRadius: 100, 
        alignItems: 'center', 
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    pillBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12, letterSpacing: 1.5 },

    // Footer
    footer: { marginTop: 40, marginBottom: 20, alignItems: 'center' },
    footerText: { color: THEME.textMuted, fontSize: 15, fontWeight: '500' },
    joinText: { color: THEME.primary, fontWeight: '800' },

    // Navigation
    backBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 },
    backBtnText: { fontSize: 14, fontWeight: '800', color: THEME.textMuted },
});
