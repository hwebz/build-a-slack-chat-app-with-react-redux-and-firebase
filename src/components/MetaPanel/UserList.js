import React from 'react';
import { List, Image } from 'semantic-ui-react';

const UserList = ({ users }) => {

    const formatCount = num => (num > 1 || num === 0) ? `${num} posts` : `${num} post`;

    return users.length > 0 && (
        <List>
            {users.map((user, idx) => (
                <List.Item key={idx}>
                    <Image avatar src={user.avatar} />
                    <List.Content>
                        <List.Header as="a">{user.name}</List.Header>
                        <List.Description>{formatCount(user.count)}</List.Description>
                    </List.Content>
                </List.Item>
            ))}
        </List>
    )
}

export default UserList;