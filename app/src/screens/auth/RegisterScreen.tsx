import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Alert
} from 'react-native';
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

export default function RegisterScreen({ navigation }: any) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!fullName || !email || !password) {
            setError('Full name, email and password are required.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register/applicant`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: fullName, email, phone, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Registration failed.');
            } else {
                Alert.alert('Account Created', `Welcome, ${data.user.name}!`);
                navigation.navigate('Login');
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
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <View style={styles.header}>
                        <Text style={styles.logo}>Hirevia</Text>
                        <Text style={styles.subtitle}>Find your next opportunity</Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.title}>Create Applicant Account</Text>
                        <Text style={styles.description}>Join Hirevia to discover and apply for jobs.</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>FULL NAME</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="John Doe"
                                placeholderTextColor="#A0AEC0"
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>EMAIL ADDRESS</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="you@email.com"
                                placeholderTextColor="#A0AEC0"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>PHONE (OPTIONAL)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="+1 234 567 8900"
                                placeholderTextColor="#A0AEC0"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
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
                            onPress={handleRegister}
                        >
                            {loading ? (
                                <ActivityIndicator color={THEME.primaryForeground} />
                            ) : (
                                <Text style={styles.buttonText}>Create Account</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkContainer}>
                            <Text style={styles.linkText}>Already have an account? <Text style={styles.linkHighlight}>Sign In</Text></Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: THEME.background },
    container: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 32, justifyContent: 'center' },
    header: { marginBottom: 32, alignItems: 'flex-start' },
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
