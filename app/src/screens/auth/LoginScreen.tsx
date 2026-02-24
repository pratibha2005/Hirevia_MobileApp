import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../api/config';

const THEME = {
    primary: '#0F4C5C',
    primaryForeground: '#FFFFFF',
    accent: '#E2725B',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#12171A',
    textMuted: '#4A5568',
    border: '#E2E8F0',
    radius: 6,
};

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.header}>
                    <Image source={require('../../../assets/images/Logo.jpg')} style={styles.logoImage} />
                    <View>
                        <Text style={styles.logo}>Hirevia</Text>
                        <Text style={styles.subtitle}>Applicant Portal</Text>
                    </View>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.title}>Welcome back</Text>
                    <Text style={styles.description}>Sign in to track and manage your applications.</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>EMAIL</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="you@company.com"
                            placeholderTextColor="#A0AEC0"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>PASSWORD</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#A0AEC0"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.8}
                        onPress={handleLogin}
                    >
                        {loading ? (
                            <ActivityIndicator color={THEME.primaryForeground} />
                        ) : (
                            <Text style={styles.buttonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkContainer}>
                        <Text style={styles.linkText}>New to Hirevia? <Text style={styles.linkHighlight}>Create Account</Text></Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: THEME.background },
    container: { flex: 1, paddingHorizontal: 32, justifyContent: 'center' },
    header: { marginBottom: 64, flexDirection: 'row', alignItems: 'center', gap: 16 },
    logoImage: { width: 56, height: 56, borderRadius: 12 },
    logo: { fontSize: 28, fontWeight: '800', color: THEME.primary, letterSpacing: -0.5 },
    subtitle: { fontSize: 13, color: THEME.textMuted, marginTop: 2, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
    formContainer: { width: '100%' },
    title: { fontSize: 32, fontWeight: '800', color: THEME.text, marginBottom: 8, letterSpacing: -1 },
    description: { fontSize: 15, color: THEME.textMuted, marginBottom: 40, lineHeight: 22 },
    inputGroup: { marginBottom: 24 },
    label: { fontSize: 12, fontWeight: '700', color: THEME.textMuted, marginBottom: 8, letterSpacing: 1 },
    input: { backgroundColor: THEME.surface, borderWidth: 1, borderColor: THEME.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 18, fontSize: 16, color: THEME.text, fontWeight: '500', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
    errorText: { color: '#E53E3E', fontSize: 14, marginBottom: 16, fontWeight: '500' },
    button: { backgroundColor: THEME.primary, paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 16, shadowColor: THEME.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
    buttonText: { color: THEME.primaryForeground, fontWeight: '700', fontSize: 16, letterSpacing: 0.5 },
    linkContainer: { marginTop: 32, alignItems: 'center' },
    linkText: { color: THEME.textMuted, fontSize: 15 },
    linkHighlight: { color: THEME.primary, fontWeight: '700' }
});
