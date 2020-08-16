import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import MessageList from './MessageList';

import { setUserPosts } from '../../actions'

const STARRED_YES = 'STARRED_YES';
const STARRED_NO = 'STARRED_NO';

const Messages = ({ currentChannel, currentUser, isPrivateChannel, setUserPosts }) => {
    const [channel] = useState(currentChannel || {});
    const [messages, setMessages] = useState([]);
    const [, setLoading] = useState(false);
    const [progressBar, setProgressBar] = useState(false);
    const [numUniqueUsers, setNumUniqueUsers] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [privateChannel] = useState(isPrivateChannel || false);
    const [isChannelStarred, setIsChannelStarred] = useState('');

    const messagesRef = firebase.database().ref('messages');
    const privateMessagesRef = firebase.database().ref('privateMessages');
    const usersRef = firebase.database().ref('users');

    /*eslint-disable */
    useEffect(() => {
        if (currentChannel && currentUser) {
            let loadedMessages = [];
            getMessagesRef()
                .child(currentChannel.id)
                .on('child_added', snap => {
                    loadedMessages.push(snap.val());
                    setMessages([...loadedMessages]);
                    setLoading(false);
                    countUniqueUsers([...loadedMessages]);
                    countUserPosts(loadedMessages);
                });
        }

        return () => {
            messagesRef.off();
            privateMessagesRef.off();
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

    useEffect(() => {
        if (currentUser && currentChannel) {
            if (isChannelStarred) {
                const { id, name, details, createdBy } = currentChannel;
                switch (isChannelStarred) {
                    case STARRED_YES:
                        usersRef
                            .child(`${currentUser.uid}/starred`)
                            .update({
                                [id]: {
                                    name,
                                    details,
                                    createdBy: {
                                        name: createdBy.name,
                                        avatar: createdBy.avatar
                                    }
                                }
                            });
                        break;
                    case STARRED_NO:
                        usersRef
                            .child(`${currentUser.uid}/starred`)
                            .child(id)
                            .remove(error => {
                                if (error) {
                                    console.log(error);
                                }
                            })
                        break;
                    default:
                }
            }
            addUserStarsListener(currentUser.uid, currentChannel.id);
        }
    }, [isChannelStarred])
    /*eslint-enable */

    const addUserStarsListener = (userId, channelId) => {
        usersRef
            .child(userId)
            .child('starred')
            .once('value')
            .then(data => {
                if (data.val() !== null) {
                    const channelIds = Object.keys(data.val());
                    const prevStarred = channelIds.includes(channelId);
                    setIsChannelStarred(prevStarred ? STARRED_YES : '');
                }
            })
    }

    const isProgressBarVisible = (percent, uploadState) => {
        setProgressBar(uploadState === 'uploading' && percent > 0)
    }

    const countUniqueUsers = msgs => {
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

    const countUserPosts = msgs => {
        let userPosts = msgs.reduce((acc, msg) => {
            if (msg.user.name in acc) {
                acc[msg.user.name].count += 1;
            } else {
                acc[msg.user.name] = {
                    avatar: msg.user.avatar,
                    count: 1
                }
            }
            return acc;
        }, {});

        setUserPosts(userPosts)
    }

    const getMessagesRef = () => privateChannel ? privateMessagesRef : messagesRef

    const handleSearchChange = e => {
        setSearchTerm(e.target.value);
        setSearchLoading(true);
    }

    const handleStar = () => {
        setIsChannelStarred(isChannelStarred === STARRED_YES ? STARRED_NO : STARRED_YES);
    }

    return (
        <React.Fragment>
            <MessagesHeader
                channelName={`${privateChannel ? `@` : `#`}${channel.name}`}
                numUniqueUsers={numUniqueUsers}
                handleSearchChange={handleSearchChange}
                searchLoading={searchLoading}
                isPrivateChannel={privateChannel}
                handleStar={handleStar}
                isChannelStarred={isChannelStarred}
            />

            <Segment>
                <Comment.Group className={progressBar ? 'messages__progress' : 'messages'}>
                    {/* Messages */}
                    <MessageList
                        messages={searchTerm.length === 0 ? messages : searchResults}
                        currentUser={currentUser}
                    />
                </Comment.Group>
            </Segment>

            <MessageForm
                messagesRef={getMessagesRef()}
                currentChannel={channel}
                currentUser={currentUser}
                isProgressBarVisible={isProgressBarVisible}
                isPrivateChannel={privateChannel}
            />
        </React.Fragment>
    )
}

export default connect(null, { setUserPosts })(Messages);