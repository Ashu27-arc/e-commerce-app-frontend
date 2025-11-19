import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../utils/theme';
import Button from '../../components/Button';

interface Review {
    id: string;
    name: string;
    date: string;
    rating: number;
    comment: string;
    avatar: string;
}

const ReviewScreen = () => {
    const [selectedTab, setSelectedTab] = useState<'recent' | 'top'>('recent');

    // Sample data based on the image
    const averageRating = 4.16;
    const totalReviews = 12;
    const ratingDistribution = [
        { stars: 5, percentage: 58 },
        { stars: 4, percentage: 25 },
        { stars: 3, percentage: 0 },
        { stars: 2, percentage: 8 },
        { stars: 1, percentage: 8 },
    ];

    const reviews: Review[] = [
        {
            id: '1',
            name: 'Sally Moorey',
            date: '30 May, 2022',
            rating: 4,
            comment: 'Awesome and comfy! Totally recommend.',
            avatar: 'https://i.pravatar.cc/150?img=1',
        },
        {
            id: '2',
            name: 'Matthew Perry',
            date: '30 May, 2022',
            rating: 4,
            comment: 'Easy to assemble and also comfy to sleep on.',
            avatar: 'https://i.pravatar.cc/150?img=2',
        },
    ];

    const renderStars = (rating: number, size: number = 20) => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                        key={star}
                        name={star <= rating ? 'star' : 'star-outline'}
                        size={size}
                        color={star <= rating ? '#FF8C42' : '#D1D5DB'}
                    />
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reviews</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Rating Summary */}
                <View style={styles.ratingSummary}>
                    <Text style={styles.averageRating}>{averageRating.toFixed(2)}</Text>
                    <Text style={styles.outOf}>/5.</Text>
                </View>

                {renderStars(Math.round(averageRating), 24)}

                <Text style={styles.totalReviews}>{totalReviews} reviews</Text>

                {/* Rating Distribution */}
                <View style={styles.distributionContainer}>
                    {ratingDistribution.map((item) => (
                        <View key={item.stars} style={styles.distributionRow}>
                            <Text style={styles.starLabel}>{item.stars} star</Text>
                            <View style={styles.progressBarContainer}>
                                <View style={[styles.progressBar, { width: `${item.percentage}%` }]} />
                            </View>
                            <Text style={styles.percentageLabel}>{item.percentage}%</Text>
                        </View>
                    ))}
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'top' && styles.inactiveTab]}
                        onPress={() => setSelectedTab('top')}
                    >
                        <Text style={[styles.tabText, selectedTab === 'top' && styles.inactiveTabText]}>
                            Top
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'recent' && styles.activeTab]}
                        onPress={() => setSelectedTab('recent')}
                    >
                        <Text style={[styles.tabText, selectedTab === 'recent' && styles.activeTabText]}>
                            Most recent
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Reviews List */}
                <View style={styles.reviewsList}>
                    {reviews.map((review) => (
                        <View key={review.id} style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <Image source={{ uri: review.avatar }} style={styles.avatar} />
                                <View style={styles.reviewInfo}>
                                    <Text style={styles.reviewerName}>{review.name}</Text>
                                    <Text style={styles.reviewDate}>{review.date}</Text>
                                </View>
                                {renderStars(review.rating, 18)}
                            </View>
                            <Text style={styles.reviewComment}>{review.comment}</Text>
                        </View>
                    ))}
                </View>

                {/* Write Review Button */}
                <View style={styles.buttonContainer}>
                    <Button title="Write a review" onPress={() => { }} backgroundColor="#D97706" />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.lg,
        backgroundColor: colors.white,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.black,
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    ratingSummary: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginTop: spacing.md,
    },
    averageRating: {
        fontSize: 64,
        fontWeight: 'bold',
        color: colors.black,
    },
    outOf: {
        fontSize: 24,
        color: colors.gray,
        marginLeft: spacing.xs,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 4,
        marginTop: spacing.sm,
    },
    totalReviews: {
        textAlign: 'center',
        fontSize: 16,
        color: colors.gray,
        marginTop: spacing.sm,
        marginBottom: spacing.lg,
    },
    distributionContainer: {
        marginBottom: spacing.lg,
    },
    distributionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    starLabel: {
        width: 50,
        fontSize: 14,
        color: colors.gray,
    },
    progressBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        marginHorizontal: spacing.sm,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#FF8C42',
        borderRadius: 4,
    },
    percentageLabel: {
        width: 50,
        textAlign: 'right',
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: spacing.lg,
        gap: spacing.lg,
    },
    tab: {
        paddingBottom: spacing.sm,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: colors.black,
    },
    inactiveTab: {},
    tabText: {
        fontSize: 16,
        fontWeight: '500',
    },
    activeTabText: {
        color: colors.black,
    },
    inactiveTabText: {
        color: colors.gray,
    },
    reviewsList: {
        marginBottom: spacing.lg,
    },
    reviewCard: {
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: spacing.md,
    },
    reviewInfo: {
        flex: 1,
    },
    reviewerName: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 4,
    },
    reviewDate: {
        fontSize: 14,
        color: colors.gray,
    },
    reviewComment: {
        fontSize: 16,
        color: colors.text,
        lineHeight: 24,
    },
    buttonContainer: {
        marginBottom: spacing.xl,
        
    },
});

export default ReviewScreen;