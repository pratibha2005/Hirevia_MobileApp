// // // import React, { useState, useEffect } from 'react';
// // // import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl, Animated, Dimensions } from 'react-native';
// // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // import { Ionicons } from '@expo/vector-icons';
// // // import { useNavigation } from '@react-navigation/native';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import { LinearGradient } from 'expo-linear-gradient';
// // // import { API_BASE_URL } from '../../api/config';

// // // const { width } = Dimensions.get('window');

// // // const THEME = {
// // //     primary: '#0F4C5C',
// // //     primaryForeground: '#FFFFFF',
// // //     accent: '#2256c5',
// // //     accentLight: '#b0d5e9',
// // //     accentDark: '#9862a7',
// // //     secondary: '#3B82F6',
// // //     secondaryLight: '#DBEAFE',
// // //     tertiary: '#F59E0B',
// // //     tertiaryLight: '#FEF3C7',
// // //     gradient1: '#0F4C5C',
// // //     gradient2: '#1E5A72',
// // //     background: '#F5F7FA',
// // //     surface: '#FFFFFF',
// // //     surfaceAlt: '#F8FAFC',
// // //     text: '#0F172A',
// // //     textSecondary: '#475569',
// // //     textMuted: '#64748B',
// // //     border: '#DFE5EB',
// // //     success: '#385e51',
// // //     warning: '#F59E0B',
// // //     error: '#EF4444',
// // // };

// // // const CATEGORIES = ['All', 'Engineering', 'Design', 'Product', 'Marketing'];

// // // export default function HomeFeedScreen() {
// // //     const navigation = useNavigation<any>();
// // //     const [activeCategory, setActiveCategory] = useState('All');
// // //     const [jobs, setJobs] = useState<any[]>([]);
// // //     const [loading, setLoading] = useState(true);
// // //     const [refreshing, setRefreshing] = useState(false);
// // //     const [userName, setUserName] = useState('there');
// // //     const [bookmarked, setBookmarked] = useState<{[key: string]: boolean}>({});
// // //     const scaleAnim = new Animated.Value(1);

// // //     const fetchJobs = async (isRefresh = false) => {
// // //         if (isRefresh) setRefreshing(true);
// // //         try {
// // //             const res = await fetch(`${API_BASE_URL}/api/jobs`);
// // //             const data = await res.json();
// // //             if (data.success) {
// // //                 setJobs(data.jobs.map((j: any) => ({
// // //                     id: j._id,
// // //                     title: j.title,
// // //                     company: j.companyId?.name || 'Unknown Company',
// // //                     location: j.location,
// // //                     salary: j.salary || 'Salary not disclosed',
// // //                     type: j.type || 'Full-time',
// // //                     tags: j.skills || [],
// // //                     logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(j.companyId?.name || 'C')}&background=0F4C5C&color=fff&size=120`,
// // //                     description: j.description,
// // //                     screeningQuestions: j.screeningQuestions || [],
// // //                 })));
// // //             }
// // //         } catch (e) {
// // //             console.error('Failed to fetch jobs', e);
// // //         } finally {
// // //             setLoading(false);
// // //             setRefreshing(false);
// // //         }
// // //     };

// // //     useEffect(() => {
// // //         fetchJobs();
// // //         AsyncStorage.getItem('user').then(u => {
// // //             if (u) {
// // //                 const parsed = JSON.parse(u);
// // //                 setUserName(parsed.name?.split(' ')[0] || 'there');
// // //             }
// // //         });
// // //     }, []);

// // //     const renderJobCard = ({ item }: { item: typeof MOCK_JOBS[0] }) => (
// // //         <TouchableOpacity
// // //             style={styles.cardWrapper}
// // //             activeOpacity={0.75}
// // //             onPress={() => navigation.navigate('JobDetails', { job: item })}
// // //         >
// // //             <LinearGradient
// // //                 colors={[THEME.surface, THEME.surfaceAlt]}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.card}
// // //             >
// // //                 {/* Accent Bar */}
// // //                 <View style={styles.accentBar} />

// // //                 <View style={styles.cardHeader}>
// // //                     <View style={styles.logoContainer}>
// // //                         <LinearGradient
// // //                             colors={['#F0F9FF', '#E0F2FE']}
// // //                             start={{ x: 0, y: 0 }}
// // //                             end={{ x: 1, y: 1 }}
// // //                             style={styles.logoBg}
// // //                         >
// // //                             <Image source={{ uri: item.logo }} style={styles.companyLogo} />
// // //                         </LinearGradient>
// // //                     </View>

// // //                     <View style={styles.cardTitleContainer}>
// // //                         <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
// // //                         <View style={styles.companyBadge}>
// // //                             <Text style={styles.companyName}>{item.company}</Text>
// // //                         </View>
// // //                     </View>

// // //                     <TouchableOpacity
// // //                         style={[styles.bookmarkButton, bookmarked[item.id] && styles.bookmarkButtonActive]}
// // //                         onPress={() => setBookmarked(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
// // //                     >
// // //                         <Ionicons 
// // //                             name={bookmarked[item.id] ? "bookmark" : "bookmark-outline"} 
// // //                             size={22} 
// // //                             color={bookmarked[item.id] ? THEME.accent : THEME.textMuted}
// // //                         />
// // //                     </TouchableOpacity>
// // //                 </View>

// // //                 <View style={styles.cardDetails}>
// // //                     <View style={styles.detailItem}>
// // //                         <View style={styles.detailIconBg}>
// // //                             <Ionicons name="location-outline" size={22} color={THEME.accent} />
// // //                         </View>
// // //                         <Text style={styles.detailText}>{item.location}</Text>
// // //                     </View>

// // //                     <View style={styles.detailItem}>
// // //                         <View style={styles.detailIconBg}>
// // //                             <Ionicons name="cash-outline" size={22} color={THEME.accent} />
// // //                         </View>
// // //                         <Text style={styles.detailText}>{item.salary}</Text>
// // //                     </View>

