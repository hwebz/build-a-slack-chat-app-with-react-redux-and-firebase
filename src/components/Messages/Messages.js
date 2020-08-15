import React from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';

const Messages = ({ currentChannel, currentUser }) => {

    const messagesRef = firebase.database().ref('messages');

    return (
        <React.Fragment>
            <MessagesHeader />

            <Segment>
                <Comment.Group className="messages">
                    {/* Messages */}
                </Comment.Group>
            </Segment>

            <MessageForm
                messagesRef={messagesRef}
                currentChannel={currentChannel}
                currentUser={currentUser}
            />
        </React.Fragment>
    )
}

export default Messages;