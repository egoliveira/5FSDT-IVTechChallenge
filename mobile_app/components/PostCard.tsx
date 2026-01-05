import {PostResponse} from "../types/post/PostResponse";
import {Card, Divider, Text} from "react-native-paper";
import React from "react";
import {StyleSheet} from "react-native";
import {format} from "date-fns";

interface Props {
    post: PostResponse,
    style?: any
    onPress?: (post: PostResponse) => void
}

const PostCard: React.FC<Props> = ({post, style, onPress}) => {
    return (
        <Card style={style} onPress={() => {
            onPress?.call(null, post)
        }}>
            <Card.Title title={post.title} titleVariant="titleLarge" titleNumberOfLines={2}/>
            <Divider horizontalInset={true}/>
            <Card.Content>
                <Text variant="titleSmall" numberOfLines={1} style={styles.subject}>{post.subject.name}</Text>
                <Text variant="bodyMedium" numberOfLines={1}>
                    {post.teachingGrade.name} - {post.teachingGrade.teachingLevel.name}
                </Text>
                <Text variant="bodyMedium" numberOfLines={1}>Professor {post.user.name}</Text>
                <Text variant="bodyMedium" numberOfLines={1} style={styles.createdAt}>
                    {format(post.createdAt, "dd/MM/yyyy HH:mm")}
                </Text>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    subject: {
        marginTop: 8,
    },
    createdAt: {
        textAlign: 'right',
        width: '100%'
    }
});

export default PostCard;