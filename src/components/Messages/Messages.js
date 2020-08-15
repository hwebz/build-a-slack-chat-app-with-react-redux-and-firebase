import React, { useState, useEffect } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import MessageList from './MessageList';

const Messages = ({ currentChannel, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progressBar, setProgressBar] = useState(false);

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
                })
        }

        return () => {
            messagesRef.off();
        }
    }, [currentChannel]);
    /*eslint-enable */

    const isProgressBarVisible = (percent, uploadState) => {
        setProgressBar(uploadState == 'uploading' && percent > 0)
    }

    return (
        <React.Fragment>
            <MessagesHeader />

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