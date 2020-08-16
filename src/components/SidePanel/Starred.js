import React, { useState, useEffect } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import firebase from '../../firebase';

import StarredChannelList from './StarredChannelList';

const Starred = ({ currentUser }) => {
    const [user, setUser] = useState(currentUser || {})
    const [starredChannels, setStarredChannels] = useState([]);

    const usersRef = firebase.database().ref('users');

    /*eslint-disable */
    useEffect(() => {
        let loadedChannels = [];
        usersRef
            .child(user.uid)
            .child('starred')
            .on('child_added', snap => {
                const starredChannel = { id: snap.key, ...snap.val() };
                loadedChannels.push(starredChannel);
                setStarredChannels([...loadedChannels]);
            });

        usersRef
            .child(user.uid)
            .child('starred')
            .on('child_removed', snap => {
                console.log(starredChannels)
                const channelToRemove = { id: snap.key, ...snap.val() };
                loadedChannels = loadedChannels.filter(channel => channel.id !== channelToRemove.id);
                setStarredChannels([...loadedChannels]);
            })

        return () => {
            usersRef.off();
        }
    }, []);

    useEffect(() => {
        // console.log(starredChannels);
    }, [starredChannels]);
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