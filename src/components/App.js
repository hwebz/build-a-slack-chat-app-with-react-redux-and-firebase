import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import { Grid } from 'semantic-ui-react';

import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

function App({ currentUser, currentChannel, isPrivateChannel, userPosts }) {
	return (
		<Grid columns="equal" className="app" style={{ background: '#eee' }}>
			<ColorPanel />
			<SidePanel
				key={currentUser && currentUser.uid}
				currentUser={currentUser}
				currentChannel={currentChannel}
			/>
			<Grid.Column style={{ marginLeft: 320}}>
				<Messages
					key={currentChannel && currentChannel.id}
					currentChannel={currentChannel}
					currentUser={currentUser}
					isPrivateChannel={isPrivateChannel}
				/>
			</Grid.Column>
			<Grid.Column width={4}>
				<MetaPanel
					key={currentChannel && currentChannel.id}
					isPrivateChannel={isPrivateChannel}
					currentChannel={currentChannel}
					userPosts={userPosts}
				/>
			</Grid.Column>
		</Grid>
	);
}

const mapStateToProps = state => ({
	currentUser: state.user.currentUser,
	currentChannel: state.channel.currentChannel,
	isPrivateChannel: state.channel.isPrivateChannel,
	userPosts: state.channel.userPosts
})

export default connect(mapStateToProps)(App);
