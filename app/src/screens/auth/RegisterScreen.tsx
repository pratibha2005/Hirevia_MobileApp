import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Alert, Image
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
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
    const [resume, setResume] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

            const res = await fetch(`${API_BASE_URL}/api/auth/register/applicant`, {
                method: 'POST',
                body: formData,
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
                            <Text style={styles.label}>RESUME (OPTIONAL)</Text>
                            <TouchableOpacity
                                style={styles.resumeButton}
                                onPress={handlePickResume}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="document-attach" size={24} color={resume ? THEME.primary : THEME.textMuted} />
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.resumeButtonText, resume && { color: THEME.primary }]}>
                                        {resume ? resume.name : 'Upload Resume'}
                                    </Text>
                                    {resume && <Text style={styles.resumeSize}>{(resume.size! / 1024).toFixed(0)} KB</Text>}
                                </View>
                                {resume && (
                                    <TouchableOpacity onPress={() => setResume(null)}>
                                        <Ionicons name="close-circle" size={24} color={THEME.textMuted} />
                                    </TouchableOpacity>
                                )}
                            </TouchableOpacity>
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
    linkHighlight: { color: THEME.primary, fontWeight: '700' },
    resumeButton: { backgroundColor: THEME.surface, borderWidth: 1, borderColor: THEME.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', gap: 12 },
    resumeButtonText: { fontSize: 16, color: THEME.textMuted, fontWeight: '500' },
    resumeSize: { fontSize: 12, color: THEME.textMuted, marginTop: 2 }
});
