import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Autolinker from 'autolinker';

const useStyles = makeStyles(theme => ({
	root: {
		margin: theme.spacing(2, 0),
	},
	bubble: {
		background: theme.palette.grey[200],
		display: 'inline-block',
	},
	sender: {
		background: theme.palette.primary.dark,
		color: theme.palette.primary.contrastText,
	},
	rootRight: {
		textAlign: 'right',
	},
}));

function SafeHTML(content) {
	// This function SHOULD be safe
	const escaped = content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	const linked = Autolinker.link(escaped);
	return { __html: linked };
}

function Message(props) {
	const classes = useStyles();

	const sender = props.to === "0";

	return (
		<div className={`${classes.root} ${sender ? classes.rootRight : ''}`}>
			<Card elevation={0} className={`${classes.bubble} ${sender ? classes.sender : ''}`}>
				<CardContent dangerouslySetInnerHTML={SafeHTML(props.children)}>
				</CardContent>
			</Card>
		</div>
	);

}
export default Message;
