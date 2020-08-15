import React, { useState, useEffect } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import MessageList from './MessageList';

const Messages = ({ currentChannel, currentUser }) => {
    const [channel] = useState(currentChannel || {});
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progressBar, setProgressBar] = useState(false);
    const [numUniqueUsers, setNumUniqueUsers] = useState(0);

    const messagesRef = firebase.database().ref('messages');

    /*eslint-disable */
    useEffect(() => {
        if (currentChannel && currentUser) {
            let loadedMessages = [];
            messagesRef
                .child(currentChannel.id)
                .on('child_added', snap => {
                    loadedMessages.push(snap.val());
                    setMessages([...loadedMessages]);
                    setLoading(false);
                    countUniqueUsers([...loadedMessages]);
                });
        }

        return () => {
            messagesRef.off();
        }
    }, [currentChannel]);
    /*eslint-enable */

    const isProgressBarVisible = (percent, uploadState) => {
        setProgressBar(uploadState == 'uploading' && percent > 0)
    }

    const countUniqueUsers = (msgs) => {
        const uniqueUsers = msgs.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        }, []);

        const numUniqueUsers = uniqueUsers.length;
        const numberUniqueUsersStr = `${numUniqueUsers} user${numUniqueUsers > 1 ? 's' : ''}`;
        setNumUniqueUsers(numberUniqueUsersStr);
    }

    return (
        <React.Fragment>
            <MessagesHeader
                channelName={channel.name}
                numUniqueUsers={numUniqueUsers}
            />

            <Segment>
                <Comment.Group className={progressBar ? 'messages__progress' : 'messages'}>
                    {/* Messages */}
                    <MessageList
                        messages={messages}
                        currentUser={currentUser}
                    />
                </Comment.Group>
            </Segment>

            <MessageForm
                messagesRef={messagesRef}
                currentChannel={currentChannel}
                currentUser={currentUser}
                isProgressBarVisible={isProgressBarVisible}
            />
        </React.Fragment>
    )
}

export default Messages;