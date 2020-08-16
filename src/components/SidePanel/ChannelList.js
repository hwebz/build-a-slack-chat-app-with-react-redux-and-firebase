import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Menu, Label } from 'semantic-ui-react';
import DisplayIf from '../Common/DisplayIf';

import { setCurrentChannel, setPrivateChannel } from '../../actions'

const ChannelList = ({ channels, currentChannel, setCurrentChannel, setPrivateChannel, notifications, clearNotifications }) => {
    const [activeChannelID, setActiveChannelID] = useState('');

    /*eslint-disable */
    useEffect(() => {
        if (!currentChannel && !!channels.length) {
            const firstChannel = channels[0];

            setCurrentChannel(firstChannel);
            setActiveChannelID(firstChannel.id);
            setPrivateChannel(false);
        }
    }, [channels]);
    /*eslint-enable */

    const changeChannel = channel => {
        setCurrentChannel(channel);
        setActiveChannelID(channel.id)
        setPrivateChannel(false);
        clearNotifications();
    }

    const getNotificationCount = channel => {
        let count = 0;

        notifications.forEach(n => {
            if (n.id === channel.id) {
                count = n.count;
            }
        });

        return count;
    }

    return channels.map(channel => (
        <Menu.Item
            key={channel.id}
            onClick={() => changeChannel(channel)}
            name={channel.name}
            style={{ opacity: 0.7 }}
            active={activeChannelID === channel.id}
        >
            <DisplayIf condition={getNotificationCount(channel)}>
                <Label color="red">{getNotificationCount(channel)}</Label>
            </DisplayIf>
            # {channel.name}
        </Menu.Item>
    ))
}

const mapStateToProps = state => ({
    currentChannel: state.channel.currentChannel
})

export default connect(mapStateToProps, { setCurrentChannel, setPrivateChannel })(ChannelList);