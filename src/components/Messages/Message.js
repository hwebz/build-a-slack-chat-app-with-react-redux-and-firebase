import React, { useState, useEffect } from 'react';
import { Comment, Image } from 'semantic-ui-react';
import moment from 'moment';

import DisplayIf from '../Common/DisplayIf'

const Message = ({ message, user }) => {
    const [currentUser, setCurrentUser] = useState(user || {});

    useEffect(() => {
        setCurrentUser(user);
    }, [user]);

    const isOwnMessage = () => {
        return message.user.id === currentUser.uid ? 'message__self' : '';
    }

    const timeFromNow = () => moment(message.timestamp).fromNow();

    const isImage = message => {
        return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
    }

    return (
        <Comment>
            <Comment.Avatar src={message.user.avatar} />
            <Comment.Content className={isOwnMessage()}>
                <Comment.Author as="a">{message.user.name}</Comment.Author>
                <Comment.Metadata>{timeFromNow()}</Comment.Metadata>
                <DisplayIf condition={isImage(message)}>
                    <Image src={message.image} className="message__image" />
                </DisplayIf>
                <DisplayIf condition={!isImage(message)}>
                    <Comment.Text>{message.content}</Comment.Text>
                </DisplayIf>
            </Comment.Content>
        </Comment>
    )
}

export default Message;