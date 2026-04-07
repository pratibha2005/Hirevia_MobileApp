import React from 'react';
const matteCover = require('../../../assets/images/matte_cover.png');
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PALETTE as P, TYPOGRAPHY as Typo } from '../../theme/tokens';

// ─── Editorial Theme (Synced) ────────────────────────────────────────────────
const T = {
  bgWhite: P.surface,
  bgGray: P.background,
  textMain: P.onSurface,
  textP: P.onSurfaceVariant,
  textMuted: P.outline,
  accentDark: P.primary,
  accentLight: P.outline,
  border: P.outlineVariant,
};

// ─── Dynamic Image Helper ───────────────────────────────────────────────────────
const getJobCoverImage = (title: string, company: string = '') => {
  const t = title.toLowerCase();
  const c = company.toLowerCase();
  if (t.includes('design') || t.includes('ux') || t.includes('ui') || t.includes('visual') || c.includes('studio')) {
    return 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('develop') || t.includes('engineer') || t.includes('software') || t.includes('architect')) {
    return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('market') || t.includes('strateg') || t.includes('product') || t.includes('manager')) {
    return 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('data') || t.includes('analy') || t.includes('finance')) {
    return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
  }
  const fallbacks = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  ];
  const hash = company.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 1;
  return fallbacks[hash % fallbacks.length];
};

