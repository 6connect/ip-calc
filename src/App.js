import './App.css';
import React from 'react';
import styled from '@emotion/styled';

import ValidIPWidget from './widgets/validAddress';
import CompressedAddress from './widgets/compressedAddress';

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

		this.state = {
			inputValue: "",
		}
		this.inputRef = React.createRef();
	}

	componentDidMount() {
		this.inputRef.current.addEventListener('keyup', (e) => {
			if (this.state.inputValue !== this.inputRef.current.value) {
				const value = this.inputRef.current.value;
				this.setState({
					inputValue: value,
				})
			}
		})
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<small>Brought to you by <a target="_blank" rel="noreferrer" href="https://www.6connect.com/">6connect</a></small>
					<input type="text" ref={this.inputRef} className="primary-input" placeholder="ip address" />
					<Row>
						<ValidIPWidget mode="v4" value={this.state.inputValue} />
						<ValidIPWidget mode="v6" value={this.state.inputValue} />
					</Row>
					<Row>
						<CompressedAddress address={this.state.inputValue} />
					</Row>
				</header>
			</div>
		);
	}
}

export default App;
