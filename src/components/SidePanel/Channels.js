import React, { useState, useEffect } from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import firebase from '../../firebase';

import ChannelList from './ChannelList';

const Channels = ({ currentUser, currentChannel }) => {
    const [user] = useState(currentUser || {});
    const [channels, setChannels] = useState([]);
    const [modal, setModal] = useState(false);
    const [channelName, setChannelName] = useState('');
    const [channelDetails, setChannelDetails] = useState('');
    const [notifications, setNotifications] = useState([]);

    const channelsRef = firebase.database().ref('channels');
    const messagesRef = firebase.database().ref('messages');

    /*eslint-disable */
    useEffect(() => {
        let loadedChannels = [];
        // Fired once a new channel added
        channelsRef.on('child_added', snap => {
            // Update newest channels
            loadedChannels.push(snap.val());
            setChannels([...loadedChannels]);
        });

        return () => {
            channelsRef.off();
        }
    }, []);

    useEffect(() => {
        if (currentChannel) {
            channelsRef.on('child_added', snap => {
                addNotificationListener(snap.key);
            })
        }

        
    }, [currentChannel]);
    /*eslint-enable */

    const addNotificationListener = channelId => {
        messagesRef
            .child(channelId)
            .on('value', snap => {
                // Continuous watch the changes for all selected channels
                console.log(currentChannel.name)
                handleNotifications(channelId, currentChannel.id, notifications, snap);
            })
    }

    const handleNotifications = (channelId, currentChannelId, ns, snap) => {
        let lastTotal = 0;
        let index = ns.findIndex(n => n.id === channelId);

        if (index !== -1) {
            if (channelId !== currentChannelId) {
                lastTotal = ns[index].total;
                if (snap.numChildren() - lastTotal > 0) {
                    ns[index].count = snap.numChildren() - lastTotal;
                }
            } else {
                ns[index].count = 0;
            }
            ns[index].lastKnownTotal = snap.numChildren();
        } else {
            ns.push({
                id: channelId,
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count: 0
            })
        }
        setNotifications([...ns]);
    }

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
                setModal(false);
            }).catch(error => console.log(error));
    }

    const clearNotifications = () => {
        let index = notifications.findIndex(n => n.id === currentChannel.id);

        if (index !== -1) {
            let updatedNotifications = [...notifications];
            updatedNotifications[index].total = notifications[index].lastKnownTotal;
            updatedNotifications[index].count = 0;
            setNotifications(updatedNotifications);
        }
    }

    return (
        <React.Fragment>
            <Menu.Menu className="menu">
                <Menu.Item>
                    <span>
                        <Icon name="exchange" /> CHANNELS
                    </span>
                    ({ channels.length })
                    <Icon name="add" onClick={openModal} />
                </Menu.Item>
                <ChannelList
                    channels={channels}
                    notifications={notifications}
                    clearNotifications={clearNotifications}
                />
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