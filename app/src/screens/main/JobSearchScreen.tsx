import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '../../api/config';

const { width } = Dimensions.get('window');

// ─── Design Tokens (exact from Stitch HTML) ──────────────────────────────────
const C = {
  background:        '#f7f9fb',
  surface:           '#f7f9fb',
  surfaceContLow:    '#f0f4f7',
  surfaceContHigh:   '#e1e9ee',
  surfaceContHighest:'#d9e4ea',
  surfaceContLowest: '#ffffff',
  primary:           '#4e5a9a',
  onSurface:         '#2a3439',
  onSurfaceVariant:  '#566166',
  outline:           '#717c82',
  outlineVariant:    '#a9b4b9',
  error:             '#9e3f4e',
  indigo900:         '#1e3a5f',
};

// ─── Hero Image (greyscale architectural office) ──────────────────────────────
const HERO_IMAGE_URL = 'https://images.unsplash.com/photo-1496664444929-8c75efb9546f?q=80&w=2600&auto=format&fit=crop';
const PROFILE_IMAGE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu12O0WF6K7j9spHvj3GeSQ94b8G0qi_4i0816EtExlHTRCPjRx6Z47IvvykmLBJ4MkV3g29kgpyTCa_5CwZc7RC5Io0P31yDCMGqrwx15__WbtLTPtt_PesexFugkmvINnNWn_zLZwvHR2p4UYBP5zF7BHEa61425v6Gl8Ci3DfLGbib125lCbQaFKp1CyNSiZM9LSGaKRWtkTc8_bcwhRhwfSIgvWbDRk5oQoBlwjE4xRJo1_nsIfAe5mhQvzbCR0IW2rjRW6zYS';

const ROLE_TABS = ['ALL ROLES', 'REMOTE', 'DESIGN', 'LEADERSHIP'];
const FILTER_CHIPS = ['Remote', 'Full-Time', 'Internship', 'Salary'];

interface JobEntry {
  id: string;
  icon: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  badge?: { label: string; type: 'new' | 'closing' };
  sub?: string;
  type?: string;
  description?: string;
}

