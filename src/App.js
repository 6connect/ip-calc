import './App.css';
import React from 'react';
import styled from '@emotion/styled';

import ExpandedAddress from './widgets/expandedAddress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { numberWithCommas } from './utility';

const Row = styled.div`
	font-size: 1rem;
	display: flex;
	flex-wrap: wrap;
	border-top: 1px solid rgba(255, 255, 255, 0.15);
	width: 95%;
	max-width: 500px;
	justify-content: center;
	padding: 0.5rem 0;
`;

const AddNewSubnet = styled.div`
    display: inline-block;
    background: rgba(0,0,50,0.25);
    border-radius: 1rem;
    font-size: 1rem;
    padding: 0.25rem 1rem;
    margin: 0.25rem;
    border: 0.2rem solid transparent;

	cursor:pointer;
    &:hover {
        border-color: #9BC53D;
        svg {
            color: #9BC53D;
        }
    }
`;

const SubnetWrapper = styled.div`
	width: 100%;

	& > div:nth-of-type(1) {
		display: inline-block;
		width: calc(100% - 4rem);
		box-sizing: border-box;
		position: relative;
		z-index: 2;
		margin-bottom: 0;
	}
`;
const SubnetInput = styled.input`
	display: inline-block;
	box-sizing: border-box;
	width: 4.5rem;
    background: #61dafb;
    border-radius: 0 1rem 1rem 0;
    font-size: 1rem;
    padding: 0.15rem 0.5rem 0.15rem 1rem;
    margin: 0.25rem auto;
	margin-left: -0.7rem;
    border: 0.2rem solid transparent;
    overflow-wrap: break-word;
	position: relative;
	outline: none;
	color: var(--color-bg);
	font-weight: bold;
	&[disabled] {
		color: white;
		background: var(--color-secondary);
	}
`;

let firstRender = true;

class App extends React.Component {
	constructor() {
		super();
		const params = new URLSearchParams(document.location.search.substring(1));

		this.state = {
			inputValue: params.get('ip') || '1234::/48',
			subnets: [],
		}
		this.inputRef = React.createRef();
	}

	calculate() {
		if (this.state.inputValue !== this.inputRef.current.value || firstRender) {
			firstRender = false;
			const value = this.inputRef.current.value.split('/');
			let cidr = undefined;
			if (value.length > 1 && parseInt(value[1]) > 0) {
				cidr = parseInt(value[1]);
			}
			this.setState({
				inputValue: value[0],
				inputCidr: cidr,
			})
		}
	}

	componentDidMount() {
		this.inputRef.current.addEventListener('keyup', this.calculate.bind(this))
		this.calculate();
	}

	addSubnet() {
		if (!this.state.inputCidr) {
			let defaultCIDR = 23;
			this.inputRef.current.value = this.state.inputValue + "/" + defaultCIDR
			this.setState({
				inputCidr: defaultCIDR,
			})
		}

		let cidr = this.state.inputCidr ? this.state.inputCidr : 60;
		if (this.state.subnets.length > 0) {
			cidr = this.state.subnets[this.state.subnets.length - 1];
		}
		cidr = Math.ceil(cidr / 4 + 1) * 4;
		const subnets = this.state.subnets;
		subnets.push(cidr);
		this.setState({ subnets });
	}

	subnetUpdate(e) {
		const subnets = this.state.subnets;
		subnets[parseInt(e.target.dataset.index)] = e.target.value;
		this.setState({
			subnets
		});
	}

	render() {
		const subnetElements = [];
		let lastCIDR = this.state.inputCidr;
		for (let index = 0; index < this.state.subnets.length; index++) {
			const subnet = this.state.subnets[index];
			subnetElements.push(
				<SubnetWrapper key={index} className="mb-4">
					<ExpandedAddress descriptor={false} address={this.state.inputValue} cidr={[lastCIDR, subnet]} />
					<SubnetInput onChange={this.subnetUpdate.bind(this)} step="4" data-index={index} type="number" defaultValue={subnet} />
					<div>Total number of <b>/{subnet}</b> subnets in a <b>/{lastCIDR}</b>: {numberWithCommas(Math.pow(2, subnet - lastCIDR))}</div>
				</SubnetWrapper>
			);
			lastCIDR = subnet;
		}

		return (
			<div className="App">
				<header className="App-header pt-8 pb-8">
					<small>
						Brought to you by
						<a target="_blank" rel="noreferrer" href="https://www.6connect.com/">
							<img src="/logo.svg" className="inline-block w-32 mx-2 pb-1" alt="6connect" />
						</a>
					</small>
					<input type="text" defaultValue={this.state.inputValue} ref={this.inputRef} className="primary-input" placeholder="ip address" />
					<Row>
						<div className="text-right w-full pr-8">CIDR <FontAwesomeIcon icon={faArrowDown} /></div>
						<SubnetWrapper>
							<ExpandedAddress descriptor={false} address={this.state.inputValue} cidr={[this.state.inputCidr]} />
							<SubnetInput step="4" type="number" defaultValue={this.state.inputCidr} disabled />
						</SubnetWrapper>
						<div className="text-right w-full pr-20"><FontAwesomeIcon icon={faArrowUp} /> Expanded address</div>
					</Row>
					<Row>
						{subnetElements}
						<span onClick={this.addSubnet.bind(this)}>
							<AddNewSubnet>Add Subnet <FontAwesomeIcon icon={faPlusCircle} /></AddNewSubnet>
						</span>
					</Row>
				</header>
			</div>
		);
	}
}

export default App;
