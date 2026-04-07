import React, { useState, useRef, useEffect } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, StyleSheet, 
    ActivityIndicator, KeyboardAvoidingView, Platform, Alert, 
    Image, ScrollView, Animated, ImageBackground, StatusBar 
} from 'react-native';
import LottieView from 'lottie-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../api/config';

import { PALETTE as THEME, TYPOGRAPHY as T } from '../../theme/tokens';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function LoginScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const emailFocusAnim = useRef(new Animated.Value(0)).current;
    const passFocusAnim = useRef(new Animated.Value(0)).current;
    const emailScaleAnim = useRef(new Animated.Value(1)).current;
    const passScaleAnim = useRef(new Animated.Value(1)).current;

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

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Login failed.');
            } else {
                if (data.user.role !== 'APPLICANT') {
                    setError('This app is for applicants only. HR should use the web portal.');
                    return;
                }
                await AsyncStorage.setItem('token', data.token);
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                navigation.replace('Main');
            }
        } catch (err: any) {
            setError('Could not reach the server. Check your connection.');
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
                    <Ionicons name="close-outline" size={28} color={THEME.onSurface} />
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
                        <LottieView
                            source={require('../../../assets/animations/job_hr.json')}
                            autoPlay
                            loop
                            style={styles.heroLottie}
                        />
                        <LinearGradient
                            colors={['rgba(255,255,255,0)', 'rgba(243,243,243,0.7)', '#F3F3F3']}
                            locations={[0, 0.4, 1]}
                            style={styles.heroGradient}
                        />
                        <View style={styles.heroTextContent}>
                            <Text style={styles.heroLabel}>WORKSPACE EXCELLENCE</Text>
                            <Text style={styles.heroTitle}>Architecture of a career.</Text>
                        </View>
                    </View>

                    {/* 3. Pure Matte Form Area */}
                    <View style={styles.formArea}>
                        <View style={styles.textHeader}>
                            <Text style={styles.title}>Welcome back</Text>
                            <Text style={styles.subtitle}>Continue your professional evolution.</Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>EMAIL ADDRESS</Text>
                                <Animated.View style={{ transform: [{ scale: emailScaleAnim }] }}>
                                    <AnimatedTextInput
                                        style={[styles.input, { borderBottomColor: emailFocusAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [THEME.outline, THEME.primary]
                                        }) }]}
                                        placeholder="name@studio.com"
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
                                <View style={styles.labelRow}>
                                    <Text style={styles.label}>PASSWORD</Text>
                                    <TouchableOpacity>
                                        <Text style={styles.forgotLink}>FORGOT?</Text>
                                    </TouchableOpacity>
                                </View>
                                <Animated.View style={{ transform: [{ scale: passScaleAnim }] }}>
                                    <AnimatedTextInput
                                        style={[styles.input, { borderBottomColor: passFocusAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [THEME.outline, THEME.primary]
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
                                onPress={handleLogin}
                                activeOpacity={0.8}
                            >
                                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.pillBtnText}>SIGN IN</Text>}
                            </TouchableOpacity>

                            <View style={styles.socialDivider}>
                                <View style={styles.line} />
                                <Text style={styles.dividerText}>OR</Text>
                                <View style={styles.line} />
                            </View>

                            <View style={styles.socialRow}>
                                <TouchableOpacity style={styles.socialBtn}>
                                    <Image 
                                        source={{ uri: 'https://img.icons8.com/color/72/google-logo.png' }} 
                                        style={styles.socialIcon} 
                                    />
                                    <Text style={styles.socialBtnText}>Google</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.socialBtn}>
                                    <Ionicons name="logo-linkedin" size={20} color="#0077B5" />
                                    <Text style={styles.socialBtnText}>LinkedIn</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={styles.footer}
                            onPress={() => navigation.navigate('Register')}
                        >
                            <Text style={styles.footerText}>
                                Don't have an account? <Text style={styles.joinText}>Join</Text>
                            </Text>
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
    headerLogo: { fontSize: 18, fontWeight: '300', color: THEME.onSurface, letterSpacing: -0.5 },
    headerLogoBold: { fontWeight: '800', color: THEME.primary },
    closeBtn: { padding: 4 },

    scrollContent: { flexGrow: 1 },

    // 2. 'Airy Growth' Immersive Hero
    heroContainer: { 
        height: 480, // Extended height for total immersion including status bar
        width: '100%',
        backgroundColor: '#FFFFFF',
    },
    heroLottie: { flex: 1, width: '100%' },
    heroGradient: { 
        position: 'absolute', left: 0, right: 0, bottom: 0, 
        height: '80%', // Smooth massive wash
    },
    heroTextContent: { position: 'absolute', bottom: 80, left: 32, right: 32, zIndex: 2 },
    heroLabel: { 
        fontSize: 10, 
        fontWeight: '800', 
        color: THEME.onSurfaceVariant, 
        letterSpacing: 2.0,
        marginBottom: 8,
    },
    heroTitle: { 
        fontSize: 28, 
        fontWeight: '800', 
        color: THEME.onSurface, 
        letterSpacing: -0.5,
        lineHeight: 34,
    },

    // 3. Form Area
    formArea: { paddingHorizontal: 32, marginTop: -20 }, // Slight overlap for depth
    textHeader: { marginBottom: 40 },
    title: { 
        fontSize: 36, 
        fontWeight: '800', 
        color: THEME.onSurface, 
        marginBottom: 8, 
        letterSpacing: -1.2,
    },
    subtitle: { 
        fontSize: 16, 
        color: THEME.onSurfaceVariant, 
        lineHeight: 24,
        fontWeight: '500',
    },

    // Form
    form: { gap: 8 },
    inputGroup: { marginBottom: 32, position: 'relative' },
    label: { 
        fontSize: 10, 
        fontWeight: '800', 
        color: THEME.onSurfaceVariant, 
        marginBottom: 10, 
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    forgotLink: { fontSize: 10, fontWeight: '800', color: THEME.onSurfaceVariant },
    input: { 
        borderBottomWidth: 1.5, 
        borderBottomColor: '#E2E8F0', 
        paddingVertical: 12, 
        fontSize: 18, 
        color: THEME.onSurface,
        fontWeight: '400',
    },
    focusLine: { position: 'absolute', bottom: 0, left: 0, height: 2, backgroundColor: THEME.primary, zIndex: 2 },

    errorText: { color: '#E53E3E', fontSize: 13, marginBottom: 16, textAlign: 'center', fontWeight: '600' },
    pillBtn: { 
        backgroundColor: THEME.primary, 
        paddingVertical: 20, 
        borderRadius: 100, 
        alignItems: 'center', 
        marginTop: 16,
    },
    pillBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12, letterSpacing: 1.5 },

    socialDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: 32, gap: 16 },
    line: { flex: 1, height: 1, backgroundColor: THEME.outline },
    dividerText: { fontSize: 9, fontWeight: '800', color: '#BCC2CD', letterSpacing: 1.0 },
    
    socialRow: { flexDirection: 'row', gap: 16 },
    socialBtn: { 
        flex: 1, 
        flexDirection: 'row', 
        backgroundColor: '#FFFFFF', 
        paddingVertical: 16, 
        borderRadius: 12, 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 12,
        borderWidth: 1,
        borderColor: THEME.outline,
    },
    socialIcon: { width: 20, height: 20, resizeMode: 'contain' },
    socialBtnText: { color: THEME.onSurface, fontWeight: '800', fontSize: 13 },

    footer: { marginTop: 40, alignItems: 'center' },
    footerText: { color: THEME.onSurfaceVariant, fontSize: 15, fontWeight: '500' },
    joinText: { color: THEME.primary, fontWeight: '800' },
});
