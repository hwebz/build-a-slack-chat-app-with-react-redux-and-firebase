import React, { useState, useEffect } from 'react';
import { Segment, Header, Accordion, Icon, Image } from 'semantic-ui-react';
import UserList from './UserList';

const MetaPanel = ({ currentChannel, isPrivateChannel, userPosts }) => {
    const [channel] = useState(currentChannel || {})
    const [activeIndex, setActiveIndex] = useState(0);
    const [users, setUsers] = useState(userPosts || []);

    const setIndex = (e, titleProps) => {
        const { index } = titleProps;
        const newIndex = activeIndex === index ? -1 : index;
        setActiveIndex(newIndex);
    }

    /*eslint-disable */
    useEffect(() => {
        if (userPosts) {
            const usrs = Object.entries(userPosts)
            .sort((a, b) => b[1] - a[1])
            .map(([key, value], i) => {
                return {
                    name: key,
                    ...value
                }
            })

            setUsers(usrs);
        }
    }, [userPosts]);
    /*eslint-enable */

    return !isPrivateChannel && (
        <Segment loading={!Object.keys(channel).length}>
            <Header as="h3" attached="top">
                About # Channel
            </Header>
            <Accordion styled attached="true">
                <Accordion.Title
                    active={activeIndex === 0}
                    index={0}
                    onClick={setIndex}
                >
                    <Icon name="dropdown" />
                    <Icon name="info" />
                    Channel Details
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                    {channel.details}
                </Accordion.Content>

                <Accordion.Title
                    active={activeIndex === 1}
                    index={1}
                    onClick={setIndex}
                >
                    <Icon name="dropdown" />
                    <Icon name="user circle" />
                    Top Posters
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 1}>
                    <UserList users={users} />
                </Accordion.Content>

                <Accordion.Title
                    active={activeIndex === 2}
                    index={2}
                    onClick={setIndex}
                >
                    <Icon name="dropdown" />
                    <Icon name="pencil alternate" />
                    Created By
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 2}>
                    <Header as="h3">
                        <Image circular src={channel.createdBy ? channel.createdBy.avatar : ''} />
                        {channel.createdBy ? channel.createdBy.name : ''}
                    </Header>
                </Accordion.Content>
            </Accordion>
        </Segment>
    )
}

export default MetaPanel;