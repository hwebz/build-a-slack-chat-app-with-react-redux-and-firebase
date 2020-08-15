import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';

import { setCurrentChannel, setPrivateChannel } from '../../actions'

const ChannelList = ({ channels, currentChannel, setCurrentChannel, setPrivateChannel }) => {
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
    }

    return channels.map(channel => (
        <Menu.Item
            key={channel.id}
            onClick={() => changeChannel(channel)}
            name={channel.name}
            style={{ opacity: 0.7 }}
            active={activeChannelID === channel.id}
        >
            # {channel.name}
        </Menu.Item>
    ))
}

const mapStateToProps = state => ({
    currentChannel: state.channel.currentChannel
})

export default connect(mapStateToProps, { setCurrentChannel, setPrivateChannel })(ChannelList);