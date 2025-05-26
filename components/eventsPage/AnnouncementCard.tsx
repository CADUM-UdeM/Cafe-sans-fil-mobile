import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Items } from "@/constants/types/announcements";
import SPACING from "@/constants/Spacing";
import TYPOGRAPHY from "@/constants/Typography";
import { useState, useEffect } from 'react';
import { Cafe } from "@/constants/types/GET_cafe";

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

    return (
        <TouchableOpacity style={styles.topContainer}>
            <View>
                <Text style={[styles.announTitle, TYPOGRAPHY.heading.large.bold]}>
                    {title}
                </Text>
            </View>
            <View>
                <Text>
                    {content}
                </Text>
                <Text>
                    {cafe?.name}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    topContainer : {
        alignContent: 'center', 
        justifyContent: 'center', 
        flex:1, 
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