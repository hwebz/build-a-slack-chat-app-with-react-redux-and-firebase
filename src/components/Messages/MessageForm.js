import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import firebase from '../../firebase';
import { Segment, Button, Input } from 'semantic-ui-react';

import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

const MessageForm = ({ messagesRef, currentChannel, currentUser, isProgressBarVisible }) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [modal, setModal] = useState(false);
    const [uploadState, setUploadState] = useState('');
    const [uploadTask, setUploadTask] = useState(null);
    const [percentUploaded, setPercentUploaded] = useState(0);

    const storageRef = firebase.storage().ref();

    /*eslint-disable */
    useEffect(() => {
        if (uploadTask) {
            uploadTask.on('state_changed', snap => {
                const percentUploaded = Math.round(( snap.bytesTransferred / snap.totalBytes ) * 100);
                setPercentUploaded(percentUploaded);
            }, error => {
                console.log(error);
                setErrors([
                    ...errors,
                    error
                ]);
                setUploadState('');
                setUploadTask(null);
            }, () => {
                uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                    sendFileMessage(downloadUrl, messagesRef, currentChannel.id);
                }).catch(error => {
                    console.log(error);
                    setErrors([
                        ...errors,
                        error
                    ]);
                    setUploadState('');
                    setUploadTask(null);
                })
            })
        }
    }, [uploadTask]);

    useEffect(() => {
        isProgressBarVisible(percentUploaded, uploadState);
    }, [percentUploaded, uploadState])
    /*eslint-enable */

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

    const createMessage = (fileUrl = null) => {
        const msg = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: currentUser.uid,
                name: currentUser.displayName,
                avatar: currentUser.photoURL
            }
        }

        if (fileUrl) {
            msg['image'] = fileUrl;
        } else {
            msg['content'] = message;
        }

        return msg;
    }

    const openModal = () => {
        setModal(true);
    }

    const closeModal = () => {
        setModal(false);
    }

    const uploadFile = (file, metadata) => {
        console.log(file, metadata);
        const filePath = `chat/public/${uuidv4()}.jpg`;
        
        setUploadState('uploading');
        setUploadTask(storageRef.child(filePath).put(file, metadata));
    }

    const sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref.child(pathToUpload)
            .push()
            .set(createMessage(fileUrl))
            .then(() => {
                setUploadState('done');
            }).catch(error => {
                console.log(error);
                setErrors([
                    ...errors,
                    error
                ]);
            });
    }

    return (
        <Segment className="message__form">
            <Input
                fluid
                name="message"
                icon="add"
                iconPosition="left"
                value={message}
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
                    disabled={loading}
                />
                <Button
                    color="teal"
                    onClick={openModal}
                    content="Upload Media"
                    labelPosition="right"
                    icon="cloud upload"
                    disabled={uploadState === 'uploading'}
                />
            </Button.Group>
            <FileModal
                modal={modal}
                closeModal={closeModal}
                uploadFile={uploadFile}
            />
            <ProgressBar
                uploadState={uploadState}
                percentUploaded={percentUploaded}
            />
        </Segment>
    )
}

export default MessageForm;