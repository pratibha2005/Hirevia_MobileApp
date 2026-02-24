import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Alert, Image
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
                        <Image source={require('../../../assets/images/Logo.jpg')} style={styles.logoImage} />
                        <View>
                            <Text style={styles.logo}>Hirevia</Text>
                            <Text style={styles.subtitle}>Applicant Portal</Text>
                        </View>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Create Account</Text>
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
                                <Text style={styles.buttonText}>Register</Text>
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
    container: { flexGrow: 1, paddingHorizontal: 32, paddingVertical: 48, justifyContent: 'center' },
    header: { marginBottom: 48, flexDirection: 'row', alignItems: 'center', gap: 16 },
    logoImage: { width: 48, height: 48, borderRadius: 12 },
    logo: { fontSize: 26, fontWeight: '800', color: THEME.primary, letterSpacing: -0.5 },
    subtitle: { fontSize: 12, color: THEME.textMuted, marginTop: 2, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
    formContainer: { width: '100%' },
    title: { fontSize: 32, fontWeight: '800', color: THEME.text, marginBottom: 8, letterSpacing: -1 },
    description: { fontSize: 15, color: THEME.textMuted, marginBottom: 32, lineHeight: 22 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 12, fontWeight: '700', color: THEME.textMuted, marginBottom: 8, letterSpacing: 1 },
    input: { backgroundColor: THEME.surface, borderWidth: 1, borderColor: THEME.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 18, fontSize: 16, color: THEME.text, fontWeight: '500', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
    errorText: { color: '#E53E3E', fontSize: 14, marginBottom: 16, fontWeight: '500' },
    button: { backgroundColor: THEME.primary, paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 12, shadowColor: THEME.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
    buttonText: { color: THEME.primaryForeground, fontWeight: '700', fontSize: 16, letterSpacing: 0.5 },
    linkContainer: { marginTop: 32, alignItems: 'center' },
    linkText: { color: THEME.textMuted, fontSize: 15 },
    linkHighlight: { color: THEME.primary, fontWeight: '700' }
});
