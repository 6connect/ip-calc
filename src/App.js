import './App.css';
import React from 'react';
import styled from '@emotion/styled';

import ExpandedAddress from './widgets/expandedAddress';
import ExportComponent from './widgets/export';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { numberWithCommas } from './utility';
import { Row, SubnetWrapper, SubnetInput } from './widgets/common';

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


let firstRender = true;

class App extends React.Component {
	constructor() {
		super();
		const params = new URLSearchParams(document.location.search.substring(1));

		this.state = {
			inputValue: params.get('ip') || '2001:DB8::/32',
			subnets: [],
			exportPopup: false,
			exportComponent: false,
		}
		this.inputRef = React.createRef();
	}

	componentDidMount() {
		this.inputRef.current.addEventListener('keyup', this.calculate.bind(this))
		this.calculate();
		window.addEventListener('closeExportPopup', this.closeExportPopup.bind(this));
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
				inputCidr: typeof cidr === 'number' ? cidr : 0,
			})
		}
	}

	addSubnet() {
		if (!this.state.inputCidr) {
			let defaultCIDR = 0;
			this.inputRef.current.value = this.state.inputValue + "/" + defaultCIDR
			this.setState({
				inputCidr: defaultCIDR,
			})
		}

		let cidr = this.state.inputCidr ? this.state.inputCidr : 60;
		if (this.state.subnets.length > 0) {
			cidr = this.state.subnets[this.state.subnets.length - 1];
		}
		cidr = Math.ceil(cidr / 4 + 4) * 4;
		const subnets = this.state.subnets;
		subnets.push(cidr);
		this.correctSubnets(subnets);
	}

	subnetUpdate(e) {
		const subnets = this.state.subnets;
		subnets[parseInt(e.target.dataset.index)] = parseInt(e.target.value);
		this.correctSubnets(subnets);
	}

	correctSubnets(subnets) {
		let lastCIDR = this.state.inputCidr;
		for (let index = 0; index < subnets.length; index++) {
			let subnet = subnets[index];
			if (index > 0 && lastCIDR > subnet) {
				subnet = subnets[index] = Math.min(lastCIDR + 1, 128);
			}
			lastCIDR = subnet;
		}
		this.setState({
			subnets,
		});
	}


	closeExportPopup() {
		this.setState({
			exportComponent: false,
		});
	}
	activateExport(e) {
		this.setState({
			exportComponent: <ExportComponent address={this.state.inputValue} close={this.closeExportPopup.bind(this)} start={parseInt(e.target.dataset.start)} end={parseInt(e.target.dataset.end)} />
		});
	}

	render() {
		const subnetElements = [];
		let lastCIDR = this.state.inputCidr;
		for (let index = 0; index < this.state.subnets.length; index++) {
			let subnet = this.state.subnets[index];
			subnetElements.push(
				<div className="w-full my-4" key={index}>
					<SubnetWrapper>
						<ExpandedAddress descriptor={false} address={this.state.inputValue} cidr={[lastCIDR, subnet]} onChange={this.subnetUpdate.bind(this)} />
						<SubnetInput onChange={this.subnetUpdate.bind(this)} step="4" data-index={index} type="number" value={subnet} min={lastCIDR} max="128" />
					</SubnetWrapper>
					<div>
						<u>{numberWithCommas(Math.pow(2, subnet - lastCIDR))}</u> <b>/{subnet}</b> subnets in a <b>/{lastCIDR}</b>
						{
							// The exporting feature is not quite ready yet, investigating industry standards for any format that would fit this use case.
							/*<Export disabled={(info.end - info.start > 16)} title="Export all possible subnets as CSV" onClick={this.activateExport.bind(this)} data-start={info.start} data-end={info.end}> <FontAwesomeIcon icon={faSave} /> </Export>*/
						}
					</div>
				</div>
			);
			lastCIDR = subnet;
		}

		return (
			<div className="App">
				<header className="App-header pt-8 pb-8">
					{this.state.exportComponent ? this.state.exportComponent : undefined}
					<Row disabled={this.state.exportComponent !== false}>
						<small>
							Brought to you by
							<a target="_blank" rel="noreferrer" href="https://www.6connect.com/">
								<img src="/logo.svg" className="inline-block w-32 mx-2 pb-1" alt="6connect" />
							</a>
						</small>
					</Row>
					<Row disabled={this.state.exportComponent !== false}>
						<h1>IPv6 Subnet Calculator</h1>
					</Row>
					<Row disabled={this.state.exportComponent !== false}>
						<input type="text" defaultValue={this.state.inputValue} ref={this.inputRef} disabled={this.state.exportComponent !== false} className="primary-input" placeholder="ip address" autoFocus />
						<div className="text-right w-full pr-8">CIDR <FontAwesomeIcon icon={faArrowDown} /></div>
						<SubnetWrapper disabled>
							<ExpandedAddress descriptor={false} address={this.state.inputValue} cidr={[0, this.state.inputCidr]} />
							<SubnetInput step="4" type="number" defaultValue={this.state.inputCidr} disabled title="Adjust this CIDR using the input above" />
						</SubnetWrapper>
					</Row>
					<Row disabled={this.state.exportComponent !== false}>
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
