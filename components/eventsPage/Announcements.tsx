import { AnnouncementsData } from '@/constants/types/announcements';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';


export default function Announcements() {
    const [isLoading, setIsLoading] = useState(true);
    const [announcements, setAnnouncements] = useState<AnnouncementsData>();
    useEffect(() => {
        // fetch announcement list from API
        const fetchAnnouncements = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://cafesansfil-api-r0kj.onrender.com/api/announcements`
                );
                const json : AnnouncementsData = await response.json();
                setAnnouncements(json);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnnouncements();
        
    }, []);

    if (isLoading){
        return(
            <View style={{flex:1, alignContent:'center', justifyContent:'center'}}>
                <ActivityIndicator size={'large'} />
            </View>
        )
    }
    return (
        <View>
            <Text>
                Announcements
            </Text>
            <FlatList data={announcements?.items}
                renderItem={(item) =>
                    <Text>
                        {item.item.title}
                    </Text>
                }
            />
        </View>
    )

}