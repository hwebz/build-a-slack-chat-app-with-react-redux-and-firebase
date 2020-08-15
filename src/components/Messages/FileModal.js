import React, { useState } from 'react';
import mime from 'mime-types';
import { Modal, Input, Button, Icon } from 'semantic-ui-react';

const FileModal = ({ modal, closeModal, uploadFile }) => {
    const [file, setFile] = useState(null);

    const authorized = ['image/jpeg', 'image/png']

    const addFile = e => {
        const file = e.target.files[0];

        if (file) {
            setFile(file);
        }
    }

    const sendFile = () => {
        if (file) {
            if (isAuthorized(file.name)) {
                const metadata = {
                    contentType: mime.lookup(file.name)
                };
                uploadFile(file, metadata);
                closeModal();
                // Clear file
                setFile(null)
            }
        }
    }

    const isAuthorized = fileName => authorized.includes(mime.lookup(fileName));

    return (
        <Modal
            basic
            open={modal}
            onClose={closeModal}
        >
            <Modal.Header>Select an Image File</Modal.Header>
            <Modal.Content>
                <Input
                    fluid
                    label="File types: jpg, png"
                    name="file"
                    type="file"
                    onChange={addFile}
                />
            </Modal.Content>
            <Modal.Actions>
                <Button
                    color="green"
                    inverted
                    onClick={sendFile}
                >
                    <Icon name="checkmark" /> Send
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
    )
}

export default FileModal;