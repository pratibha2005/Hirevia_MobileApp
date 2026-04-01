import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ApplicationCardProps = {
    application: {
        _id: string;
        status: string;
        appliedAt: string;
        jobId?: {
            title?: string;
            location?: string;
            companyId?: {
                name?: string;
            };
        };
    };
    index: number;
};

const THEME = {
    primary: '#0F4C5C',
    surface: '#FFFFFF',
    text: '#0F172A',
    muted: '#64748B',
    border: '#E2E8F0',
};

const STATUS_CONFIG: Record<string, { text: string; bg: string; dot: string }> = {
    New: { text: '#2563EB', bg: '#DBEAFE', dot: '#2563EB' },
    'Under Review': { text: '#D97706', bg: '#FEF3C7', dot: '#D97706' },
    Shortlisted: { text: '#059669', bg: '#D1FAE5', dot: '#059669' },
    Rejected: { text: '#6B7280', bg: '#F1F5F9', dot: '#6B7280' },
};

export default function ApplicationCard({ application }: ApplicationCardProps) {
    const job = application.jobId;
    const companyName = job?.companyId?.name || 'Unknown Company';
    const jobTitle = job?.title || 'Unknown Role';
    const location = job?.location || 'Not specified';

    const appliedDate = new Date(application.appliedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    const statusCfg = STATUS_CONFIG[application.status] || STATUS_CONFIG.New;

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.85}>
            <View style={styles.headerRow}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{companyName.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.titleBlock}>
                    <Text style={styles.jobTitle} numberOfLines={1}>
                        {jobTitle}
                    </Text>
                    <Text style={styles.companyName} numberOfLines={1}>
                        {companyName}
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={THEME.muted} />
            </View>

            <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={13} color={THEME.muted} />
                    <Text style={styles.metaText}>{appliedDate}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Ionicons name="location-outline" size={13} color={THEME.muted} />
                    <Text style={styles.metaText} numberOfLines={1}>
                        {location}
                    </Text>
                </View>
            </View>

            <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}> 
                <View style={[styles.statusDot, { backgroundColor: statusCfg.dot }]} />
                <Text style={[styles.statusText, { color: statusCfg.text }]}>{application.status}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: THEME.surface,
        borderWidth: 1,
        borderColor: THEME.border,
        borderRadius: 16,
        padding: 14,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 11,
        backgroundColor: THEME.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
    },
    titleBlock: {
        flex: 1,
        marginLeft: 12,
        marginRight: 8,
    },
    jobTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: THEME.text,
    },
    companyName: {
        marginTop: 2,
        fontSize: 12,
        color: THEME.muted,
    },
    metaRow: {
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        maxWidth: '50%',
    },
    metaText: {
        fontSize: 12,
        color: THEME.muted,
        fontWeight: '500',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        marginTop: 12,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
});