// // //                     <View style={styles.detailItem}>
// // //                         <View style={styles.detailIconBg}>
// // //                             <Ionicons name="briefcase-outline" size={22} color={THEME.accent} />
// // //                         </View>
// // //                         <Text style={styles.detailText}>{item.type}</Text>
// // //                     </View>
// // //                 </View>

// // //                 <View style={styles.tagsContainer}>
// // //                     {item.tags.slice(0, 3).map((tag, idx) => (
// // //                         <View key={idx} style={styles.tagBadge}>
// // //                             <Ionicons name="checkmark-circle" size={12} color={THEME.accent} style={{ marginRight: 4 }} />
// // //                             <Text style={styles.tagText}>{tag}</Text>
// // //                         </View>
// // //                     ))}
// // //                     {item.tags.length > 3 && (
// // //                         <View style={[styles.tagBadge, styles.moreTagBadge]}>
// // //                             <Text style={styles.moreTagText}>+{item.tags.length - 3}</Text>
// // //                         </View>
// // //                     )}
// // //                 </View>

// // //                 {/* CTA Button */}
// // //                 <TouchableOpacity style={styles.ctaButton} activeOpacity={0.7}>
// // //                     <Text style={styles.ctaText}>View Details</Text>
// // //                     <Ionicons name="arrow-forward" size={16} color={THEME.primaryForeground} />
// // //                 </TouchableOpacity>
// // //             </LinearGradient>
// // //         </TouchableOpacity>
// // //     );

// // //     return (
// // //         <SafeAreaView style={styles.container} edges={['top']}>
// // //             {/* Enhanced Header with Gradient */}
// // //             <LinearGradient
// // //                 colors={[THEME.gradient1, THEME.gradient2]}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.headerGradient}
// // //             >
// // //                 <View style={styles.header}>
// // //                     <View>
// // //                         <Text style={styles.greeting}>Hello, {userName} 👋</Text>
// // //                         <Text style={styles.headerSubtitle}>Discover amazing job opportunities</Text>
// // //                     </View>
// // //                     <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.6}>
// // //                         <Ionicons name="notifications-outline" size={24} color={THEME.accent} />
// // //                         <View style={styles.notificationDot} />
// // //                     </TouchableOpacity>
// // //                 </View>
// // //             </LinearGradient>

// // //             {/* Enhanced Search Container */}
// // //             <View style={styles.searchSection}>
// // //                 <View style={styles.searchContainer}>
// // //                     <Ionicons name="search" size={20} color={THEME.accent} style={styles.searchIcon} />
// // //                     <Text style={styles.searchPlaceholder}>Search jobs, companies...</Text>
// // //                     <TouchableOpacity style={styles.filterBtn} activeOpacity={0.6}>
// // //                         <LinearGradient
// // //                             colors={[THEME.primary, THEME.gradient2]}
// // //                             start={{ x: 0, y: 0 }}
// // //                             end={{ x: 1, y: 1 }}
// // //                             style={styles.filterBtnGradient}
// // //                         >
// // //                             <Ionicons name="options" size={18} color={THEME.primaryForeground} />
// // //                         </LinearGradient>
// // //                     </TouchableOpacity>
// // //                 </View>
// // //             </View>

// // //             {/* Category Filter */}
// // //             <View style={styles.categoryContainer}>
// // //                 <FlatList
// // //                     horizontal
// // //                     showsHorizontalScrollIndicator={false}
// // //                     scrollEventThrottle={16}
// // //                     data={CATEGORIES}
// // //                     keyExtractor={(item) => item}
// // //                     contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
// // //                     renderItem={({ item }) => (
// // //                         <TouchableOpacity
// // //                             style={[styles.categoryBadge, activeCategory === item && styles.categoryBadgeActive]}
// // //                             onPress={() => setActiveCategory(item)}
// // //                             activeOpacity={0.7}
// // //                         >
// // //                             {activeCategory === item && (
// // //                                 <LinearGradient
// // //                                     colors={[THEME.primary, THEME.gradient2]}
// // //                                     start={{ x: 0, y: 0 }}
// // //                                     end={{ x: 1, y: 1 }}
// // //                                     style={styles.categoryBadgeBg}
// // //                                 />
// // //                             )}
// // //                             <Text style={[styles.categoryText, activeCategory === item && styles.categoryTextActive]}>
// // //                                 {item}
// // //                             </Text>
// // //                         </TouchableOpacity>
// // //                     )}
// // //                 />
// // //             </View>

// // //             {/* Jobs List */}
// // //             <FlatList
// // //                 data={jobs}
// // //                 keyExtractor={(item) => item.id}
// // //                 renderItem={renderJobCard}
// // //                 contentContainerStyle={styles.listContainer}
// // //                 showsVerticalScrollIndicator={false}
// // //                 scrollEventThrottle={16}
// // //                 refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchJobs(true)} tintColor={THEME.accent} />}
// // //                 ListHeaderComponent={
// // //                     <View style={styles.headerSection}>
// // //                         <View style={styles.jobCountBadge}>
// // //                             <Text style={styles.jobCountText}>
// // //                                 {loading ? '...' : jobs.length}
// // //                             </Text>
// // //                         </View>
// // //                         <Text style={styles.sectionTitle}>
// // //                             {loading ? 'Loading opportunities...' : `Available Position${jobs.length !== 1 ? 's' : ''}`}
// // //                         </Text>
// // //                     </View>
// // //                 }
// // //                 ListEmptyComponent={
// // //                     loading ? (
// // //                         <View style={styles.loadingContainer}>
// // //                             <ActivityIndicator size="large" color={THEME.accent} />
// // //                             <Text style={styles.loadingText}>Finding great jobs for you...</Text>
// // //                         </View>
// // //                     ) : (
// // //                         <View style={styles.emptyState}>
// // //                             <View style={styles.emptyIconBg}>
// // //                                 <Ionicons name="briefcase-outline" size={48} color={THEME.accent} />
// // //                             </View>
// // //                             <Text style={styles.emptyText}>No jobs available yet</Text>
// // //                             <Text style={styles.emptySubtext}>Pull down to refresh and see new opportunities</Text>
// // //                         </View>
// // //                     )
// // //                 }
// // //             />
// // //         </SafeAreaView>
// // //     );
// // // }

