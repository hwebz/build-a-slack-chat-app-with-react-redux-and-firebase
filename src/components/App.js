import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import { Grid } from 'semantic-ui-react';

import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';
import DisplayIf from './Common/DisplayIf';

function App({ currentUser, currentChannel, isPrivateChannel, userPosts, primaryColor, secondaryColor }) {
	return (
		<Grid columns="equal" className="app" style={{ background: secondaryColor }}>
			<ColorPanel
				key="color-panel"
				currentUser={currentUser}
			/>
			<SidePanel
				key="side-panel"
				currentUser={currentUser}
				currentChannel={currentChannel}
				primaryColor={primaryColor}
			/>
			<Grid.Column style={{ marginLeft: 320}}>
				<DisplayIf condition={currentChannel}>
					<Messages
						key="messages"
						currentChannel={currentChannel}
						currentUser={currentUser}
						isPrivateChannel={isPrivateChannel}
					/>
				</DisplayIf>
			</Grid.Column>
			<Grid.Column width={4}>
				<DisplayIf condition={currentChannel}>
					<MetaPanel
						key="meta-panel"
						isPrivateChannel={isPrivateChannel}
						currentChannel={currentChannel}
						userPosts={userPosts}
					/>
				</DisplayIf>
			</Grid.Column>
		</Grid>
	);
}

const mapStateToProps = state => ({
	currentUser: state.user.currentUser,
	currentChannel: state.channel.currentChannel,
	isPrivateChannel: state.channel.isPrivateChannel,
	userPosts: state.channel.userPosts,
	primaryColor: state.colors.primaryColor,
	secondaryColor: state.colors.secondaryColor
})

export default connect(mapStateToProps)(App);
