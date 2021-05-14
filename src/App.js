import './App.css';
import React from 'react';
import styled from '@emotion/styled';

import ValidIPWidget from './widgets/validAddress';

const Row = styled.div`
	display: flex;
	flex-wrap: wrap;
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
					<small>Brought to you by <a target="_blank" href="https://www.6connect.com/">6connect</a></small>
					<input type="text" ref={this.inputRef} className="primary-input" placeholder="ip address" />
					<Row>
						<ValidIPWidget mode="v4" value={this.state.inputValue} />
						<ValidIPWidget mode="v6" value={this.state.inputValue} />
					</Row>
				</header>
			</div>
		);
	}
}

export default App;
