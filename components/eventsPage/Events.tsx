import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";

import { EventsData } from '@/constants/types/events';
import { useEffect, useState } from 'react';
import EventsCard from './EventCard';


export default function Events() {
    return (
        <View style={styles.container}>
            <Text>
                Events
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
});
