import React from 'react';
import { Code, Wrapper } from './common';
const ipaddr = require('ipaddr.js');

class CompressedAddress extends React.Component {
	render() {
		let address = '';
		try {
			address = ipaddr.parse(this.props.address);
		} catch (e) {
			// Invalid address, use a placeholder
			address = ipaddr.parse('0::')
		}
		return (
			<Wrapper>
				Compressed Address:
				<Code>
					{address.toString()}
				</Code>
			</Wrapper>
		);
	}
}

export default CompressedAddress;