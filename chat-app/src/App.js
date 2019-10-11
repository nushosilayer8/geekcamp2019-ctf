import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

import MessageList from './MessageList.js';
import Message from './Message.js';

const useStyles = makeStyles(theme => ({
	appBarSpacer: theme.mixins.toolbar,
	bottomAppBar: {
		top: 'auto',
		bottom: 0,
		background: theme.palette.grey[100],
	},
	bottomToolbarInput: {
		flexGrow: 1,
	},
	content: {
		flexGrow: 1,
		height: '100vh',
		overflow: 'auto',
	},
}));

const API_BASE = 'http://localhost:8080';

function App() {
	const classes = useStyles();

	// Account: Set or create token
	const [account, setAccount] = useState(localStorage.getItem('account'));
	if (!account) {
		(async () => {
			const res = await fetch(`${API_BASE}/api/account`, {
				method: 'POST',
				headers: { 'Accept': 'text/plain' },
			});
			const data = await res.text();
			localStorage.setItem('account', data);
			setAccount(data);
		})();
	}

	// Messages: List of messages
	const [messages, setMessages] = useState([
		{ id: 0, to: '1', from: '0', message: 'Hello! How can I help you?' },
		{ id: 1, to: '0', from: '1', message: 'Dadadadda' },
		{ id: 2, to: '1', from: '0', message: 'Hello! How can I help you?' },
		{ id: 3, to: '0', from: '1', message: 'Dadadadda' },
		{ id: 4, to: '1', from: '0', message: 'Hello! How can I help you?' },
		{ id: 5, to: '0', from: '1', message: 'Dadadadda' },
		{ id: 6, to: '1', from: '0', message: 'Hello! How can I help you?' },
		{ id: 7, to: '0', from: '1', message: 'Dadadadda' },
		{ id: 8, to: '1', from: '0', message: 'Hello! How can I help you?' },
		{ id: 9, to: '0', from: '1', message: 'Dadadadda' },
		{ id: 10, to: '1', from: '0', message: 'Hello! How can I help you?' },
		{ id: 11, to: '0', from: '1', message: 'Dadadadda' },
		{ id: 12, to: '1', from: '0', message: 'Hello! How can I help you?' },
		{ id: 13, to: '0', from: '1', message: 'Dadadadda' },
		{ id: 14, to: '1', from: '0', message: 'Hello! How can I help you?' },
		{ id: 15, to: '0', from: '1', message: 'Dadadadda' },
	]);

	const messageComponents = messages.map(message => 
		<Message key={message.id} from={message.from} to={message.to}>{message.message}</Message>
	);

	// Messages: Send message
	const [sending, setSending] = useState(false);
	const [message, setMessage] = useState('');
	
	async function sendMessage(e) {
		setSending(true);
		console.log('sending message', message);
		let res;
		try {
			res = await fetch(`${API_BASE}/api/messages`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					//'Accept': 'text/plain',
					'Authorization': `Bearer ${account}`,
				},
				body: JSON.stringify({
					to: '0',
					message,
				}),
			});
			if (!res.ok) {
				throw new Error(await res.text());
			}
		} catch (e) {
			setSending(false);
			console.error(e);
			return;
		}
		setSending(false);
		setMessage('');
	}

	// Messages: Subscribe to incoming
	useEffect(() => {
		// obtain initial messages
		fetch(`${API_BASE}/api/messages`, {
			method: 'GET',
			headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${account}` },
		}).then(res => {
			return res.json();
		}).then(data => {
			setMessages(data);
		});

		const incomingMessages = new EventSource(`${API_BASE}/api/messages?account=${account}`);
		incomingMessages.addEventListener('change', async e => {
			const res = await fetch(`${API_BASE}/api/messages/${e.data}`, {
				method: 'GET',
				headers: { 'Accept': 'application/json' },
			});
			const message = await res.json();
			// add message
			setMessages(messages => {
				return messages.concat([message]);
			});
		});

		return () => {
			incomingMessages.close();
		};
	}, [account]);

	return (
		<div className={classes.Root}>
			<CssBaseline />
			<AppBar position="absolute">
				<Toolbar>
					<Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
						Chat With Admin
					</Typography>
				</Toolbar>
			</AppBar>
			<main className={classes.content}>
				<div className={classes.appBarSpacer} />
				<Container maxWidth="lg" className={classes.container}>
					<MessageList>{messageComponents}</MessageList>
				</Container>
				<div className={classes.appBarSpacer} />
			</main>
			<AppBar position="absolute" className={classes.bottomAppBar}>
				<Container maxWidth="lg">
					<Toolbar>
						<InputBase
							className={classes.bottomToolbarInput}
							placeholder="Send message"
							disabled={sending}
							inputProps={{ 'aria-label': 'Send message' }}
							onChange={e => setMessage(e.target.value)}
							value={message}
						/>
						<IconButton
							edge="end" color="primary"
							aria-label="Send Message"
							onClick={sendMessage}
							disabled={sending}
						>
							<SendIcon />
						</IconButton>
					</Toolbar>
				</Container>
			</AppBar>
		</div>
	);
}

export default App;
