import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const THEME = {
    primary: '#0F4C5C',
    primaryForeground: '#FFFFFF',
    accent: '#E2725B',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: '#12171A',
    textMuted: '#6B7280',
    border: '#E5E7EB',
};

export default function ProfileScreen() {
    const navigation = useNavigation<any>();
    const [user, setUser] = useState<{ name?: string, email?: string } | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (e) {
                console.error("Failed to load user data", e);
            }
        };
        loadUser();
    }, []);

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.removeItem('token');
                        await AsyncStorage.removeItem('user');
                        navigation.replace('Login');
                    }
                }
            ]
        );
    };

    const renderSettingItem = (icon: any, title: string, value?: string, isDestructive = false) => (
        <TouchableOpacity style={styles.settingItem}>
            <View style={[styles.settingIcon, isDestructive && { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name={icon} size={20} color={isDestructive ? '#EF4444' : THEME.primary} />
            </View>
            <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, isDestructive && { color: '#EF4444' }]}>{title}</Text>
                {value && <Text style={styles.settingValue}>{value}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDestructive ? '#EF4444' : THEME.textMuted} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'A'}</Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.userName}>{user?.name || 'Alex Johnson'}</Text>
                        <Text style={styles.userEmail}>{user?.email || 'alex@example.com'}</Text>
                    </View>
                    <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Resume & Portfolio</Text>
                    <View style={styles.settingsCard}>
                        {renderSettingItem('document-text', 'Manage Resume', 'Alex_Johnson_Resume_2023.pdf')}
                        <View style={styles.divider} />
                        {renderSettingItem('globe', 'Portfolio Link', 'alexjohnson.dev')}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <View style={styles.settingsCard}>
                        {renderSettingItem('notifications', 'Notifications')}
                        <View style={styles.divider} />
                        {renderSettingItem('lock-closed', 'Privacy & Security')}
                        <View style={styles.divider} />
                        {renderSettingItem('help-circle', 'Help & Support')}
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color="#EF4444" style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Hirevia v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.background },
    header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16, backgroundColor: THEME.surface, borderBottomWidth: 1, borderBottomColor: THEME.border },
    headerTitle: { fontSize: 26, fontWeight: '800', color: THEME.text, letterSpacing: -0.5 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 60 },
    profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.surface, borderRadius: 20, padding: 20, marginBottom: 32, borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
    avatarContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    avatarText: { fontSize: 26, fontWeight: '700', color: THEME.primaryForeground },
    profileInfo: { flex: 1 },
    userName: { fontSize: 18, fontWeight: '800', color: THEME.text, marginBottom: 4, letterSpacing: -0.3 },
    userEmail: { fontSize: 14, color: THEME.textMuted },
    editButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6' },
    editButtonText: { fontSize: 13, fontWeight: '700', color: THEME.text },
    section: { marginBottom: 32 },
    sectionTitle: { fontSize: 14, fontWeight: '800', color: THEME.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, marginLeft: 8 },
    settingsCard: { backgroundColor: THEME.surface, borderRadius: 20, borderWidth: 1, borderColor: THEME.border, overflow: 'hidden' },
    settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    settingIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#EDF2F7', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    settingTextContainer: { flex: 1 },
    settingTitle: { fontSize: 16, fontWeight: '600', color: THEME.text },
    settingValue: { fontSize: 13, color: THEME.textMuted, marginTop: 4 },
    divider: { height: 1, backgroundColor: THEME.border, marginLeft: 72 },
    logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2', paddingVertical: 18, borderRadius: 16, marginTop: 16, borderWidth: 1, borderColor: '#FEE2E2' },
    logoutText: { fontSize: 16, fontWeight: '700', color: '#EF4444' },
    versionText: { textAlign: 'center', marginTop: 32, fontSize: 13, color: '#9CA3AF', fontWeight: '500' }
});
