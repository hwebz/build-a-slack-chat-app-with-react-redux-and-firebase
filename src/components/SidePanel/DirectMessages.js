import React, { useState, useEffect } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';

import firebase from '../../firebase';
import UserList from './UserList';
import { setCurrentChannel, setPrivateChannel } from '../../actions';

const DirectMessages = ({ currentUser, setCurrentChannel, setPrivateChannel }) => {
    const [users, setUsers] = useState([]);
    const [user] = useState(currentUser || {});

    const usersRef = firebase.database().ref('users');
    const connectedRef = firebase.database().ref('.info/connected');
    const presenceRef = firebase.database().ref('presence');

    /*eslint-disable */
    useEffect(() => {
        if (user) {
            let loadedUsers = [];
            usersRef.on('child_added', snap => {
                if (user.uid !== snap.key) {
                    let usr = snap.val();
                    usr['uid'] = snap.key;
                    usr['status'] = 'offline';
                    loadedUsers.push(usr);
                    setUsers([...loadedUsers]);
                }
            })
        }

        connectedRef.on('value', snap => {
            if (snap.val() === true) {
                const ref = presenceRef.child(user.uid);
                ref.set(true)
                ref.onDisconnect()
                    .remove(error => {
                        if (error) {
                            console.log(error);
                        }
                    })
            }
        });

        presenceRef.on('child_added', snap => {
            if (currentUser.uid !== snap.key) {
                // add status to user
            }
        });

        presenceRef.on('child_removed', snap => {
            if (currentUser.uid !== snap.key) {
                // add status to user
                addStatusToUser(snap.key, false);
            }
        });

        return () => {
            usersRef.off();
            connectedRef.off();
            presenceRef.off();
        }
    }, [currentUser]);
    /*eslint-enable */

    const addStatusToUser = (userId, connected = true) => {
        const updatedUsers = users.reduce((acc, user) => {
            if (user.uid === userId) {
                user['status'] = `${connected ? 'online' : 'offline'}`;
            }
            return acc.concat(user);
        }, []);

        setUsers([...updatedUsers]);
    }

    const changeChannel = usr => {
        const channelId = getChannelId(usr.uid);
        const channelData = {
            id: channelId,
            name: usr.name
        };

        setCurrentChannel(channelData);
        setPrivateChannel(true);
    }

    const getChannelId = userId => {
        return userId < currentUser.uid ? `${userId}/${currentUser.uid}` : `${currentUser.uid}/${userId}`;
    }

    return (
        <Menu.Menu className="menu">
            <Menu.Item>
                <span>
                    <Icon name="mail" /> DIRECT MESSAGES
                </span>
                ({ users.length })
            </Menu.Item>
            {/* Users to Send Direct Messages */}
            <UserList
                users={users}
                changeChannel={changeChannel}
            />
        </Menu.Menu>
    )
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(DirectMessages);