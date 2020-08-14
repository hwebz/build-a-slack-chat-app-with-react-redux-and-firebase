import React, { useState } from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import firebase from '../../firebase';

const Channels = ({ currentUser }) => {
    const [user, setUser] = useState(currentUser || {});
    const [channels, setChannels] = useState([]);
    const [modal, setModal] = useState(false);
    const [channelName, setChannelName] = useState('');
    const [channelDetails, setChannelDetails] = useState('');

    const channelsRef = firebase.database().ref('channels');

    const closeModal = () => {
        setModal(false);
    }

    const openModal = () => {
        setModal(true);
    }

    const handleChange = e => {
        const {name, value} = e.target;

        switch (name) {
            case "channelName":
                setChannelName(value);
                break;
            case "channelDetails":
                setChannelDetails(value);
                break;
            default:
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        
        if (isFormValid()) {
            addChannel();
        }
    }

    const isFormValid = () => {
        return channelName && channelDetails
    }

    const addChannel = () => {
        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        }

        console.log(newChannel);

        channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
                setChannelName('');
                setChannelDetails('');
                console.log('channel added');
            }).catch(error => console.log(error));
    }

    return (
        <React.Fragment>
            <Menu.Menu style={{ paddingBottom: '2em' }}>
                <Menu.Item>
                    <span>
                        <Icon name="exchange" /> CHANNELS
                    </span>
                    ({ channels.length })
                    <Icon name="add" onClick={openModal} />
                </Menu.Item>
            </Menu.Menu>

            {/* Add Channel Modal */}
            <Modal basic open={modal} onClose={closeModal}>
                <Modal.Header>Add a Channel</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={handleSubmit}>
                        <Form.Field>
                            <Input
                                fluid
                                label="Name of Channel"
                                name="channelName"
                                onChange={handleChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Input
                                fluid
                                label="About the Channel"
                                name="channelDetails"
                                onChange={handleChange}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="green" inverted onClick={handleSubmit}>
                        <Icon name="checkmark" /> Add
                    </Button>
                    <Button color="red" inverted onClick={closeModal}>
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        </React.Fragment>
    )
}

export default Channels;