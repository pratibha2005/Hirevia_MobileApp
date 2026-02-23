import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, Alert } from 'react-native';
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
                Alert.alert('Welcome back', data.user.name);
                // TODO: save token & navigate to main app
            }
        } catch (err) {
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
                    <Text style={styles.logo}>Hirevia</Text>
                    <Text style={styles.subtitle}>Find your next opportunity</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.title}>Applicant Sign In</Text>
                    <Text style={styles.description}>Sign in to track and manage your job applications.</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>EMAIL ADDRESS</Text>
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
                            <Text style={styles.buttonText}>Authenticate</Text>
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
    container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
    header: { marginBottom: 48, alignItems: 'flex-start' },
    logo: { fontSize: 28, fontWeight: '800', color: THEME.primary, letterSpacing: -0.5 },
    subtitle: { fontSize: 14, color: THEME.textMuted, marginTop: 4, fontWeight: '500' },
    form: { backgroundColor: THEME.surface, padding: 32, borderRadius: THEME.radius, borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
    title: { fontSize: 24, fontWeight: '700', color: THEME.text, marginBottom: 8, letterSpacing: -0.5 },
    description: { fontSize: 14, color: THEME.textMuted, marginBottom: 24, lineHeight: 20 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 11, fontWeight: '700', color: THEME.textMuted, marginBottom: 8, letterSpacing: 0.5 },
    input: { backgroundColor: THEME.background, borderWidth: 1, borderColor: THEME.border, borderRadius: THEME.radius, padding: 14, fontSize: 15, color: THEME.text, fontWeight: '500' },
    errorText: { color: '#E53E3E', fontSize: 13, marginBottom: 8, textAlign: 'center' },
    button: { backgroundColor: THEME.primary, paddingVertical: 16, borderRadius: THEME.radius, alignItems: 'center', marginTop: 8 },
    buttonText: { color: THEME.primaryForeground, fontWeight: '600', fontSize: 15, letterSpacing: 0.5 },
    linkContainer: { marginTop: 24, alignItems: 'center' },
    linkText: { color: THEME.textMuted, fontSize: 14 },
    linkHighlight: { color: THEME.primary, fontWeight: '600' }
});
