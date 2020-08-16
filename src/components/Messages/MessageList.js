import React from 'react';

import Message from './Message';

const MessageList = ({ messages, currentUser }) => {
    return messages.map(message => (
        <Message
            key={message.timestamp}
            message={message}
            user={currentUser}
        />
    ));
}

export default MessageList;