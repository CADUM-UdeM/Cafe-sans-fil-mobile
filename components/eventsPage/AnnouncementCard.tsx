import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Items } from "@/constants/types/announcements";
import SPACING from "@/constants/Spacing";
import TYPOGRAPHY from "@/constants/Typography";
import { useState, useEffect } from 'react';
import { Cafe } from "@/constants/types/GET_cafe";
import { router } from "expo-router";
import LottieView from 'lottie-react-native';

export default function AnnouncementCard({
    id,
    cafe_id,
    title,
    content,
    created_at,
    updated_at,
    active_until,
    tags,
    author,
    interactions,
} : Items) {
    const [cafe, setCafe] = useState<Cafe>();
    let active_until_date = new Date(created_at);
    let year = active_until_date.getFullYear();
    let month = (1 + active_until_date.getMonth()).toString().padStart(2, '0'); // getMonth() is zero-based
    let day = active_until_date.getDate().toString().padStart(2, '0');

    let formattedDate = year + '-' + month + '-' + day;

    // fetch cafe data
    useEffect(() => {
        const fetchCafe = async () => {
        fetch(
            `https://cafesansfil-api-r0kj.onrender.com/api/cafes/${cafe_id}`
        )
        .then((response) => response.json())
        .then((json) => {
            setCafe(json);
            //console.log(json)
        })
        .catch((error) => console.error(error))
    };
    fetchCafe();
    }, []);
    useEffect(() => {
        console.log(interactions); 
    }, [interactions]);
    return (
        <View style={{display: 'flex', flexDirection:'row', width: "100%", alignItems: 'center', justifyContent: 'center'}}>
            <View style={interactions.length >=1 ? styles.topContainer1 : styles.topContainer2}>
                <View>
                    <Text>
                        {formattedDate}
                    </Text> 
                </View>
                <View>
                    <Text style={[styles.announTitle, TYPOGRAPHY.heading.large.bold]}>
                        {title}
                    </Text>
                </View>
                <View>
                    <Text>
                        {content}
                    </Text>
                    <Text style={{paddingTop: 7, fontSize: 16, fontWeight: 'bold', textDecorationLine: 'underline'}}
                    onPress={() => router.push(`/cafe/${cafe_id}`)}
                    >
                        {cafe?.name}
                    </Text>
                </View>
            </View>
            <View>
            {interactions.length >= 1 &&
                [...interactions].reverse().map((interaction, index) => {
                    return (
                        <View key={index}>
                            <TouchableOpacity style={styles.sideInteractions}>
                                {interaction.type &&
                                    <LottieView source={require('@/static/like_animation.json')} autoPlay loop />
                                }
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sideContainer : {
        width: "20%",
    },
    sideInteractions:{
        width: "100%",
        backgroundColor: 'pink',
    },
    topContainer1 : {
        alignContent: 'center', 
        justifyContent: 'center', 
        width:"75%",
        borderColor: 'black', 
        borderWidth: 1, 
        borderRadius: 10,
        padding: SPACING.md, 
        marginTop: SPACING.md, 
        marginHorizontal: SPACING.md
    },
    topContainer2 : {
        alignContent: 'center', 
        justifyContent: 'center', 
        width:"87%",
        borderColor: 'black', 
        borderWidth: 1, 
        borderRadius: 10,
        padding: SPACING.md, 
        marginTop: SPACING.md, 
        marginHorizontal: SPACING.md
    },
    announTitle : {
        marginBottom: SPACING.sm,
    },
    titleContainer: {
        backgroundColor: 'green'
    }
})