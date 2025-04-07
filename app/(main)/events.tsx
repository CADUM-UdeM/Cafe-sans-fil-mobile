import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Announcements from "@/components/eventsPage/Announcements";
import { useEffect, useState } from 'react';
import { AnnouncementsData } from '@/constants/types/announcements';

export default function Events() {
    
    return (
        <SafeAreaView>
            <View style={{alignItems: 'center'}}>
                <Announcements/>
                <Text>
                    aaa
                </Text>
            </View>
        </SafeAreaView>
    )
}