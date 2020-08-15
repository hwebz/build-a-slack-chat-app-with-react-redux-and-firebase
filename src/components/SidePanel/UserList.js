import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';

const UserList = ({ users, changeChannel }) => {

    const isUserOnline = (user) => user.status === 'online';

    return users.map(user => (
        <Menu.Item
            key={user.uid}
            onClick={() => changeChannel(user)}
        >
            <Icon
                name="circle"
                color={isUserOnline(user) ? 'green' : 'red'}
            />
            @ {user.name}
        </Menu.Item>
    ))
}

export default UserList;