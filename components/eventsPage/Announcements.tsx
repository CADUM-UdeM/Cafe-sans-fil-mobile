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

    // for announ in announcements?.items:
    //    id = announ.items.id

    return (
        <View>
            <FlatList data={announcements?.items}
                renderItem={(announ) =>
                    <AnnouncementCard
                        id={announ.item.id}
                        cafe_id={announ.item.cafe_id}
                        title={announ.item.title}
                        content={announ.item.content}
                        created_at={announ.item.created_at}
                        updated_at={announ.item.updated_at}
                        active_until={announ.item.active_until}
                        tags={announ.item.tags}
                        author={announ.item.author}
                        interactions={announ.item.interactions}
                    />
                }
            />
        </View>
    )

}