// ─── Job Entry Row — exact replica of Stitch HTML layout ─────────────────────
function JobRow({ job, isLast, onPress }: { job: JobEntry; isLast: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[styles.entry, !isLast && styles.entryBorder]}
      onPress={onPress}
    >
      <View style={styles.entryLeft}>
        <View style={styles.entryIconBox}>
          <Ionicons name={job.icon as any} size={22} color={C.outline} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.entryTitleRow}>
            <Text style={styles.entryTitle}>{job.title}</Text>
            {job.badge && (
              <View style={job.badge.type === 'new' ? styles.badgeNew : styles.badgeClose}>
                <Text style={job.badge.type === 'new' ? styles.badgeNewText : styles.badgeCloseText}>
                  {job.badge.label}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.entryMeta}>{job.company} · {job.location}</Text>
        </View>
      </View>
      <View style={styles.entryRight}>
        <Text style={styles.entrySalary}>{job.salary}</Text>
        {job.sub && <Text style={styles.entrySub}>{job.sub}</Text>}
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function JobSearchScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState(0);
  const [activeChip, setActiveChip] = useState<number | null>(null);
  const [jobs, setJobs] = useState<JobEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs.map((j: any) => ({
          id: j._id,
          icon: j.type === 'Remote' ? 'earth-outline' : 'briefcase-outline',
          title: j.title,
          company: j.companyId?.name || 'Studio Arkhos',
          location: j.location,
          salary: j.salary || '$120k — $150k',
          type: j.type,
          badge: j.isNew ? { label: 'NEW', type: 'new' } : undefined,
          description: j.description || '',
          screeningQuestions: j.screeningQuestions || [],
        })));
      }
    } catch (e) {
      console.error('Failed to fetch jobs', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchJobs(); }, []));

  const filteredJobs = jobs.filter(job => {
    const tabName = ROLE_TABS[activeTab];
    if (tabName === 'ALL ROLES') return true;
    if (tabName === 'REMOTE') return job.type === 'Remote';
    if (tabName === 'DESIGN') return job.title.toLowerCase().includes('design') || job.title.toLowerCase().includes('creative');
    if (tabName === 'LEADERSHIP') return job.title.toLowerCase().includes('lead') || job.title.toLowerCase().includes('principal') || job.title.toLowerCase().includes('vp');
    return true;
  });

  const featuredJob = jobs[0] || null;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.background} />

      {/* ── Fixed Header (TopAppBar) ── */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerInner}>
          {/* Left: profile + title */}
          <View style={styles.headerLeft}>
            <View style={styles.profileAvatar}>
              <Image
                source={{ uri: PROFILE_IMAGE_URL }}
                style={styles.profileAvatarImg}
              />
            </View>
            <Text style={styles.headerTitle}>ARCHIVE</Text>
          </View>
          {/* Right: icons */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconBtn}>
              <Ionicons name="search" size={20} color={C.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconBtn}>
              <Ionicons name="options-outline" size={20} color={C.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* ── Scrollable content ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchJobs(true)} tintColor={C.primary} />
        }
      >
        {/* ── Hero: Pure Minimalist Pivot (Stitch-Aligned) ── */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: HERO_IMAGE_URL }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          <LinearGradient
            colors={['transparent', 'rgba(247, 249, 251, 0.2)', 'rgba(247, 249, 251, 0.8)', '#f7f9fb']}
            style={styles.heroBottomGradient}
          />

          <View style={styles.heroContent} pointerEvents="box-none">
            <View style={styles.heroHeader}>
              <View style={styles.heroEyebrow}>
                <View style={styles.heroEyebrowLine} />
                <Text style={styles.heroEyebrowText}>FEATURED PLACEMENT</Text>
              </View>
              <Text style={styles.heroTitle}>
                {featuredJob ? featuredJob.title.split(' ').slice(0, -1).join(' ') + ' ' : 'Senior Creative '}
                <Text style={styles.heroTitleBold}>{featuredJob ? featuredJob.title.split(' ').slice(-1) : 'Strategist'}</Text>
              </Text>
            </View>

            <View style={styles.heroMetaContent}>
              <View style={styles.heroMetaRow}>
                <Text style={styles.heroMetaLabel}>COMPANY</Text>
                <Text style={styles.heroMetaValueIndigo}>{featuredJob?.company || 'Studio Arkhos'}</Text>
              </View>
              <View style={styles.heroMetaRow}>
                <Text style={styles.heroMetaLabel}>LOCATION</Text>
                <Text style={styles.heroMetaValue}>{featuredJob?.location || 'Copenhagen / Remote'}</Text>
              </View>
              <View style={styles.heroMetaRow}>
                <Text style={styles.heroMetaLabel}>REMUNERATION</Text>
                <Text style={styles.heroMetaValue}>{featuredJob?.salary || '$185k — $230k'}</Text>
              </View>
              <TouchableOpacity 
                style={styles.heroBtn} 
                activeOpacity={0.8}
                onPress={() => featuredJob && navigation.navigate('JobDetails', { job: featuredJob })}
              >
                <Text style={styles.heroBtnText}>VIEW DETAILS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Category Tabs ── */}
        <View style={styles.tabsBorderWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsInner}
          >
            {ROLE_TABS.map((tab, i) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(i)}
                style={[styles.tab, activeTab === i && styles.tabActive]}
              >
                <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Filter Chips ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {FILTER_CHIPS.map((chip, i) => (
            <TouchableOpacity
              key={chip}
              onPress={() => setActiveChip(activeChip === i ? null : i)}
              style={[styles.chip, activeChip === i && styles.chipActive]}
            >
              <Text style={[styles.chipText, activeChip === i && styles.chipTextActive]}>
                {chip.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Recent Entries ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>RECENT ENTRIES</Text>
          <View>
            {loading ? (
              <ActivityIndicator size="large" color={C.primary} style={{ marginTop: 20 }} />
            ) : filteredJobs.length === 0 ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <Text style={{ color: C.onSurfaceVariant, fontSize: 13, fontWeight: '600' }}>No jobs match your filters.</Text>
              </View>
            ) : (
              filteredJobs.map((job, i) => (
                <JobRow 
                  key={job.id} 
                  job={job} 
                  isLast={i === filteredJobs.length - 1} 
                  onPress={() => navigation.navigate('JobDetails', { job })}
                />
              ))
            )}
          </View>
        </View>

        {/* Bottom padding for nav bar */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:               { flex: 1, backgroundColor: C.background },
  scrollContent:      { paddingTop: 0 },

  // Header
  // ── Header — blurring into background for minimalism
  header:             { backgroundColor: 'rgba(247,249,251,0.8)', zIndex: 50 },
  headerInner:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  headerLeft:         { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerRight:        { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profileAvatar:      { width: 32, height: 32, borderRadius: 16, overflow: 'hidden', backgroundColor: C.surfaceContHigh },
  profileAvatarImg:   { width: 32, height: 32 },
  headerTitle:        { fontFamily: 'System', fontSize: 11, fontWeight: '900', letterSpacing: 3.5, color: '#1e3a5f' /* indigo-900 */ },
  headerIconBtn:      { padding: 4 },

  // ── Hero: PURE MINIMALIST LAYOUT ──
  heroSection:        { width: '100%', height: 480, position: 'relative', overflow: 'hidden',
                        backgroundColor: '#f7f9fb' },
  heroImage:          { ...StyleSheet.absoluteFillObject, opacity: 0.60 /* High-contrast texture visible */ },
  heroBottomGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%' },
  heroContent:        { ...StyleSheet.absoluteFillObject,
                        paddingHorizontal: 16, paddingTop: 40, paddingBottom: 24,
                        flexDirection: 'column', justifyContent: 'space-between' },
  heroHeader:         { marginBottom: 20 },

  // Metadata content
  heroMetaContent:    { paddingBottom: 0 },
  heroMetaRow:        { flexDirection: 'column', alignItems: 'flex-start', marginBottom: 12 },
  heroMetaLabel:      { fontSize: 9, fontWeight: '900', letterSpacing: 2.5, color: '#717c82',
                        textTransform: 'uppercase', marginBottom: 2 },
  heroMetaValue:      { fontSize: 15, fontWeight: '700', color: '#2a3439' },
  heroMetaValueIndigo:{ fontSize: 15, fontWeight: '700', color: '#1e3a5f' },

  // Hero text styles
  heroEyebrow:        { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  heroEyebrowLine:    { width: 40, height: 1, backgroundColor: 'rgba(30,58,95,0.2)' },
  heroEyebrowText:    { fontSize: 9, fontWeight: '900', letterSpacing: 4, color: '#1e3a5f',
                        opacity: 0.5, textTransform: 'uppercase' },
  heroTitle:          { fontSize: 32, fontWeight: '200', letterSpacing: -0.8, color: '#2a3439',
                        lineHeight: 38 },
  heroTitleBold:      { fontWeight: '800', fontStyle: 'italic', color: '#2a3439' },
  heroMetaDivider:    { width: 1, height: 32, backgroundColor: 'rgba(169,180,185,0.2)', alignSelf: 'center' },
  heroMetaItem:       {},
  heroBtn:            { alignSelf: 'flex-start', paddingHorizontal: 28, paddingVertical: 12,
                        backgroundColor: '#1e3a5f', borderRadius: 9999, marginTop: 12 },
  heroBtnText:        { fontSize: 9, fontWeight: '900', letterSpacing: 2, color: '#ffffff',
                        textTransform: 'uppercase' },

  // Tabs - pushed lower for better breathing room
  tabsBorderWrap:     { borderBottomWidth: 1, borderBottomColor: 'rgba(169,180,185,0.1)', marginTop: 40, marginBottom: 20 },
  tabsInner:          { paddingHorizontal: 16, gap: 24, flexDirection: 'row' },
  tab:                { paddingBottom: 14, borderBottomWidth: 2, borderBottomColor: 'transparent', marginBottom: -1 },
  tabActive:          { borderBottomColor: C.primary },
  tabText:            { fontSize: 10, fontWeight: '600', letterSpacing: 3.5, color: C.onSurfaceVariant, textTransform: 'uppercase' },
  tabTextActive:      { fontWeight: '800', color: C.primary },

  // Filter chips
  chipsRow:           { paddingHorizontal: 16, gap: 8, flexDirection: 'row', marginBottom: 32 },
  chip:               { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 9999, backgroundColor: C.surfaceContHigh, borderWidth: 1, borderColor: 'transparent' },
  chipActive:         { borderColor: 'rgba(169,180,185,0.5)' },
  chipText:           { fontSize: 9, fontWeight: '700', letterSpacing: 3, color: C.onSurface, textTransform: 'uppercase' },
  chipTextActive:     { color: C.onSurface },

  // Entries section
  section:            {},
  sectionLabel:       { paddingHorizontal: 16, fontSize: 10, fontWeight: '900', letterSpacing: 5, color: C.outline, textTransform: 'uppercase', marginBottom: 8 },

  // Entry row — exact Stitch layout
  entry:              { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 28 },
  entryBorder:        { borderBottomWidth: 1, borderBottomColor: 'rgba(169,180,185,0.08)' },
  entryLeft:          { flexDirection: 'row', alignItems: 'flex-start', gap: 20, flex: 1, marginRight: 12 },
  entryIconBox:       { width: 48, height: 48, borderRadius: 8, backgroundColor: C.surfaceContHighest, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  entryTitleRow:      { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 },
  entryTitle:         { fontSize: 17, fontWeight: '700', letterSpacing: -0.3, color: C.onSurface },
  entryMeta:          { fontSize: 13, fontWeight: '600', color: C.onSurfaceVariant },
  entryRight:         { alignItems: 'flex-end', gap: 4, flexShrink: 0 },
  entrySalary:        { fontSize: 10, fontWeight: '900', letterSpacing: 2, color: C.outline, textTransform: 'uppercase' },
  entrySub:           { fontSize: 10, fontWeight: '500', color: 'rgba(86,97,102,0.6)' },
  entrySubError:      { color: C.error, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },

  // NEW badge
  badgeNew:           { paddingHorizontal: 8, paddingVertical: 2, backgroundColor: 'rgba(78,90,154,0.1)', borderRadius: 4 },
  badgeNewText:       { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, color: C.primary },

  // Closing Soon badge
  badgeClose:         { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeCloseText:     { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, color: C.error, textTransform: 'uppercase' },
});
