import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';
import { setCurrentChannel, setPrivateChannel } from '../../actions'

const StarredChannelList = ({ channels, setCurrentChannel, setPrivateChannel }) => {
    const [activeChannelID, setActiveChannelID] = useState('');

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

export default connect(null, { setCurrentChannel, setPrivateChannel })(StarredChannelList);