import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Animated, Easing, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { PALETTE as C, TYPOGRAPHY as T } from '../../theme/tokens';

// ─── Fade-In Wrapper ────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, style }: any) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
      ]),
    ]).start();
  }, []);
  return <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>{children}</Animated.View>;
}

// ─── Timeline Entry (Final Structural Perfection) ───────────────────────────
function TimelineEntry({ title, company, date, isPresent, isFirst, isLast }: { title: string; company: string; date: string; isPresent?: boolean; isFirst?: boolean; isLast?: boolean }) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineIndicators}>
        {!isFirst && <View style={[styles.timelineLine, { height: 24, top: 0 }]} />}
        {!isLast && <View style={[styles.timelineLine, { top: 24, bottom: 0 }]} />}
        <View style={styles.timelineNode}>
           <View style={styles.timelineInnerNode} />
        </View>
      </View>
      <View style={styles.timelineContent}>
        <View style={styles.timelineHeader}>
           <Text style={styles.timelineTitle}>{title}</Text>
           <Text style={styles.timelineStatusPin}>{isPresent ? 'PRESENT' : '2023'}</Text>
        </View>
        <Text style={styles.timelineSub}>{company}</Text>
        <Text style={styles.timelineDate}>{date.toUpperCase()}</Text>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<{ name?: string; email?: string; profilePic?: string } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUser = async () => {
    const u = await AsyncStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  };

  useFocusEffect(useCallback(() => { fetchUser(); }, []));

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUser();
    setRefreshing(false);
  };

  // 📊 Dynamic Mastery Calculation
  const mastery = useMemo(() => {
    let score = 0;
    if (user?.name) score += 20;
    if (user?.email) score += 20;
    if (user?.profilePic) score += 10;
    score += 45; // Base Profile completeness
    return Math.min(score, 100);
  }, [user]);

  const name = user?.name || 'Alexander Vance';
  const role = 'Frontend Developer';
  const location = 'London, UK';
  const displayFilename = `${name.replace(/\s+/g, '_')}_CV.pdf`;

  const avatarSource = user?.profilePic 
    ? { uri: user.profilePic } 
    : require('../../../assets/images/profile_bitmoji.png');

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        {/* Discrete Exit Control */}
        <View style={styles.topControl}>
           <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color={C.onSurface} strokeWidth={2.5} />
           </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.onSurface} />}
        >
          
          {/* 🧔 identity Section */}
          <FadeIn delay={0}>
             <View style={styles.heroSection}>
                <View style={styles.haloContainer}>
                   <LinearGradient 
                      colors={['#D1D1D1', '#7A7A7A']} // Pure Monochrome Halo
                      style={styles.haloRing}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                   />
                   <View style={styles.avatarWrapper}>
                      <Image 
                        source={avatarSource} 
                        style={styles.avatarImg}
                      />
                   </View>
                </View>
                <Text style={styles.heroName}>{name}</Text>
                <Text style={styles.heroMeta}>{role} · {location}</Text>
             </View>
          </FadeIn>

          {/* 📏 Linear Mastery Card (Straight Editorial Update) */}
          <FadeIn delay={80}>
             <View style={styles.masteryCard}>
                <View style={styles.masteryHeader}>
                   <Text style={styles.masteryLabel}>PROFILE MASTERY</Text>
                   <Text style={styles.masteryPercentLabel}>{mastery}%</Text>
                </View>
                
                {/* Precision Horizontal Bar */}
                <View style={styles.masteryTrack}>
                   <View style={[styles.masteryFill, { width: `${mastery}%` }]} />
                </View>

                <View style={styles.masteryBody}>
                   <Text style={styles.masteryDescription}>Your professional narrative is nearly complete.</Text>
                   <TouchableOpacity style={styles.boostLink}>
                      <Text style={styles.boostLinkText}>BOOST STRENGTH</Text>
                      <Ionicons name="arrow-forward" size={12} color={C.primary} />
                   </TouchableOpacity>
                </View>
             </View>
          </FadeIn>

          {/* 📖 The Narrative Timeline */}
          <FadeIn delay={160} style={styles.section}>
             <Text style={styles.editorialLabel}>NARRATIVE</Text>
             <View style={styles.timelineBlock}>
                <TimelineEntry 
                  isFirst
                  isPresent
                  title="Frontend Intern"
                  company="TechSolutions"
                  date="Jan 2024 — Now"
                />
                <TimelineEntry 
                  isLast
                  title="B.Tech in Computer Science"
                  company="Global Institute of Technology"
                  date="Degree with Distinction"
                />
             </View>
          </FadeIn>

          {/* 🏷️ ghost expertise archive */}
          <FadeIn delay={240} style={styles.section}>
             <Text style={styles.editorialLabel}>EXPERTISE</Text>
             <View style={styles.chipsRow}>
                {['React', 'Node.js', 'Typescript', 'Tailwind', 'UI/UX'].map(skill => (
                  <View key={skill} style={styles.ghostChip}>
                    <Text style={styles.ghostChipText}>{skill.toUpperCase()}</Text>
                  </View>
                ))}
             </View>

             {/* Dynamic Resume Card */}
             <View style={styles.assetCard}>
                <View style={styles.assetIconBox}>
                   <Ionicons name="document-text-outline" size={18} color={C.primary} />
                </View>
                <View style={{ flex: 1 }}>
                   <Text style={styles.assetTitle}>{displayFilename.toLowerCase()}</Text>
                   <Text style={styles.assetMeta}>UPDATED 24H AGO</Text>
                </View>
                <TouchableOpacity style={styles.assetUpdateBtn}>
                   <Text style={styles.updateBtnText}>UPDATE</Text>
                </TouchableOpacity>
             </View>
          </FadeIn>

          {/* 🚀 hero project */}
          <FadeIn delay={320} style={styles.section}>
             <Text style={styles.editorialLabel}>KEY PROJECT</Text>
             <View style={styles.projectHero}>
                <View style={styles.projectTopRow}>
                   <Ionicons name="rocket-outline" size={24} color={C.onSurface} strokeWidth={2} />
                   <View style={styles.yearBadge}>
                      <Text style={styles.yearBadgeText}>2024</Text>
                   </View>
                </View>
                <Text style={styles.projectHeroTitle}>HireVia - Job Platform</Text>
                <Text style={styles.projectHeroDesc}>
                   A high-performance job ecosystem reimagining the candidate experience through hyper-minimalist design and Node.js efficiency.
                </Text>
                <TouchableOpacity style={styles.caseStudyLink}>
                   <Text style={styles.caseStudyText}>VIEW CASE STUDY</Text>
                </TouchableOpacity>

                <View style={styles.decorShape} />
             </View>
          </FadeIn>

          {/* ⚙️ integrated settings */}
          <FadeIn delay={400} style={styles.settingsSection}>
             <View style={styles.settingList}>
                {['Preferences', 'Privacy'].map(item => (
                   <TouchableOpacity key={item} style={styles.settingRow}>
                      <Text style={styles.settingLabel}>{item}</Text>
                      <Ionicons name="chevron-forward" size={14} color={C.onSurfaceVariant} />
                   </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.settingRow} onPress={() => navigation.replace('Login')}>
                   <Text style={[styles.settingLabel, { color: C.error }]}>Sign Out</Text>
                </TouchableOpacity>
             </View>
          </FadeIn>

          <Text style={styles.versionFooter}>HIREVIA | ATELIER ELITE v1.0.4 </Text>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },
  safeArea: { flex: 1 },
  scrollContent: { paddingBottom: 220 },

  topControl: { paddingHorizontal: 24, paddingTop: 16 },

  // identity Section
  heroSection: { alignItems: 'center', marginTop: 24, marginBottom: 40 },
  haloContainer: { width: 110, height: 110, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  haloRing: { ...StyleSheet.absoluteFillObject, borderRadius: 55, opacity: 0.3 },
  avatarWrapper: { width: 100, height: 100, borderRadius: 50, backgroundColor: C.surface, padding: 3 },
  avatarImg: { width: '100%', height: '100%', borderRadius: 50 },
  heroName: { fontSize: 24, fontWeight: '800', color: C.onSurface, letterSpacing: -0.6, marginBottom: 4 },
  heroMeta: { fontSize: 13, fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: 0.2 },

  // Mastery Progress Card (Straight Update)
  masteryCard: {
    backgroundColor: C.surface,
    marginHorizontal: 24,
    padding: 28,
    borderRadius: 32,
    marginBottom: 56,
  },
  masteryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  masteryLabel: { 
    fontSize: 9, 
    fontWeight: '800', 
    color: C.onSurfaceVariant, 
    letterSpacing: 2, 
  },
  masteryPercentLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: C.onSurface,
    letterSpacing: 1,
  },
  masteryTrack: {
    height: 4,
    width: '100%',
    backgroundColor: C.surfaceLow,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  masteryFill: {
    height: '100%',
    backgroundColor: C.primary,
    borderRadius: 10,
  },
  masteryBody: { },
  masteryDescription: { fontSize: 14, fontWeight: '600', color: C.onSurface, lineHeight: 20, marginBottom: 12 },
  boostLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  boostLinkText: { fontSize: 10, fontWeight: '800', color: C.primary, letterSpacing: 1 },

  // Editorial Sectioning
  section: { paddingHorizontal: 24, marginBottom: 56 },
  editorialLabel: { fontSize: 10, fontWeight: '800', color: C.onSurfaceVariant, letterSpacing: 1.2, marginBottom: 24 },

  // Timeline
  timelineBlock: { paddingLeft: 8 },
  timelineRow: { flexDirection: 'row', minHeight: 110 },
  timelineIndicators: { width: 24, alignItems: 'center', marginRight: 24, position: 'relative' },
  timelineLine: { position: 'absolute', width: 2, backgroundColor: C.outlineVariant, left: '50%', marginLeft: -1 },
  timelineNode: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.onSurface, justifyContent: 'center', alignItems: 'center', zIndex: 2, marginTop: 0 },
  timelineInnerNode: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF' },
  timelineContent: { flex: 1 },
  timelineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  timelineTitle: { fontSize: 18, fontWeight: '800', color: C.onSurface, letterSpacing: -0.4 },
  timelineStatusPin: { fontSize: 9, fontWeight: '800', color: C.onSurfaceVariant, letterSpacing: 1.2 },
  timelineSub: { fontSize: 15, fontWeight: '600', color: C.onSurfaceVariant, marginBottom: 8 },
  timelineDate: { fontSize: 11, fontWeight: '700', color: C.onSurfaceVariant },

  // ghost chips
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  ghostChip: { backgroundColor: C.surfaceLow, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100 },
  ghostChipText: { fontSize: 11, fontWeight: '800', color: C.onSurface, letterSpacing: 0.8 },

  assetCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, padding: 16, borderRadius: 24, shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity:0.02, shadowRadius:4 },
  assetIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: C.background, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  assetTitle: { fontSize: 14, fontWeight: '700', color: C.onSurface },
  assetMeta: { fontSize: 9, fontWeight: '800', color: C.onSurfaceVariant, letterSpacing: 1, marginTop: 2 },
  assetUpdateBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: C.outline },
  updateBtnText: { fontSize: 9, fontWeight: '800', color: C.onSurface },

  // Project
  projectHero: { backgroundColor: C.surface, padding: 32, borderRadius: 32, overflow: 'hidden' },
  projectTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  yearBadge: { backgroundColor: C.background, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  yearBadgeText: { fontSize: 10, fontWeight: '800', color: C.onSurfaceVariant },
  projectHeroTitle: { fontSize: 24, fontWeight: '800', color: C.onSurface, letterSpacing: -0.6, marginBottom: 12 },
  projectHeroDesc: { fontSize: 15, color: C.onSurfaceVariant, lineHeight: 22, marginBottom: 24 },
  caseStudyLink: { alignSelf: 'flex-start', borderBottomWidth: 1.5, borderBottomColor: C.primary, paddingBottom: 2 },
  caseStudyText: { fontSize: 11, fontWeight: '800', color: C.primary, letterSpacing: 0.5 },
  decorShape: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: C.background, bottom: -70, right: -40, zIndex: -1 },

  // integrated settings
  settingsSection: { paddingHorizontal: 24, marginTop: 20, paddingBottom: 40 },
  settingList: { backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 24, paddingVertical: 8 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.015)' },
  settingLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: C.onSurface },

  versionFooter: { textAlign: 'center', fontSize: 10, fontWeight: '700', color: 'rgba(0,0,0,0.1)', letterSpacing: 1.2, marginBottom: 40 },
});
