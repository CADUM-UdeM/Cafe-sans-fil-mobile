import { 
        View, 
        Text, 
        ActivityIndicator, 
        Touchable, 
        TouchableOpacity,
        StyleSheet
    } 
from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Announcements from "@/components/eventsPage/Announcements";
import Events from "@/components/eventsPage/Events";
import { useEffect, useState } from 'react';
import { AnnouncementsData } from '@/constants/types/announcements';
import React from 'react';



export default function EventsnMore() {
    const [index, setIndex] = useState(1); // which component to display
    return (
        <SafeAreaView>
            <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 18}}>
                <View style={styles.topTab}>
                    <TouchableOpacity onPress={() => setIndex(1)} style={[{backgroundColor: 'red'}, styles.button]}>
                        <Text>Announcements</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIndex(2)} style={[{backgroundColor: 'blue'}, styles.button]}>
                        <Text>Events</Text>
                    </TouchableOpacity>
                </View>
                <View>
                {index == 1 ?
                    <Announcements /> : 
                    <Events />
                    // (index == 2 ?
                    //     <Events /> : <Text>Error</Text>
                    // )
                }
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    topTab : {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '8%'
    },
    button: {
        flex: 1,
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
    }
})
