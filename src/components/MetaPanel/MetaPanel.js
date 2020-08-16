import React, { useState } from 'react';
import { Segment, Header, Accordion, Icon } from 'semantic-ui-react';

const MetaPanel = ({ isPrivateChannel }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const setIndex = (e, titleProps) => {
        const { index } = titleProps;
        const newIndex = activeIndex === index ? -1 : index;
        setActiveIndex(newIndex);
    }

    return !isPrivateChannel && (
        <Segment>
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
                    details
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
                    posters
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
                    author
                </Accordion.Content>
            </Accordion>
        </Segment>
    )
}

export default MetaPanel;