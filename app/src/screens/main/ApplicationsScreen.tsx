import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '../../api/config';
import ApplicationCard from './ApplicationCard';

const THEME = {
    primary: '#0F4C5C',
    background: '#F6F8FB',
    surface: '#FFFFFF',
    text: '#0F172A',
    muted: '#64748B',
    border: '#E2E8F0',
};

const FILTERS = ['All', 'New', 'Under Review', 'Shortlisted', 'Rejected'] as const;
type FilterType = typeof FILTERS[number];

type ApplicationItem = {
    _id: string;
    status: string;
    appliedAt: string;
    jobId?: {
        title?: string;
        location?: string;
        companyId?: { name?: string };
    };
};

export default function ApplicationsScreen() {
    const [applications, setApplications] = useState<ApplicationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState<FilterType>('All');

    const fetchApplications = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                setApplications([]);
                return;
            }

            const res = await fetch(`${API_BASE_URL}/api/applications/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data?.success && Array.isArray(data.applications)) {
                setApplications(data.applications);
            } else {
                setApplications([]);
            }
        } catch (error) {
            console.error('Failed to fetch applications', error);
            setApplications([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchApplications();
        }, [fetchApplications])
    );

    const filteredApplications = useMemo(() => {
        if (activeFilter === 'All') return applications;
        return applications.filter((item) => item.status === activeFilter);
    }, [activeFilter, applications]);

    const statusCounts = useMemo(
        () => ({
            All: applications.length,
            New: applications.filter((item) => item.status === 'New').length,
            'Under Review': applications.filter((item) => item.status === 'Under Review').length,
            Shortlisted: applications.filter((item) => item.status === 'Shortlisted').length,
            Rejected: applications.filter((item) => item.status === 'Rejected').length,
        }),
        [applications]
    );

    const inProgressCount = statusCounts.New + statusCounts['Under Review'];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topSection}>
                <View style={styles.headerCard}>
                    <View>
                        <Text style={styles.headerTitle}>My Applications</Text>
                        <Text style={styles.headerSubtitle}>Track your application status updates</Text>
                    </View>
                    <View style={styles.headerBadge}>
                        <Text style={styles.headerBadgeText}>Live</Text>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={[styles.statCard, styles.statCardPrimary]}>
                        <Text style={styles.statLabelPrimary}>Total</Text>
                        <Text style={styles.statValuePrimary}>{statusCounts.All}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>In Progress</Text>
                        <Text style={styles.statValue}>{inProgressCount}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Shortlisted</Text>
                        <Text style={styles.statValue}>{statusCounts.Shortlisted}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.filterContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRow}
                >
                    {FILTERS.map((filter) => {
                        const isActive = activeFilter === filter;
                        return (
                            <TouchableOpacity
                                key={filter}
                                activeOpacity={0.8}
                                onPress={() => setActiveFilter(filter)}
                                style={[styles.filterPill, isActive && styles.filterPillActive]}
                            >
                                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                                    {filter}
                                </Text>
                                <View style={[styles.countBubble, isActive && styles.countBubbleActive]}>
                                    <Text style={[styles.countText, isActive && styles.countTextActive]}>
                                        {statusCounts[filter]}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <FlatList
                data={filteredApplications}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <ApplicationCard application={item} index={index} />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => fetchApplications(true)}
                        tintColor={THEME.primary}
                    />
                }
                ListEmptyComponent={
                    loading ? (
                        <ActivityIndicator size="large" color={THEME.primary} style={styles.loader} />
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyTitle}>No applications yet</Text>
                            <Text style={styles.emptySubtitle}>
                                Apply to jobs and your status will appear here.
                            </Text>
                        </View>
                    )
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
    topSection: {
        paddingHorizontal: 16,
        paddingTop: 35,
        paddingBottom: 6,
        gap: 10,
    },
    headerCard: {
        borderRadius: 18,
        backgroundColor: THEME.surface,
        borderWidth: 1,
        borderColor: '#DBE5EE',
        paddingHorizontal: 14,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#0F172A',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    headerTitle: {
        fontSize: 23,
        fontWeight: '800',
        color: THEME.text,
    },
    headerSubtitle: {
        marginTop: 4,
        fontSize: 13,
        color: THEME.muted,
    },
    headerBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        backgroundColor: '#E8F4F7',
        borderWidth: 1,
        borderColor: '#C8DDE4',
    },
    headerBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: THEME.primary,
        letterSpacing: 0.3,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    statCard: {
        flex: 1,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DCE6EE',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    statCardPrimary: {
        backgroundColor: THEME.primary,
        borderColor: THEME.primary,
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#64748B',
    },
    statValue: {
        marginTop: 3,
        fontSize: 20,
        fontWeight: '800',
        color: '#0F172A',
    },
    statLabelPrimary: {
        fontSize: 11,
        fontWeight: '700',
        color: '#DDEEF2',
    },
    statValuePrimary: {
        marginTop: 3,
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    filterContainer: {
        marginHorizontal: 16,
        marginTop: 4,
        marginBottom: 2,
        borderRadius: 14,
        backgroundColor: '#EEF3F8',
        borderWidth: 1,
        borderColor: '#DEE8F1',
    },
    filterRow: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        gap: 8,
    },
    filterPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: THEME.border,
        backgroundColor: THEME.surface,
    },
    filterPillActive: {
        borderColor: THEME.primary,
        backgroundColor: THEME.primary,
    },
    filterText: {
        fontSize: 12,
        fontWeight: '700',
        color: THEME.muted,
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
    countBubble: {
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E2E8F0',
        paddingHorizontal: 4,
    },
    countBubbleActive: {
        backgroundColor: 'rgba(255,255,255,0.24)',
    },
    countText: {
        fontSize: 10,
        fontWeight: '700',
        color: THEME.muted,
    },
    countTextActive: {
        color: '#FFFFFF',
    },
    listContent: {
        paddingHorizontal: 14,
        paddingTop: 10,
        paddingBottom: 30,
        gap: 10,
    },
    loader: {
        marginTop: 60,
    },
    emptyState: {
        marginTop: 70,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: THEME.text,
    },
    emptySubtitle: {
        marginTop: 6,
        fontSize: 13,
        color: THEME.muted,
        textAlign: 'center',
    },
});
