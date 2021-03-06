import React, { useState, useEffect } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import firebase from '../../firebase';

import StarredChannelList from './StarredChannelList';

const Starred = ({ currentUser }) => {
    const [starredChannels, setStarredChannels] = useState([]);

    const usersRef = firebase.database().ref('users');

    /*eslint-disable */
    useEffect(() => {
        if (currentUser) {
            let loadedChannels = [];
            usersRef
                .child(currentUser.uid)
                .child('starred')
                .on('child_added', snap => {
                    const starredChannel = { id: snap.key, ...snap.val() };
                    loadedChannels.push(starredChannel);
                    setStarredChannels([...loadedChannels]);
                });

            usersRef
                .child(currentUser.uid)
                .child('starred')
                .on('child_removed', snap => {
                    console.log(starredChannels)
                    loadedChannels = loadedChannels.filter(channel => channel.id !== snap.key);
                    setStarredChannels([...loadedChannels]);
                })
        }
    }, [currentUser]);

    // Unmount
    useState(() => {
        return () => {
            if (currentUser) {
                usersRef.child(`${currentUser.uid}/starred`).off();
            }
        }
    }, [currentUser]);
    /*eslint-enable */

    return (
        <Menu.Menu className="menu">
            <Menu.Item>
                <span>
                    <Icon name="star" /> STARRED
                </span>
                ({ starredChannels.length })
            </Menu.Item>
            <StarredChannelList
                channels={starredChannels}
            />
        </Menu.Menu>
    )
}

export default Starred;