import React, { useState, useEffect } from 'react';
import { Comment } from 'semantic-ui-react';
import moment from 'moment';

const Message = ({ message, user }) => {
    const [currentUser, setCurrentUser] = useState(user || {});

    useEffect(() => {
        setCurrentUser(user);
    }, [user]);

    const isOwnMessage = () => {
        return message.user.id === currentUser.uid ? 'message__self' : '';
    }

    const timeFromNow = () => moment(message.timestamp).fromNow();

    return (
        <Comment>
            <Comment.Avatar src={message.user.avatar} />
            <Comment.Content className={isOwnMessage()}>
                <Comment.Author as="a">{message.user.name}</Comment.Author>
                <Comment.Metadata>{timeFromNow()}</Comment.Metadata>
                <Comment.Text>{message.content}</Comment.Text>
            </Comment.Content>
        </Comment>
    )
}

export default Message;