// // // const styles = StyleSheet.create({
// // //     container: { flex: 1, backgroundColor: THEME.background },

// // //     // Header Section
// // //     headerGradient: { paddingHorizontal: 0, paddingTop: 0 },
// // //     header: {
// // //         flexDirection: 'row',
// // //         justifyContent: 'space-between',
// // //         alignItems: 'center',
// // //         paddingHorizontal: 20,
// // //         paddingVertical: 18,
// // //     },
// // //     greeting: {
// // //         fontSize: 26,
// // //         fontWeight: '800',
// // //         color: THEME.primaryForeground,
// // //         letterSpacing: -0.5,
// // //     },
// // //     headerSubtitle: {
// // //         fontSize: 14,
// // //         color: THEME.primaryForeground,
// // //         marginTop: 4,
// // //         fontWeight: '500',
// // //         opacity: 0.9,
// // //     },
// // //     notificationBtn: {
// // //         width: 48,
// // //         height: 48,
// // //         borderRadius: 12,
// // //         backgroundColor: 'rgba(255, 255, 255, 0.2)',
// // //         justifyContent: 'center',
// // //         alignItems: 'center',
// // //         borderWidth: 1.5,
// // //         borderColor: 'rgba(255, 255, 255, 0.3)',
// // //         shadowColor: '#000',
// // //         shadowOffset: { width: 0, height: 2 },
// // //         shadowOpacity: 0.15,
// // //         shadowRadius: 8,
// // //         elevation: 3,
// // //     },
// // //     notificationDot: {
// // //         position: 'absolute',
// // //         top: 8,
// // //         right: 8,
// // //         width: 10,
// // //         height: 10,
// // //         borderRadius: 5,
// // //         backgroundColor: THEME.accent,
// // //         borderWidth: 2,
// // //         borderColor: THEME.primaryForeground,
// // //         shadowColor: THEME.accent,
// // //         shadowOffset: { width: 0, height: 0 },
// // //         shadowOpacity: 0.6,
// // //         shadowRadius: 3,
// // //         elevation: 2,
// // //     },

// // //     // Search Section
// // //     searchSection: {
// // //         paddingHorizontal: 20,
// // //         paddingVertical: 16,
// // //         backgroundColor: THEME.background,
// // //     },
// // //     searchContainer: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         backgroundColor: THEME.surface,
// // //         borderRadius: 14,
// // //         paddingLeft: 14,
// // //         paddingRight: 6,
// // //         paddingVertical: 12,
// // //         borderWidth: 2,
// // //         borderColor: THEME.border,
// // //         shadowColor: '#000',
// // //         shadowOffset: { width: 0, height: 2 },
// // //         shadowOpacity: 0.06,
// // //         shadowRadius: 8,
// // //         elevation: 2,
// // //     },
// // //     searchIcon: {
// // //         marginRight: 10,
// // //     },
// // //     searchPlaceholder: {
// // //         flex: 1,
// // //         color: THEME.textMuted,
// // //         fontSize: 14,
// // //         fontWeight: '500',
// // //     },
// // //     filterBtn: {
// // //         marginLeft: 8,
// // //     },
// // //     filterBtnGradient: {
// // //         width: 42,
// // //         height: 42,
// // //         borderRadius: 10,
// // //         justifyContent: 'center',
// // //         alignItems: 'center',
// // //     },

// // //     // Category Section
// // //     categoryContainer: {
// // //         marginBottom: 20,
// // //         backgroundColor: THEME.background,
// // //         paddingBottom: 8,
// // //     },
// // //     categoryBadge: {
// // //         paddingHorizontal: 16,
// // //         paddingVertical: 10,
// // //         borderRadius: 20,
// // //         backgroundColor: THEME.surface,
// // //         borderWidth: 1.5,
// // //         borderColor: THEME.border,
// // //         overflow: 'hidden',
// // //     },
// // //     categoryBadgeBg: {
// // //         position: 'absolute',
// // //         left: 0,
// // //         top: 0,
// // //         right: 0,
// // //         bottom: 0,
// // //     },
// // //     categoryBadgeActive: {
// // //         borderColor: THEME.primary,
// // //     },
// // //     categoryText: {
// // //         fontSize: 13,
// // //         fontWeight: '700',
// // //         color: THEME.textMuted,
// // //     },
// // //     categoryTextActive: {
// // //         color: THEME.primaryForeground,
// // //         zIndex: 10,
// // //     },

// // //     // List Section
// // //     listContainer: {
// // //         paddingHorizontal: 20,
// // //         paddingBottom: 120,
// // //     },
// // //     headerSection: {
// // //         marginBottom: 20,
// // //         alignItems: 'center',
// // //     },
// // //     jobCountBadge: {
// // //         backgroundColor: THEME.accentLight,
// // //         paddingHorizontal: 12,
// // //         paddingVertical: 6,
// // //         borderRadius: 8,
// // //         marginBottom: 12,
// // //     },
// // //     jobCountText: {
// // //         fontSize: 12,
// // //         fontWeight: '700',
// // //         color: THEME.accentDark,
// // //     },
// // //     sectionTitle: {
// // //         fontSize: 20,
// // //         fontWeight: '800',
// // //         color: THEME.text,
// // //         marginBottom: 4,
// // //         letterSpacing: -0.3,
// // //     },

