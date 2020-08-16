import React, { useState, useEffect } from 'react';
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from 'semantic-ui-react';
import firebase from '../../firebase';

import { clearUser } from '../../actions'
import { connect } from 'react-redux';
import DisplayIf from '../Common/DisplayIf'
import AvatarEditor from 'react-avatar-editor'

const UserPanel = ({ currentUser, clearUser, primaryColor }) => {
    const [user] = useState(currentUser || {});
    const [modal, setModal] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [croppedImage, setCroppedImage] = useState('');
    const [blob, setBlob] = useState('');
    const [uploadedCroppedImage, setUploadedCroppedImage] = useState('');

    let avatarEditor = null;
    const storageRef = firebase.storage().ref();
    const userRef = firebase.auth().currentUser;
    const usersRef = firebase.database().ref('users');
    let metadata = {
        contentType: 'image/jpeg'
    };

    /*eslint-disable */
    useEffect(() => {
        if (uploadedCroppedImage && currentUser) {
            userRef
                .updateProfile({
                    photoURL: uploadedCroppedImage
                })
                .then(() => {
                    console.log('PhotoURL updated');
                    closeModal();
                }).catch(error => console.log(error));

            usersRef
                .child(currentUser.uid)
                .update({
                    avatar: uploadedCroppedImage
                })
                .then(() => {
                    console.log('User avatar updated');
                }).catch(error => console.log(error));
        }
    }, [uploadedCroppedImage, currentUser]);
    /*eslint-enable */
    
    const handleSignout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => {
                console.log("Signed out");
                clearUser();
            });
    }

    const openModal = () => setModal(true);

    const closeModal = () => setModal(false);

    const dropdownOptions = () => [
        {
            key: 'user',
            text: <span>Signed in as <strong>{user.displayName}</strong></span>,
            disabled: true
        },
        {
            key: 'avatar',
            text: <span onClick={openModal}>Change Avatar</span>
        },
        {
            key: 'signout',
            text: <span onClick={handleSignout}>Sign Out</span>
        }
    ]
    
    const handleChange = e => {
        const file = e.target.files[0]
        const reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
                setPreviewImage(reader.result);
            });
        }
    }

    const handleCropImage = () => {
        if (avatarEditor) {
            avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl = URL.createObjectURL(blob);
                setCroppedImage(imageUrl);
                setBlob(blob);
            })
        }
    }

    const uploadCroppedImage = () => {
        storageRef
            .child(`avatars/user-${userRef.uid}`)
            .put(blob, metadata)
            .then(snap => {
                snap.ref.getDownloadURL().then(downloadURL => {
                    setUploadedCroppedImage(downloadURL)
                })
            });
    }

    return (
        <Grid style={{ background: primaryColor }}>
            <Grid.Column>
                <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
                    {/* App Header */}
                    <Header inverted floated="left" as="h2">
                        <Icon name="code" />
                        <Header.Content>DevChat</Header.Content>
                    </Header>
                </Grid.Row>

                {/* Change User Avatar Modal */}
                <Modal basic open={modal} onClose={closeModal}>
                    <Modal.Header>Change Avatar</Modal.Header>
                    <Modal.Content>
                        <Input
                            fluid
                            type="file"
                            label="New Avatar"
                            name="previewImage"
                            onChange={handleChange}
                        />
                        <Grid centered stackable columns={2}>
                            <Grid.Row centered>
                                <Grid.Column className="ui center aligned grid">
                                    {/* Image Preview */}
                                    <DisplayIf condition={previewImage}>
                                        <AvatarEditor
                                            ref={node => (avatarEditor = node)}
                                            image={previewImage}
                                            width={120}
                                            height={120}
                                            border={50}
                                            scale={1.2}
                                        />
                                    </DisplayIf>
                                </Grid.Column>
                                <Grid.Column>
                                    {/* Cropped Image Preview */}
                                    <DisplayIf condition={croppedImage}>
                                        <Image
                                            style={{ margin: '3.5em auto' }}
                                            width={100}
                                            height={100}
                                            src={croppedImage}
                                        />
                                    </DisplayIf>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        <DisplayIf condition={croppedImage}>
                            <Button
                                color="green"
                                inverted
                                onClick={uploadCroppedImage}
                            >
                                <Icon name="save" /> Change Avatar
                            </Button>
                        </DisplayIf>
                        <Button
                            color="green"
                            inverted
                            onClick={handleCropImage}
                        >
                            <Icon name="image" /> Preview
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

                {/* User Dropdown */}
                <Header style={{ padding: '0.25em'}} as="h4" inverted>
                    <Dropdown trigger={
                        <span>
                            <Image src={user.photoURL} spaced="right" avatar />
                            {user.displayName}
                        </span>
                    } options={dropdownOptions()} />
                </Header>
            </Grid.Column>
        </Grid>
    )
}

export default connect(null, { clearUser })(UserPanel);