import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

// ─── Design System ────────────────────────────────────────────────────────────
const THEME = {
  primary:        '#4F46E5',
  primaryLight:   '#EEF2FF',
  secondary:      '#06B6D4',
  background:     '#F8FAFC',
  surface:        '#FFFFFF',
  surfaceLow:     '#F1F5F9',
  text:           '#111827',
  textMuted:      '#6B7280',
  textSubtle:     '#9CA3AF',
  border:         '#E5E7EB',
  success:        '#22C55E',
  successLight:   '#F0FDF4',
};

export default function JobDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const job = route.params?.job;

  if (!job) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color={THEME.text} />
          </TouchableOpacity>
        </View>
        <Text style={styles.errorText}>Job data not found.</Text>
      </SafeAreaView>
    );
  }

  const skills: string[] = job.tags || job.skills || [];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color={THEME.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkBtn}>
          <Ionicons name="bookmark-outline" size={20} color={THEME.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Company hero */}
        <View style={styles.hero}>
          <View style={styles.companyLogoWrapper}>
            <Text style={styles.companyLogoText}>{(job.company || 'C').charAt(0)}</Text>
          </View>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.companyName}>{job.company}</Text>

          {/* Meta chips */}
          <View style={styles.metaRow}>
            {[
              { icon: 'location-outline', text: job.location },
              { icon: 'time-outline', text: job.type || 'Full-time' },
              job.salary && { icon: 'cash-outline', text: job.salary },
            ].filter(Boolean).map((m: any, i) => (
              <View key={i} style={styles.metaChip}>
                <Ionicons name={m.icon} size={13} color={THEME.textMuted} />
                <Text style={styles.metaText}>{m.text}</Text>
              </View>
            ))}
          </View>

          {/* Match badge */}
          {job.matchScore && (
            <View style={styles.matchBadge}>
              <Ionicons name="flash" size={13} color={THEME.success} />
              <Text style={styles.matchText}>{job.matchScore}% profile match</Text>
            </View>
          )}
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Experience', value: '3-5 yrs', icon: 'briefcase-outline' },
            { label: 'Team size', value: '20-50', icon: 'people-outline' },
            { label: 'Posted', value: '2 days ago', icon: 'calendar-outline' },
          ].map((s, i) => (
            <View key={i} style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name={s.icon as any} size={16} color={THEME.primary} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Skills required */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills Required</Text>
            <View style={styles.skillsRow}>
              {skills.map((s, i) => (
                <View key={i} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* About the role */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Role</Text>
          <Text style={styles.paragraph}>
            {job.description ||
              `As a ${job.title} at ${job.company}, you will play a key role in delivering high-quality work that has real impact on our business and users. You'll collaborate with a world-class team and work on meaningful challenges every day.`}
          </Text>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {[
            `${skills[0] || 'Relevant experience'} proficiency required`,
            'Strong communication and collaboration skills',
            'Ability to work in a fast-paced environment',
            'Portfolio or work samples preferred',
          ].map((req, i) => (
            <View key={i} style={styles.requirementRow}>
              <View style={styles.requirementDot} />
              <Text style={styles.requirementText}>{req}</Text>
            </View>
          ))}
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What we offer</Text>
          <View style={styles.benefitsGrid}>
            {[
              { icon: 'home-outline', text: 'Remote Friendly' },
              { icon: 'medkit-outline', text: 'Health Benefits' },
              { icon: 'school-outline', text: 'Learning Budget' },
              { icon: 'airplane-outline', text: 'Paid Time Off' },
            ].map((b, i) => (
              <View key={i} style={styles.benefitCard}>
                <View style={styles.benefitIcon}>
                  <Ionicons name={b.icon as any} size={18} color={THEME.primary} />
                </View>
                <Text style={styles.benefitText}>{b.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveBtn} onPress={() => {}}>
          <Ionicons name="bookmark-outline" size={20} color={THEME.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('ApplyFlow', { job })}
        >
          <Text style={styles.applyBtnText}>Apply Now</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: THEME.background },

  // Header
  headerBar:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 4, paddingBottom: 8 },
  backBtn:            { width: 40, height: 40, borderRadius: 12, backgroundColor: THEME.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  bookmarkBtn:        { width: 40, height: 40, borderRadius: 12, backgroundColor: THEME.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: THEME.border },
  errorText:          { textAlign: 'center', marginTop: 120, color: THEME.textMuted, fontSize: 16 },

  // Scroll
  scrollContent:      { paddingHorizontal: 20, paddingTop: 8 },

  // Hero
  hero:               { alignItems: 'flex-start', marginBottom: 24 },
  companyLogoWrapper: { width: 60, height: 60, borderRadius: 16, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: THEME.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  companyLogoText:    { fontSize: 24, fontWeight: '800', color: '#FFF' },
  jobTitle:           { fontSize: 24, fontWeight: '800', color: THEME.text, letterSpacing: -0.5, marginBottom: 4 },
  companyName:        { fontSize: 15, fontWeight: '600', color: THEME.primary, marginBottom: 14 },
  metaRow:            { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  metaChip:           { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: THEME.surface, borderWidth: 1, borderColor: THEME.border },
  metaText:           { fontSize: 12, color: THEME.textMuted, fontWeight: '500' },
  matchBadge:         { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: THEME.successLight, borderWidth: 1, borderColor: THEME.success + '30' },
  matchText:          { fontSize: 12, color: THEME.success, fontWeight: '700' },

  // Stats
  statsRow:           { flexDirection: 'row', backgroundColor: THEME.surface, borderRadius: 16, borderWidth: 1, borderColor: THEME.border, marginBottom: 24, overflow: 'hidden' },
  statItem:           { flex: 1, alignItems: 'center', paddingVertical: 14, borderRightWidth: 1, borderRightColor: THEME.border },
  statIcon:           { width: 32, height: 32, borderRadius: 8, backgroundColor: THEME.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  statValue:          { fontSize: 13, fontWeight: '700', color: THEME.text, marginBottom: 2 },
  statLabel:          { fontSize: 10, color: THEME.textSubtle, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.3 },

  // Sections
  section:            { marginBottom: 24 },
  sectionTitle:       { fontSize: 16, fontWeight: '700', color: THEME.text, marginBottom: 12, letterSpacing: -0.2 },

  // Skills
  skillsRow:          { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  skillBadge:         { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: THEME.primaryLight, borderWidth: 1, borderColor: THEME.primary + '25' },
  skillText:          { fontSize: 12, fontWeight: '700', color: THEME.primary },

  // Paragraph
  paragraph:          { fontSize: 14, lineHeight: 22, color: '#4B5563', fontWeight: '400' },

  // Requirements
  requirementRow:     { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  requirementDot:     { width: 5, height: 5, borderRadius: 3, backgroundColor: THEME.primary, marginTop: 7, flexShrink: 0 },
  requirementText:    { flex: 1, fontSize: 14, color: THEME.textMuted, lineHeight: 20 },

  // Benefits
  benefitsGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  benefitCard:        { width: '47%', backgroundColor: THEME.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: THEME.border, alignItems: 'flex-start', gap: 8 },
  benefitIcon:        { width: 36, height: 36, borderRadius: 10, backgroundColor: THEME.primaryLight, justifyContent: 'center', alignItems: 'center' },
  benefitText:        { fontSize: 12, fontWeight: '600', color: THEME.text },

  // Bottom bar
  bottomBar:          { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 32, backgroundColor: THEME.surface, borderTopWidth: 1, borderTopColor: THEME.border },
  saveBtn:            { width: 48, height: 48, borderRadius: 14, backgroundColor: THEME.primaryLight, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: THEME.primary + '30' },
  applyBtn:           { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: THEME.primary, paddingVertical: 14, borderRadius: 14, shadowColor: THEME.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  applyBtnText:       { color: '#FFF', fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
});
