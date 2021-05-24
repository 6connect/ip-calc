import './App.css';
import React from 'react';
import styled from '@emotion/styled';

import ValidIPWidget from './widgets/validAddress';
import CompressedAddress from './widgets/compressedAddress';
import ExpandedAddress from './widgets/expandedAddress';
import { getExpandedAddress, getNumberOfSubnets } from './utility';
const ipaddr = require('ipaddr.js');

const Row = styled.div`
	font-size: 1rem;
	display: flex;
	flex-wrap: wrap;
	border-top: 1px solid rgba(255, 255, 255, 0.15);
	width: 95%;
	max-width: 400px;
	justify-content: center;
	padding: 0.5rem 0;
`;

class App extends React.Component {
	constructor() {
		super();
		const params = new URLSearchParams(document.location.search.substring(1));

		this.state = {
			inputValue: params.get('ip') || '',
		}
		this.inputRef = React.createRef();
	}

	componentDidMount() {
		this.inputRef.current.addEventListener('keyup', (e) => {
			if (this.state.inputValue !== this.inputRef.current.value) {
				const value = this.inputRef.current.value.split('/');
				let cidr = false;
				if (value.length > 1 && parseInt(value[1]) > 0) {
					cidr = parseInt(value[1]);
				}
				this.setState({
					inputValue: value[0],
					inputCidr: cidr,
				})
			}
		})
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<small>Brought to you by <a target="_blank" rel="noreferrer" href="https://www.6connect.com/">6connect</a></small>
					<input type="text" defaultValue={this.state.inputValue} ref={this.inputRef} className="primary-input" placeholder="ip address" />
					<Row>
						<ValidIPWidget mode="v4" value={this.state.inputValue} />
						<ValidIPWidget mode="v6" value={this.state.inputValue} />
					</Row>
					<Row>
						<CompressedAddress address={this.state.inputValue} />
						<ExpandedAddress address={this.state.inputValue} cidr={this.state.inputCidr} />
					</Row>
				</header>
			</div>
		);
	}
}

export default App;