// // //     // Card Section
// // //     cardWrapper: {
// // //         marginBottom: 16,
// // //     },
// // //     card: {
// // //         backgroundColor: THEME.surface,
// // //         borderRadius: 18,
// // //         padding: 16,
// // //         borderWidth: 1,
// // //         borderColor: THEME.border,
// // //         overflow: 'hidden',
// // //         shadowColor: '#000',
// // //         shadowOffset: { width: 0, height: 4 },
// // //         shadowOpacity: 0.08,
// // //         shadowRadius: 12,
// // //         elevation: 3,
// // //     },
// // //     accentBar: {
// // //         position: 'absolute',
// // //         top: 0,
// // //         left: 0,
// // //         right: 0,
// // //         height: 4,
// // //         backgroundColor: THEME.accent,
// // //     },

// // //     cardHeader: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         marginBottom: 16,
// // //     },
// // //     logoContainer: {
// // //         marginRight: 12,
// // //     },
// // //     logoBg: {
// // //         width: 52,
// // //         height: 52,
// // //         borderRadius: 12,
// // //         justifyContent: 'center',
// // //         alignItems: 'center',
// // //         borderWidth: 1,
// // //         borderColor: THEME.border,
// // //     },
// // //     companyLogo: {
// // //         width: 48,
// // //         height: 48,
// // //         borderRadius: 10,
// // //     },
// // //     cardTitleContainer: {
// // //         flex: 1,
// // //         justifyContent: 'center',
// // //     },
// // //     jobTitle: {
// // //         fontSize: 16,
// // //         fontWeight: '800',
// // //         color: THEME.text,
// // //         marginBottom: 6,
// // //         letterSpacing: -0.2,
// // //     },
// // //     companyBadge: {
// // //         backgroundColor: THEME.secondaryLight,
// // //         paddingHorizontal: 8,
// // //         paddingVertical: 4,
// // //         borderRadius: 6,
// // //         alignSelf: 'flex-start',
// // //     },
// // //     companyName: {
// // //         fontSize: 12,
// // //         color: THEME.secondary,
// // //         fontWeight: '700',
// // //     },
// // //     bookmarkButton: {
// // //         padding: 8,
// // //         marginRight: -8,
// // //     },
// // //     bookmarkButtonActive: {
// // //         backgroundColor: THEME.accentLight,
// // //         borderRadius: 10,
// // //     },

// // //     // Card Details
// // //     cardDetails: {
// // //         gap: 12,
// // //         marginBottom: 16,
// // //     },
// // //     detailItem: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         gap: 8,
// // //     },
// // //     detailIconBg: {
// // //         width: 32,
// // //         height: 32,
// // //         borderRadius: 8,
// // //         // backgroundColor: THEME.accentLight,
// // //         justifyContent: 'center',
// // //         alignItems: 'center',
// // //     },
// // //     detailText: {
// // //         fontSize: 13,
// // //         color: THEME.textSecondary,
// // //         fontWeight: '600',
// // //         flex: 1,
// // //     },

// // //     // Tags
// // //     tagsContainer: {
// // //         flexDirection: 'row',
// // //         flexWrap: 'wrap',
// // //         gap: 8,
// // //         paddingBottom: 14,
// // //         paddingTop: 12,
// // //         borderTopWidth: 1,
// // //         borderTopColor: THEME.border,
// // //         marginBottom: 12,
// // //     },
// // //     tagBadge: {
// // //         backgroundColor: THEME.accentLight,
// // //         paddingHorizontal: 10,
// // //         paddingVertical: 6,
// // //         borderRadius: 8,
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         borderWidth: 0.5,
// // //         borderColor: THEME.accent,
// // //     },
// // //     tagText: {
// // //         fontSize: 12,
// // //         fontWeight: '700',
// // //         color: THEME.accentDark,
// // //     },
// // //     moreTagBadge: {
// // //         backgroundColor: THEME.tertiaryLight,
// // //         borderColor: THEME.tertiary,
// // //     },
// // //     moreTagText: {
// // //         fontSize: 12,
// // //         fontWeight: '700',
// // //         color: THEME.tertiary,
// // //     },

// // //     // CTA Button
// // //     ctaButton: {
// // //         flexDirection: 'row',
// // //         backgroundColor: THEME.primary,
// // //         paddingVertical: 12,
// // //         paddingHorizontal: 16,
// // //         borderRadius: 10,
// // //         justifyContent: 'center',
// // //         alignItems: 'center',
// // //         gap: 8,
// // //         shadowColor: THEME.primary,
// // //         shadowOffset: { width: 0, height: 2 },
// // //         shadowOpacity: 0.25,
// // //         shadowRadius: 6,
// // //         elevation: 2,
// // //     },
// // //     ctaText: {
// // //         fontSize: 14,
// // //         fontWeight: '700',
// // //         color: THEME.primaryForeground,
// // //     },

// // //     // Empty State
// // //     loadingContainer: {
// // //         alignItems: 'center',
// // //         marginTop: 80,
// // //         paddingHorizontal: 20,
// // //     },
// // //     loadingText: {
// // //         fontSize: 14,
// // //         color: THEME.textMuted,
// // //         marginTop: 14,
// // //         fontWeight: '600',
// // //     },
// // //     emptyState: {
// // //         alignItems: 'center',
// // //         marginTop: 80,
// // //         paddingHorizontal: 20,
// // //     },
// // //     emptyIconBg: {
// // //         width: 80,
// // //         height: 80,
// // //         borderRadius: 20,
// // //         backgroundColor: THEME.accentLight,
// // //         justifyContent: 'center',
// // //         alignItems: 'center',
// // //         marginBottom: 20,
// // //     },
// // //     emptyText: {
// // //         fontSize: 18,
// // //         fontWeight: '800',
// // //         color: THEME.text,
// // //         marginBottom: 8,
// // //     },
// // //     emptySubtext: {
// // //         fontSize: 14,
// // //         color: THEME.textMuted,
// // //         textAlign: 'center',
// // //         fontWeight: '600',
// // //     },
// // // });