export default function JobDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const job = route.params?.job;

  if (!job) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={22} color={T.textMain} />
          </TouchableOpacity>
        </View>
        <Text style={styles.errorText}>Narrative not found.</Text>
      </SafeAreaView>
    );
  }

  // Fallbacks for data to precisely match the layout
  const salary = job.salary || '£85k - £110k';
  const location = job.location || 'London, UK';
  const type = job.type || 'Full-time';
  const company = job.company || 'Studio Arkhos';
  const skills = job.tags || job.skills || ['Develop multi-channel creative strategies for global projects.', 'Collaborate with Architects to ensure brand alignment.', 'Oversee visual production from mood-board to execution.'];
  
  // Premium matte AI-generated cover for the details hero
  const coverImage = matteCover;
  
  // Dynamic company metadata
  const companyCategory = (Array.isArray(job.tags) && job.tags.length > 0) ? job.tags[0].toUpperCase() : 'INNOVATIVE AGENCY';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* ─── Minimal Nav Bar ─── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color={T.textMain} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="share-social-outline" size={22} color={T.textMain} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ─── Hero Image ─── */}
        <View style={styles.paddingH}>
            <Image source={coverImage} style={styles.heroImage} />
        </View>

        {/* ─── Title & Meta ─── */}
        <View style={[styles.paddingH, styles.titleSection]}>
          <Text style={styles.jobTitle}>{job.title || 'Senior Creative Strategist'}</Text>
          <Text style={styles.subtitleRow}>
            {company}  <Text style={styles.dot}>•</Text>  {location}  <Text style={styles.dot}>•</Text>  {type}
          </Text>
        </View>

        {/* ─── Metrics Divider Row ─── */}
        <View style={styles.paddingH}>
            <View style={styles.metricsRow}>
            <View style={styles.metricBlock}>
                <Text style={styles.metricLabel}>SALARY</Text>
                <Text style={styles.metricValue}>{salary}</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricBlock}>
                <Text style={styles.metricLabel}>TEAM</Text>
                <Text style={styles.metricValue}>20-50</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricBlock}>
                <Text style={styles.metricLabel}>POSTED</Text>
                <Text style={styles.metricValue}>2 days ago</Text>
            </View>
            </View>
        </View>

        {/* ─── About Segment ─── */}
        <View style={[styles.paddingH, styles.aboutSection]}>
          <Text style={styles.sectionLabel}>ABOUT THE ROLE</Text>
          <Text style={styles.bodyText}>
            {job.description || 
             "As our Senior Creative Strategist, you will sit at the intersection of architectural precision and narrative storytelling. Studio Arkhos is seeking a visionary who can translate complex structural concepts into evocative digital experiences.\n\nYou will lead a small, high-performance team to bridge the gap between our design principles and client expectations."}
          </Text>
        </View>

        {/* ─── Full-Bleed Gray Background Section ─── */}
        <View style={styles.grayBleed}>
          <View style={styles.paddingH}>
              
              {/* Responsibilities */}
              <Text style={styles.sectionLabel}>RESPONSIBILITIES</Text>
              <View style={styles.listContainer}>
                {skills.map((skill: string, i: number) => (
                  <View key={i} style={styles.listItem}>
                    <Ionicons name="checkmark-circle" size={18} color={T.accentDark} style={styles.listIcon} />
                    <Text style={styles.listText}>{skill}</Text>
                  </View>
                ))}
              </View>

              {/* Offerings */}
              <Text style={[styles.sectionLabel, { marginTop: 32 }]}>WHAT WE OFFER</Text>
              <View style={styles.listContainer}>
                {[
                  'Access to our private rooftop studio.',
                  'Bi-annual international design residency programs.',
                ].map((offer, i) => (
                  <View key={i} style={styles.listItem}>
                    <Ionicons name="star" size={16} color={T.accentDark} style={styles.listIcon} />
                    <Text style={styles.listText}>{offer}</Text>
                  </View>
                ))}
              </View>

          </View>
        </View>

        {/* ─── Company Footer Block ─── */}
        <View style={[styles.paddingH, styles.companySection]}>
          <View style={styles.companyHeaderRow}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>{company.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.companyTitleBox}>
              <Text style={styles.companyNameText}>{company}</Text>
              <Text style={styles.companyCategoryText}>{companyCategory}</Text>
            </View>
            <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Text style={styles.portfolioText}>PORTFOLIO</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.companyBlurb}>
            Join the {company} team to build the future. We're looking for passionate individuals to join our {location} office and drive innovation.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ─── Bottom Actions ─── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.applyBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ApplyFlow', { job })}
        >
          <Text style={styles.applyBtnText}>Apply for this Role</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bookmarkBtn}>
          <Ionicons name="bookmark" size={18} color={T.textMain} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: T.bgWhite 
  },
  paddingH: {
    paddingHorizontal: 20,
  },
  
  // Header
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 12,
    backgroundColor: T.bgWhite,
  },
  iconBtn: { 
    justifyContent: 'center', 
    alignItems: 'center',
    width: 32,
    height: 32,
  },
  errorText: { 
    textAlign: 'center', 
    marginTop: 120, 
    color: T.textMuted, 
    fontSize: 16 
  },

  scrollContent: { 
    paddingTop: 8,
  },

  // Hero
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 24,
    backgroundColor: T.bgGray,
  },

  // Titles
  titleSection: {
    marginBottom: 24,
  },
  jobTitle: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: T.textMain, 
    letterSpacing: -0.5, 
    marginBottom: 8,
    lineHeight: 38,
  },
  subtitleRow: {
    fontSize: 14,
    color: T.textP,
    fontWeight: '500',
  },
  dot: {
    color: '#D1D5DB',
  },

  // Metrics
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: T.border,
    paddingVertical: 16,
    marginBottom: 32,
  },
  metricBlock: {
    flex: 1,
  },
  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: T.border,
    marginHorizontal: 16,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: T.textMuted,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    color: T.textMain,
  },

  // Section Typography
  aboutSection: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: T.accentLight,
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 24,
    color: T.textP,
    fontWeight: '400',
  },

  // Gray Bleed Block
  grayBleed: {
    backgroundColor: T.bgGray,
    paddingVertical: 32,
    width: '100%',
  },
  listContainer: {
    gap: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  listIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: T.textP,
    fontWeight: '400',
  },

  // Company Footer
  companySection: {
    paddingVertical: 32,
  },
  companyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoBox: {
    width: 44,
    height: 44,
    backgroundColor: '#000000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#D4AF37', 
    fontSize: 20,
    fontWeight: '800',
  },
  companyTitleBox: {
    flex: 1,
    marginLeft: 12,
  },
  companyNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: T.textMain,
    marginBottom: 2,
  },
  companyCategoryText: {
    fontSize: 9,
    fontWeight: '700',
    color: T.textMuted,
    letterSpacing: 1,
  },
  portfolioText: {
    fontSize: 10,
    fontWeight: '700',
    color: T.accentDark,
    letterSpacing: 1,
  },
  companyBlurb: {
    fontSize: 13,
    lineHeight: 20,
    color: T.textP,
  },

  // Bottom Fixed Bar
  bottomBar: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 16, 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    backgroundColor: '#FFFFFF', // explicitly white
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 10,
  },
  applyBtn: { 
    flex: 1, 
    backgroundColor: '#000000',
    paddingVertical: 16, 
    borderRadius: 100, // Pill-shaped like the rest of the app's CTAs
    alignItems: 'center',
  },
  applyBtnText: { 
    color: T.bgWhite, 
    fontSize: 14, 
    fontWeight: '600', 
  },
  bookmarkBtn: {
    width: 52,
    height: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: T.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: T.bgWhite,
  }
});
