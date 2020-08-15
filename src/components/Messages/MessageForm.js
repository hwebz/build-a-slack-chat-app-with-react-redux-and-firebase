import React, { useState } from 'react';
import firebase from '../../firebase';
import { Segment, Button, Input } from 'semantic-ui-react';

const MessageForm = ({ messagesRef, currentChannel, currentUser }) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    const handleChange = e => {
        setMessage(e.target.value);
    }

    const sendMessage = () => {
        if (message) {
            setLoading(true);
            messagesRef
                .child(currentChannel.id)
                .push()
                .set(createMessage())
                .then(() => {
                    setLoading(false);
                    setMessage('');
                    setErrors([]);
                }).catch(error => {
                    console.log(error);
                    setLoading(false);
                    setErrors([
                        ...errors,
                        error
                    ])
                })
        } else {
            setErrors([
                ...errors,
                {
                    message: 'Add a message'
                }
            ])
        }
    }

    const createMessage = () => {
        const msg = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: currentUser.uid,
                name: currentUser.displayName,
                avatar: currentUser.photoURL
            },
            content: message
        }

        return msg;
    }

    return (
        <Segment className="message__form">
            <Input
                fluid
                name="message"
                icon="add"
                iconPosition="left"
                onChange={handleChange}
                style={{ marginBottom: '0.7em' }}
                labelPosition="left"
                className={errors.some(error => error.message.includes('message')) ? 'error' : ''}
                placeholder="Write your message"
            />
            <Button.Group icon widths="2">
                <Button
                    color="orange"
                    content="Add Reply"
                    labelPosition="left"
                    icon="edit"
                    onClick={sendMessage}
                />
                <Button
                    color="teal"
                    content="Upload Media"
                    labelPosition="right"
                    icon="cloud upload"
                />
            </Button.Group>
        </Segment>
    )
}

export default MessageForm;