// // import React, { useState, useEffect } from 'react';
// // import {
// //     View,
// //     Text,
// //     StyleSheet,
// //     FlatList,
// //     TouchableOpacity,
// //     Image,
// //     ActivityIndicator,
// //     RefreshControl,
// // } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { Ionicons } from '@expo/vector-icons';
// // import { useNavigation } from '@react-navigation/native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { API_BASE_URL } from '../../api/config';

// // const THEME = {
// //     primary: '#0F4C5C',
// //     accent: '#4F46E5',
// //     background: '#F5F7FA',
// //     text: '#111',
// //     muted: '#666',
// // };

// // export default function HomeFeedScreen() {
// //     const navigation = useNavigation<any>();
// //     const [jobs, setJobs] = useState<any[]>([]);
// //     const [loading, setLoading] = useState(true);
// //     const [refreshing, setRefreshing] = useState(false);
// //     const [userName, setUserName] = useState('there');
// //     const [bookmarked, setBookmarked] = useState<{ [key: string]: boolean }>({});

// //     const fetchJobs = async (isRefresh = false) => {
// //         if (isRefresh) setRefreshing(true);
// //         try {
// //             const res = await fetch(`${API_BASE_URL}/api/jobs`);
// //             const data = await res.json();

// //             if (data.success) {
// //                 setJobs(
// //                     data.jobs.map((j: any) => ({
// //                         id: j._id,
// //                         title: j.title,
// //                         company: j.companyId?.name || 'Company',
// //                         location: j.location,
// //                         salary: j.salary || 'Not disclosed',
// //                         type: j.type || 'Full-time',
// //                         tags: j.skills || [],
// //                         logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(
// //                             j.companyId?.name || 'C'
// //                         )}&background=4F46E5&color=fff`,
// //                     }))
// //                 );
// //             }
// //         } catch (e) {
// //             console.log(e);
// //         } finally {
// //             setLoading(false);
// //             setRefreshing(false);
// //         }
// //     };

// //     useEffect(() => {
// //         fetchJobs();
// //         AsyncStorage.getItem('user').then(u => {
// //             if (u) {
// //                 const parsed = JSON.parse(u);
// //                 setUserName(parsed.name?.split(' ')[0] || 'there');
// //             }
// //         });
// //     }, []);

// //     const renderJobCard = ({ item }: { item: any }) => (
// //         <TouchableOpacity
// //             style={styles.card}
// //             activeOpacity={0.8}
// //             onPress={() => navigation.navigate('JobDetails', { job: item })}
// //         >
// //             {/* HEADER */}
// //             <View style={styles.header}>
// //                 <Image source={{ uri: item.logo }} style={styles.logo} />

// //                 <View style={{ flex: 1 }}>
// //                     <Text style={styles.title} numberOfLines={1}>
// //                         {item.title}
// //                     </Text>
// //                     <Text style={styles.company}>{item.company}</Text>
// //                 </View>

// //                 <TouchableOpacity
// //                     onPress={() =>
// //                         setBookmarked(prev => ({
// //                             ...prev,
// //                             [item.id]: !prev[item.id],
// //                         }))
// //                     }
// //                 >
// //                     <Ionicons
// //                         name={bookmarked[item.id] ? 'bookmark' : 'bookmark-outline'}
// //                         size={20}
// //                         color={bookmarked[item.id] ? THEME.accent : '#999'}
// //                     />
// //                 </TouchableOpacity>
// //             </View>

// //             {/* INFO */}
// //             <View style={styles.infoRow}>
// //                 <View style={styles.infoItem}>
// //                     <Ionicons name="location-outline" size={14} color={THEME.accent} />
// //                     <Text style={styles.infoText}>{item.location}</Text>
// //                 </View>

// //                 <View style={styles.infoItem}>
// //                     <Ionicons name="cash-outline" size={14} color={THEME.accent} />
// //                     <Text style={styles.infoText}>{item.salary}</Text>
// //                 </View>

// //                 <View style={styles.infoItem}>
// //                     <Ionicons name="briefcase-outline" size={14} color={THEME.accent} />
// //                     <Text style={styles.infoText}>{item.type}</Text>
// //                 </View>
// //             </View>

// //             {/* TAGS */}
// //             <View style={styles.tags}>
// //                 {item.tags.slice(0, 2).map((tag: string, i: number) => (
// //                     <Text key={i} style={styles.tag}>
// //                         {tag}
// //                     </Text>
// //                 ))}
// //             </View>
// //         </TouchableOpacity>
// //     );

// //     return (
// //         <SafeAreaView style={styles.container}>
// //             {/* HEADER */}
// //             <View style={styles.topHeader}>
// //                 <View>
// //                     <Text style={styles.greeting}>Hello {userName} 👋</Text>
// //                     <Text style={styles.subtitle}>Find your next job</Text>
// //                 </View>

// //                 <Ionicons name="notifications-outline" size={24} color={THEME.accent} />
// //             </View>

// //             {/* LIST */}
// //             <FlatList
// //                 data={jobs}
// //                 keyExtractor={(item) => item.id}
// //                 renderItem={renderJobCard}
// //                 contentContainerStyle={{ padding: 16 }}
// //                 refreshControl={
// //                     <RefreshControl
// //                         refreshing={refreshing}
// //                         onRefresh={() => fetchJobs(true)}
// //                     />
// //                 }
// //                 ListEmptyComponent={
// //                     loading ? (
// //                         <ActivityIndicator size="large" color={THEME.accent} />
// //                     ) : (
// //                         <Text style={{ textAlign: 'center', marginTop: 50 }}>
// //                             No jobs found
// //                         </Text>
// //                     )
// //                 }
// //             />
// //         </SafeAreaView>
// //     );
// // }

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: THEME.background,
// //     },

