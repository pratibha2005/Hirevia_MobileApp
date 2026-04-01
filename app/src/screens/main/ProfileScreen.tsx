import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// ─── Design System ────────────────────────────────────────────────────────────
const THEME = {
  primary:        '#4F46E5',
  primaryLight:   '#EEF2FF',
  primaryDark:    '#4338CA',
  secondary:      '#06B6D4',
  background:     '#F8FAFC',
  surface:        '#FFFFFF',
  surfaceLow:     '#F1F5F9',
  text:           '#111827',
  textMuted:      '#6B7280',
  textSubtle:     '#9CA3AF',
  border:         '#E5E7EB',
  danger:         '#EF4444',
  dangerLight:    '#FEF2F2',
  success:        '#22C55E',
  successLight:   '#F0FDF4',
};

// ─── Setting Item ─────────────────────────────────────────────────────────────
function SettingItem({
  icon, title, value, isDestructive = false, rightElement
}: {
  icon: any; title: string; value?: string; isDestructive?: boolean; rightElement?: React.ReactNode;
}) {
  return (
    <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
      <View style={[styles.settingIcon, isDestructive && { backgroundColor: THEME.dangerLight }]}>
        <Ionicons name={icon} size={18} color={isDestructive ? THEME.danger : THEME.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, isDestructive && { color: THEME.danger }]}>{title}</Text>
        {value && <Text style={styles.settingValue} numberOfLines={1}>{value}</Text>}
      </View>
      {rightElement || (
        <Ionicons name="chevron-forward" size={16} color={isDestructive ? THEME.danger + '80' : THEME.textSubtle} />
      )}
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [stats] = useState({ applied: 8, interviews: 3, offers: 1 });

  useEffect(() => {
    AsyncStorage.getItem('user').then(u => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.multiRemove(['token', 'user']);
          navigation.replace('Login');
        },
      },
    ]);
  };

  const name = user?.name || 'Alex Johnson';
  const email = user?.email || 'alex@example.com';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsIconBtn}>
            <Ionicons name="settings-outline" size={20} color={THEME.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarRing}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={12} color={THEME.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.profileEmail}>{email}</Text>

          <TouchableOpacity style={styles.editProfileBtn}>
            <Ionicons name="pencil" size={14} color={THEME.primary} style={{ marginRight: 6 }} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>

          {/* Stats row */}
          <View style={styles.statsRow}>
            {[
              { label: 'Applied', value: stats.applied, icon: 'document-text-outline' },
              { label: 'Interviews', value: stats.interviews, icon: 'videocam-outline' },
              { label: 'Offers', value: stats.offers, icon: 'trophy-outline' },
            ].map((s, i) => (
              <View key={i} style={[styles.statItem, i < 2 && styles.statItemBorder]}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Resume section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resume & Portfolio</Text>
          <View style={styles.settingsCard}>
            <SettingItem
              icon="document-text"
              title="My Resume"
              value="Alex_Johnson_Resume.pdf · Updated 3 days ago"
              rightElement={
                <View style={styles.uploadBtn}>
                  <Ionicons name="cloud-upload-outline" size={14} color={THEME.primary} />
                  <Text style={styles.uploadText}>Update</Text>
                </View>
              }
            />
            <View style={styles.divider} />
            <SettingItem icon="globe-outline" title="Portfolio Website" value="alexjohnson.dev" />
            <View style={styles.divider} />
            <SettingItem icon="logo-linkedin" title="LinkedIn Profile" value="linkedin.com/in/alexjohnson" />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Preferences</Text>
          <View style={styles.settingsCard}>
            <SettingItem icon="briefcase-outline" title="Desired Role" value="Product Designer · Frontend Engineer" />
            <View style={styles.divider} />
            <SettingItem icon="cash-outline" title="Expected Salary" value="$80K – $120K" />
            <View style={styles.divider} />
            <SettingItem icon="location-outline" title="Preferred Location" value="Remote · NYC · SF" />
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingsCard}>
            <SettingItem icon="notifications-outline" title="Notifications & Alerts" />
            <View style={styles.divider} />
            <SettingItem icon="lock-closed-outline" title="Privacy & Security" />
            <View style={styles.divider} />
            <SettingItem icon="help-circle-outline" title="Help & Support" />
            <View style={styles.divider} />
            <SettingItem icon="star-outline" title="Rate HireVia" />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={18} color={THEME.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>HireVia v1.0.0 · Candidate Edition</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: THEME.background },
  scrollContent:      { paddingBottom: 100 },

  // Header
  header:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },
  headerTitle:        { fontSize: 24, fontWeight: '800', color: THEME.text, letterSpacing: -0.4 },
  settingsIconBtn:    { width: 40, height: 40, borderRadius: 12, backgroundColor: THEME.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: THEME.border },

  // Profile card
  profileCard:        { marginHorizontal: 16, backgroundColor: THEME.surface, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: THEME.border, alignItems: 'center', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 },
  avatarWrapper:      { position: 'relative', marginBottom: 16 },
  avatarRing:         { width: 84, height: 84, borderRadius: 42, padding: 3, borderWidth: 2, borderColor: THEME.primary + '40', backgroundColor: THEME.primaryLight },
  avatar:             { flex: 1, borderRadius: 36, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center', shadowColor: THEME.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  avatarText:         { fontSize: 26, fontWeight: '800', color: '#FFF', letterSpacing: -0.5 },
  editAvatarBtn:      { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: THEME.primaryLight, borderWidth: 2, borderColor: THEME.surface, justifyContent: 'center', alignItems: 'center' },
  profileName:        { fontSize: 20, fontWeight: '800', color: THEME.text, letterSpacing: -0.4, marginBottom: 4 },
  profileEmail:       { fontSize: 13, color: THEME.textMuted, marginBottom: 14 },
  editProfileBtn:     { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: THEME.primaryLight, borderWidth: 1, borderColor: THEME.primary + '30', marginBottom: 20 },
  editProfileText:    { fontSize: 13, fontWeight: '700', color: THEME.primary },
  statsRow:           { flexDirection: 'row', width: '100%', backgroundColor: THEME.surfaceLow, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: THEME.border },
  statItem:           { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statItemBorder:     { borderRightWidth: 1, borderRightColor: THEME.border },
  statValue:          { fontSize: 20, fontWeight: '800', color: THEME.primary, letterSpacing: -0.4 },
  statLabel:          { fontSize: 10, color: THEME.textSubtle, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 },

  // Sections
  section:            { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle:       { fontSize: 11, fontWeight: '700', color: THEME.textSubtle, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginLeft: 4 },
  settingsCard:       { backgroundColor: THEME.surface, borderRadius: 16, borderWidth: 1, borderColor: THEME.border, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },

  // Setting item
  settingItem:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  settingIcon:        { width: 36, height: 36, borderRadius: 10, backgroundColor: THEME.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 14, flexShrink: 0 },
  settingContent:     { flex: 1, marginRight: 8 },
  settingTitle:       { fontSize: 14, fontWeight: '600', color: THEME.text },
  settingValue:       { fontSize: 12, color: THEME.textMuted, marginTop: 2 },
  uploadBtn:          { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: THEME.primaryLight, borderWidth: 1, borderColor: THEME.primary + '30' },
  uploadText:         { fontSize: 11, fontWeight: '700', color: THEME.primary },
  divider:            { height: 1, backgroundColor: THEME.border, marginLeft: 66 },

  // Logout
  logoutBtn:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, paddingVertical: 16, borderRadius: 16, backgroundColor: THEME.dangerLight, borderWidth: 1, borderColor: THEME.danger + '20', marginBottom: 16 },
  logoutText:         { fontSize: 15, fontWeight: '700', color: THEME.danger },

  // Version
  version:            { textAlign: 'center', fontSize: 12, color: THEME.textSubtle, paddingBottom: 8 },
});
