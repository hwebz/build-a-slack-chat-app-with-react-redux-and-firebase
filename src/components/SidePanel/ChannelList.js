import React, { useState, useEffect } from 'react';
import { Menu } from 'semantic-ui-react';

const ChannelList = ({ channels }) => {
    const [chs, setChs] = useState(channels || []);

    useEffect(() => {
        setChs(channels);
    }, [channels]);

    return chs.map(channel => (
        <Menu.Item
            key={channel.id}
            onClick={() => console.log(channel)}
            name={channel.name}
            style={{ opacity: 0.7 }}
        >
            # {channel.name}
        </Menu.Item>
    ))
}

export default ChannelList;