// //     topHeader: {
// //         padding: 16,
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //     },

// //     greeting: {
// //         fontSize: 22,
// //         fontWeight: '700',
// //         color: THEME.text,
// //     },

// //     subtitle: {
// //         fontSize: 13,
// //         color: THEME.muted,
// //         marginTop: 2,
// //     },

// //     card: {
// //         backgroundColor: '#fff',
// //         padding: 14,
// //         borderRadius: 14,
// //         marginBottom: 12,
// //         shadowColor: '#000',
// //         shadowOpacity: 0.06,
// //         shadowRadius: 8,
// //         shadowOffset: { width: 0, height: 3 },
// //         elevation: 2,
// //     },

// //     header: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         marginBottom: 10,
// //     },

// //     logo: {
// //         width: 40,
// //         height: 40,
// //         borderRadius: 10,
// //         marginRight: 10,
// //     },

// //     title: {
// //         fontSize: 14,
// //         fontWeight: '700',
// //         color: THEME.text,
// //     },

// //     company: {
// //         fontSize: 12,
// //         color: THEME.muted,
// //         marginTop: 2,
// //     },

// //     infoRow: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         marginBottom: 10,
// //     },

// //     infoItem: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         gap: 4,
// //     },

// //     infoText: {
// //         fontSize: 11,
// //         color: '#555',
// //     },

// //     tags: {
// //         flexDirection: 'row',
// //         gap: 6,
// //     },

// //     tag: {
// //         fontSize: 10,
// //         backgroundColor: '#EEF2FF',
// //         color: '#4F46E5',
// //         paddingHorizontal: 8,
// //         paddingVertical: 3,
// //         borderRadius: 6,
// //     },
// // });













// import React, { useState, useEffect } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     FlatList,
//     TouchableOpacity,
//     Image,
//     ActivityIndicator,
//     RefreshControl,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_BASE_URL } from '../../api/config';

// const THEME = {
//     primary: '#0F4C5C',
//     accent: '#4F46E5',
//     background: '#F5F7FA',
//     text: '#111',
//     muted: '#666',
// };

// export default function HomeFeedScreen() {
//     const navigation = useNavigation<any>();
//     const [jobs, setJobs] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [userName, setUserName] = useState('there');
//     const [bookmarked, setBookmarked] = useState<{ [key: string]: boolean }>({});

//     const fetchJobs = async (isRefresh = false) => {
//         if (isRefresh) setRefreshing(true);
//         try {
//             const res = await fetch(`${API_BASE_URL}/api/jobs`);
//             const data = await res.json();

//             if (data.success) {
//                 setJobs(
//                     data.jobs.map((j: any) => ({
//                         id: j._id,
//                         title: j.title,
//                         company: j.companyId?.name || 'Company',
//                         location: j.location,
//                         salary: j.salary || 'Not disclosed',
//                         type: j.type || 'Full-time',
//                         tags: j.skills || [],
//                         logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(
//                             j.companyId?.name || 'C'
//                         )}&background=4F46E5&color=fff`,
//                     }))
//                 );
//             }
//         } catch (e) {
//             console.log(e);
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     };

//     useEffect(() => {
//         fetchJobs();
//         AsyncStorage.getItem('user').then(u => {
//             if (u) {
//                 const parsed = JSON.parse(u);
//                 setUserName(parsed.name?.split(' ')[0] || 'there');
//             }
//         });
//     }, []);

//     const renderJobCard = ({ item, index }: { item: any; index: number }) => (
//         <View style={{ marginTop: index === 0 ? 10 : 0 }}>
//             <TouchableOpacity
//                 style={styles.card}
//                 activeOpacity={0.8}
//                 onPress={() => navigation.navigate('JobDetails', { job: item })}
//             >
//                 {/* HEADER */}
//                 <View style={styles.header}>
//                     <Image source={{ uri: item.logo }} style={styles.logo} />

//                     <View style={{ flex: 1 }}>
//                         <Text style={styles.title} numberOfLines={1}>
//                             {item.title}
//                         </Text>
//                         <Text style={styles.company}>{item.company}</Text>
//                     </View>

//                     <TouchableOpacity
//                         onPress={() =>
//                             setBookmarked(prev => ({
//                                 ...prev,
//                                 [item.id]: !prev[item.id],
//                             }))
//                         }
//                     >
//                         <Ionicons
//                             name={bookmarked[item.id] ? 'bookmark' : 'bookmark-outline'}
//                             size={20}
//                             color={bookmarked[item.id] ? THEME.accent : '#999'}
//                         />
//                     </TouchableOpacity>
//                 </View>

//                 {/* INFO */}
//                 <View style={styles.infoRow}>
//                     <View style={styles.infoItem}>
//                         <Ionicons name="location-outline" size={14} color={THEME.accent} />
//                         <Text style={styles.infoText}>{item.location}</Text>
//                     </View>

//                     <View style={styles.infoItem}>
//                         <Ionicons name="cash-outline" size={14} color={THEME.accent} />
//                         <Text style={styles.infoText}>{item.salary}</Text>
//                     </View>

//                     <View style={styles.infoItem}>
//                         <Ionicons name="briefcase-outline" size={14} color={THEME.accent} />
//                         <Text style={styles.infoText}>{item.type}</Text>
//                     </View>
//                 </View>

//                 {/* TAGS */}
//                 <View style={styles.tags}>
//                     {item.tags.slice(0, 2).map((tag: string, i: number) => (
//                         <Text key={i} style={styles.tag}>
//                             {tag}
//                         </Text>
//                     ))}
//                 </View>
//             </TouchableOpacity>
//         </View>
//     );

