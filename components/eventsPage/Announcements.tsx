import { AnnouncementsData } from '@/constants/types/announcements';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import AnnouncementCard from './AnnouncementCard';


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
            <FlatList data={announcements?.items}
                renderItem={(item) =>
                    <AnnouncementCard 
                        id={item.item.id}
                        cafe_id={item.item.cafe_id}
                        title={item.item.title}
                        content={item.item.content}
                        created_at={item.item.created_at}
                        updated_at={item.item.updated_at}
                        active_until={item.item.active_until}
                        tags={item.item.tags}
                        author={item.item.author}
                        interactions={item.item.interactions}
                    />
                }
            />
        </View>
    )

}