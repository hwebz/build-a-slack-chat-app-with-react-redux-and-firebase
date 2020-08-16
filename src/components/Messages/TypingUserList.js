import React from 'react';
import Typing from './Typing';

const TypingUserList = ({ users }) => {
    return users.map(user => (
        <div key={user.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.2em' }}>
            <span className="user__typing">{user.name} is typing</span>
            <Typing />
        </div>
    ))
}

export default TypingUserList;