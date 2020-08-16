import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';

import StarredChannelList from './StarredChannelList';

const Starred = ({ starredChannels }) => {
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