//     return (
//         <SafeAreaView style={styles.container}>
//             {/* HEADER */}
//             <View style={styles.topHeader}>
//                 <View>
//                     <Text style={styles.greeting}>Hello {userName} 👋</Text>
//                     <Text style={styles.subtitle}>Find your next job</Text>
//                 </View>

//                 <Ionicons name="notifications-outline" size={24} color={THEME.accent} />
//             </View>

//             {/* SEARCH BAR */}
//             <View style={styles.searchWrapper}>
//                 <View style={styles.searchBar}>
//                     <Ionicons name="search" size={18} color="#999" />
//                     <Text style={styles.searchText}>Search jobs, companies...</Text>
//                     <Ionicons name="options-outline" size={18} color="#555" />
//                 </View>
//             </View>

//             {/* LIST */}
//             <FlatList
//                 data={jobs}
//                 keyExtractor={(item) => item.id}
//                 renderItem={renderJobCard}
//                 contentContainerStyle={{
//                     paddingHorizontal: 16,
//                     paddingBottom: 120,
//                     paddingTop: 20, // 🔥 animation space
//                 }}
//                 refreshControl={
//                     <RefreshControl
//                         refreshing={refreshing}
//                         onRefresh={() => fetchJobs(true)}
//                     />
//                 }
//                 ListEmptyComponent={
//                     loading ? (
//                         <ActivityIndicator size="large" color={THEME.accent} />
//                     ) : (
//                         <Text style={{ textAlign: 'center', marginTop: 50 }}>
//                             No jobs found
//                         </Text>
//                     )
//                 }
//             />
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: THEME.background,
//     },

//     topHeader: {
//         padding: 16,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },

//     greeting: {
//         fontSize: 22,
//         fontWeight: '700',
//         color: THEME.text,
//     },

//     subtitle: {
//         fontSize: 13,
//         color: THEME.muted,
//         marginTop: 2,
//     },

//     searchWrapper: {
//         paddingHorizontal: 16,
//         marginBottom: 6,
//     },

//     searchBar: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         paddingHorizontal: 12,
//         paddingVertical: 10,
//         justifyContent: 'space-between',

//         shadowColor: '#000',
//         shadowOpacity: 0.05,
//         shadowRadius: 6,
//         shadowOffset: { width: 0, height: 2 },
//         elevation: 2,
//     },

//     searchText: {
//         flex: 1,
//         marginLeft: 8,
//         color: '#999',
//         fontSize: 13,
//     },

//     card: {
//         backgroundColor: '#fff',
//         padding: 14,
//         borderRadius: 14,
//         marginBottom: 12,
//         shadowColor: '#000',
//         shadowOpacity: 0.06,
//         shadowRadius: 8,
//         shadowOffset: { width: 0, height: 3 },
//         elevation: 2,
//     },

//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 10,
//     },

//     logo: {
//         width: 40,
//         height: 40,
//         borderRadius: 10,
//         marginRight: 10,
//     },

//     title: {
//         fontSize: 14,
//         fontWeight: '700',
//         color: THEME.text,
//     },

//     company: {
//         fontSize: 12,
//         color: THEME.muted,
//         marginTop: 2,
//     },

//     infoRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 10,
//     },

//     infoItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 4,
//     },

//     infoText: {
//         fontSize: 11,
//         color: '#555',
//     },

//     tags: {
//         flexDirection: 'row',
//         gap: 6,
//     },

//     tag: {
//         fontSize: 10,
//         backgroundColor: '#EEF2FF',
//         color: '#4F46E5',
//         paddingHorizontal: 8,
//         paddingVertical: 3,
//         borderRadius: 6,
//     },
// });














import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl,
    Animated,
    Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../api/config';
import { LinearGradient } from 'expo-linear-gradient';

const THEME = {
    primary: '#0F4C5C',
    accent: '#1f819a',
    background: '#F5F7FA',
    text: '#111',
    muted: '#666',
};

// 🎨 Animated Border Component
const AnimatedBorderBox = React.forwardRef<any, { children: React.ReactNode; width?: number; height?: number }>(
    ({ children, width = 350, height = 110 }, ref) => {
        const animatedValue = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            Animated.loop(
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 3500,
                    easing: Easing.linear,
                    useNativeDriver: false,
                })
            ).start();
        }, [animatedValue]);

        const boxWidth = width;
        const boxHeight = height;
        const borderRadius = 15;

        const borderInterpolation = animatedValue.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [0, boxWidth, boxWidth + boxHeight, boxWidth * 2 + boxHeight, boxWidth * 2 + boxHeight * 2],
        });

        return (
            <View style={styles.animatedBoxContainer}>
                {/* Top Border Line */}
                <Animated.View
                    style={[
                        styles.borderLine,
                        styles.borderTop,
                        {
                            width: animatedValue.interpolate({
                                inputRange: [0, 0.25, 0.25, 1],
                                outputRange: [0, boxWidth, boxWidth, boxWidth],
                            }),
                        },
                    ]}
                />

                {/* Right Border Line */}
                <Animated.View
                    style={[
                        styles.borderLine,
                        styles.borderRight,
                        {
                            height: animatedValue.interpolate({
                                inputRange: [0, 0.25, 0.5, 0.5, 1],
                                outputRange: [0, 0, boxHeight, boxHeight, boxHeight],
                            }),
                        },
                    ]}
                />

                {/* Bottom Border Line */}
                <Animated.View
                    style={[
                        styles.borderLine,
                        styles.borderBottom,
                        {
                            width: animatedValue.interpolate({
                                inputRange: [0, 0.5, 0.75, 0.75, 1],
                                outputRange: [0, 0, boxWidth, boxWidth, boxWidth],
                            }),
                        },
                    ]}
                />

                {/* Left Border Line */}
                <Animated.View
                    style={[
                        styles.borderLine,
                        styles.borderLeft,
                        {
                            height: animatedValue.interpolate({
                                inputRange: [0, 0.75, 1],
                                outputRange: [0, 0, boxHeight],
                            }),
                        },
                    ]}
                />

                {/* Main Content Box */}
                <View style={styles.contentBox}>
                    {children}
                </View>
            </View>
        );
    }
);

