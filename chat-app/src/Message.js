import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles(theme => ({
	root: {
		margin: theme.spacing(2, 0),
	},
	bubble: {
		background: theme.palette.grey[200],
	},
}));

function Message(props) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Card elevation={0} className={classes.bubble}>
				<CardContent>
					{props.children}
				</CardContent>
			</Card>
		</div>
	);

}
export default Message;
