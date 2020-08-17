import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import firebase from '../../firebase';
import { Sidebar, Menu, Divider, Button, Modal, Icon, Label, Segment } from 'semantic-ui-react';
import { SliderPicker } from 'react-color';
import ColorList from './ColorList';

import { setColors } from '../../actions'

/* 
    Manual adding colors data to users table
    users
    ----colors
    --------<gwegwagwegwgw>
    ------------primary="#194d39"
    ------------secondary="#5b40bf"
*/

const ColorPanel = ({ currentUser, setColors }) => {
    const [modal, setModal] = useState(false);
    const [primary, setPrimary] = useState('');
    const [secondary, setSecondary] = useState('');
    const [userColors, setUserColors] = useState([]);

    const usersRef = firebase.database().ref('users');

    /*eslint-disable */
    useEffect(() => {
        if (currentUser) {
            let usrColors = [];
            usersRef
                .child(`${currentUser.uid}/colors`)
                .on('child_added', snap => {
                    usrColors.unshift(snap.val());
                    setUserColors([...usrColors]);
                })
        }
    }, [currentUser]);

    // Unmount
    useEffect(() => {
        return () => {
            if (currentUser) {
                usersRef.child(`${currentUser.uid}/colors`).off();
            }
        }
    }, [currentUser]);
    /*eslint-enable */

    const openModal = () =>  setModal(true);

    const closeModal = () =>  setModal(false);

    const handleChangePrimary = color => setPrimary(color.hex);

    const handleChangeSecondary = color => setSecondary(color.hex);

    const handleSave = () => {
        if (primary && secondary) {
            usersRef
                .child(`${currentUser.uid}/colors`)
                .push()
                .update({
                    primary,
                    secondary
                })
                .then(() => {
                    console.log('Colors added');
                    closeModal();
                })
                .catch(error => console.log(error));
        }
    }

    return (
        <Sidebar
            as={Menu}
            icon="labeled"
            inverted
            vertical
            visible
            width="very thin"
        >
            <Divider />
            <Button
                icon="add"
                size="small"
                color="blue"
                onClick={openModal}
            />
            <ColorList
                colors={userColors}
                setColors={setColors}
            />

            {/* Color Picker Modal */}
            <Modal
                basic
                open={modal}
                onClose={closeModal}
            >
                <Modal.Header>Choose App Colors</Modal.Header>
                <Modal.Content>
                    <Segment>
                        <Label content="Primary Color" />
                        <SliderPicker onChange={handleChangePrimary} color={primary} />
                    </Segment>
                    <Segment>
                        <Label content="Secondary Color" />
                        <SliderPicker onChange={handleChangeSecondary} color={secondary} />
                    </Segment>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        color="green"
                        inverted
                        onClick={handleSave}
                    >
                        <Icon name="checkmark" /> Save Color
                    </Button>
                    <Button
                        color="red"
                        inverted
                        onClick={closeModal}
                    >
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        </Sidebar>
    )
}

export default connect(null, { setColors })(ColorPanel);