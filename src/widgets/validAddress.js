import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import styled from '@emotion/styled';
const ipaddr = require('ipaddr.js');

const Container = styled.div`
    display: block;
    background: rgba(0,0,50,0.25);
    border-radius: 1rem;
    font-size: 1rem;
    padding: 0.25rem 1rem;
    margin: 0.25rem;
    border: 0.2rem solid transparent;

    &.valid {
        border-color: #9BC53D;
        svg {
            color: #9BC53D;
        }
    }
`;

class ValidIPWidget extends React.Component {
	render() {
		if (!this.props.mode) {
			return <></>
		}

		let parsed = false;
		try {
			parsed = ipaddr.parse(this.props.value);
		} catch (e) {
			//Address is invalid or incomplete
		}

		const mode = this.props.mode.toLowerCase();
		let valid = false;
		try {
			valid = mode === parsed.kind().substr(2);
		} catch (e) {
			//Invalid or incomplete address
		}
		return (
			<Container className={valid ? 'valid' : 'invalid'}>
				{
					mode === "v4" ? <span>v4 {
						valid ? <FontAwesomeIcon icon={faCheckCircle} /> : <FontAwesomeIcon icon={faTimesCircle} />
					}</span> : <span>v6 {
						valid ? <FontAwesomeIcon icon={faCheckCircle} /> : <FontAwesomeIcon icon={faTimesCircle} />
					}</span>
				}
			</Container>
		);
	}
}

export default ValidIPWidget;
