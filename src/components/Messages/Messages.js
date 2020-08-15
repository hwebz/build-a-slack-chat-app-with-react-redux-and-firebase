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
    const [searchTerm, setSearchTerm] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

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

    useEffect(() => {
        const channelMessages = [...messages];
        const regex = new RegExp(searchTerm, 'gi');
        const results = channelMessages.reduce((acc, message) => {
            if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
                acc.push(message);
            }
            return acc;
        }, []);
        setSearchResults(results);
        // Fake loading
        setTimeout(() => {
            setSearchLoading(false);
        }, 1000);
    }, [searchTerm]);
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

    const handleSearchChange = e => {
        setSearchTerm(e.target.value);
        setSearchLoading(true);
    }

    return (
        <React.Fragment>
            <MessagesHeader
                channelName={channel.name}
                numUniqueUsers={numUniqueUsers}
                handleSearchChange={handleSearchChange}
                searchLoading={searchLoading}
            />

            <Segment>
                <Comment.Group className={progressBar ? 'messages__progress' : 'messages'}>
                    {/* Messages */}
                    <MessageList
                        messages={searchTerm.length == 0 ? messages : searchResults}
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