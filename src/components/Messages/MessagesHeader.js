import React from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';
import DisplayIf from '../Common/DisplayIf';

const MessagesHeader = ({ channelName, numUniqueUsers, handleSearchChange, searchLoading, isPrivateChannel }) => {
    return (
        <Segment clearing>
            {/* Channel Title */}
            <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
                <span>
                    { channelName }
                    <DisplayIf condition={!isPrivateChannel}>
                        <Icon name="star outline" color="black" />
                    </DisplayIf>
                </span>
                <Header.Subheader>{numUniqueUsers}</Header.Subheader>
            </Header>

            {/* Channel Search Input */}
            <Header floated="right">
                <Input
                    loading={searchLoading}
                    size="mini"
                    icon="search"
                    name="searchTerm"
                    placeholder="Search Messages"
                    onChange={handleSearchChange}
                />
            </Header>
        </Segment>
    )
}

export default MessagesHeader;