export default function HomeFeedScreen() {
    const navigation = useNavigation<any>();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userName, setUserName] = useState('there');
    const [bookmarked, setBookmarked] = useState<{ [key: string]: boolean }>({});

    const fetchJobs = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/jobs`);
            const data = await res.json();

            if (data.success) {
                setJobs(
                    data.jobs.map((j: any) => ({
                        id: j._id,
                        title: j.title,
                        company: j.companyId?.name || 'Company',
                        location: j.location,
                        salary: j.salary || 'Not disclosed',
                        type: j.type || 'Full-time',
                        tags: j.skills || [],
                        logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            j.companyId?.name || 'C'
                        )}&background=0F4C5C&color=fff`,
                    }))
                );
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchJobs();
        AsyncStorage.getItem('user').then(u => {
            if (u) {
                const parsed = JSON.parse(u);
                setUserName(parsed.name?.split(' ')[0] || 'there');
            }
        });
    }, []);

    const renderJobCard = ({ item, index }: { item: any; index: number }) => (
        <View style={{ marginTop: index === 0 ? 10 : 0 }}>
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('JobDetails', { job: item })}
            >
                <View style={styles.header}>
                    <Image source={{ uri: item.logo }} style={styles.logo} />

                    <View style={{ flex: 1 }}>
                        <Text style={styles.title} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <Text style={styles.company}>{item.company}</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() =>
                            setBookmarked(prev => ({
                                ...prev,
                                [item.id]: !prev[item.id],
                            }))
                        }
                    >
                        <Ionicons
                            name={bookmarked[item.id] ? 'bookmark' : 'bookmark-outline'}
                            size={20}
                            color={bookmarked[item.id] ? THEME.accent : '#999'}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Ionicons name="location-outline" size={14} color={THEME.accent} />
                        <Text style={styles.infoText}>{item.location}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Ionicons name="cash-outline" size={14} color={THEME.accent} />
                        <Text style={styles.infoText}>{item.salary}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Ionicons name="briefcase-outline" size={14} color={THEME.accent} />
                        <Text style={styles.infoText}>{item.type}</Text>
                    </View>
                </View>

                <View style={styles.tags}>
                    {item.tags.slice(0, 2).map((tag: string, i: number) => (
                        <Text key={i} style={styles.tag}>
                            {tag}
                        </Text>
                    ))}
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* 🎨 Animated Border Header */}
            <AnimatedBorderBox width={350} height={110}>
                <View style={styles.headerContent}>
                    <View style={styles.textContainer}>
                        <Text style={styles.greeting}>
                            Hello {userName} 👋
                        </Text>
                        <Text style={styles.subtitleText}>
                            Find your next job 🚀
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.bellContainer} activeOpacity={0.7}>
                        <Ionicons name="notifications-outline" size={22} color="#1b1717" />
                        <View style={styles.dot} />
                    </TouchableOpacity>
                </View>
            </AnimatedBorderBox>

            <View style={styles.searchWrapper}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={18} color="#999" />
                    <Text style={styles.searchText}>Search jobs, companies...</Text>
                    <Ionicons name="options-outline" size={18} color="#555" />
                </View>
            </View>

            <FlatList
                data={jobs}
                keyExtractor={(item) => item.id}
                renderItem={renderJobCard}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 20,
                  // ✅ FIXED (no extra gap)
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => fetchJobs(true)}
                    />
                }
              
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.background,
    },

    topHeader: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    headerContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },

    bellContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(241, 235, 235, 0.18)',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },

    dot: {
        position: 'absolute',
        top: 7,
        right: 7,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },

    greeting: {
        fontSize: 20,
        fontWeight: '700',
        color: THEME.text,
        marginBottom: 6,
    },

    subtitle: {
        fontSize: 13,
        color: THEME.muted,
        marginTop: 2,
    },

    // 🎨 Animated Border Styles
    animatedBoxContainer: {
        position: 'relative',
        width: '100%',
        maxWidth: 350,
        height: 110,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },

    borderLine: {
        position: 'absolute',
        backgroundColor: 'transparent',
        borderWidth: 2.5,
    },

    borderTop: {
        top: 0,
        left: 0,
        borderColor: '#1f819a',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    },

    borderRight: {
        top: 0,
        right: 0,
        borderColor: '#1f819a',
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
    },

    borderBottom: {
        bottom: 0,
        right: 0,
        borderColor: '#1f819a',
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderLeftColor: 'transparent',
    },

    borderLeft: {
        bottom: 0,
        left: 0,
        borderColor: '#1f819a',
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
    },

    contentBox: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(31, 129, 154, 0.05)',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    subtitleText: {
        fontSize: 12,
        fontWeight: '600',
        color: THEME.accent,
        textAlign: 'center',
    },

    searchWrapper: {
        paddingHorizontal: 16,
        marginBottom: 6,
    },

    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        justifyContent: 'space-between',
        elevation: 2,
    },

    searchText: {
        flex: 1,
        marginLeft: 8,
        color: '#999',
        fontSize: 13,
    },

    card: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 14,
        marginBottom: 12,
        elevation: 2,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },

    logo: {
        width: 40,
        height: 40,
        borderRadius: 10,
        marginRight: 10,
    },

    title: {
        fontSize: 14,
        fontWeight: '700',
        color: THEME.text,
    },

    company: {
        fontSize: 12,
        color: THEME.muted,
        marginTop: 2,
    },

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    infoText: {
        fontSize: 11,
        color: '#555',
    },

    tags: {
        flexDirection: 'row',
        gap: 6,
    },

    tag: {
        fontSize: 10,
        backgroundColor: '#EEF2FF',
        color: '#000000',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
});