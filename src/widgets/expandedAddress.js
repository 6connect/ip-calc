import React from 'react';
import { getExpandedAddress, splitAtBit } from '../utility';
import { Code, Wrapper } from './common';
import styled from '@emotion/styled';
const ipaddr = require('ipaddr.js');

const SecondHalf = styled.span`
    color: #25A9DF;
`;

class ExpandedAddress extends React.Component {
    render() {
        let address = '';
        let split = false;
        try {
            address = ipaddr.parse(this.props.address);
            split = splitAtBit(getExpandedAddress(address), this.props.cidr);
        } catch (e) {
            // Invalid address
            address = ipaddr.parse('0::')
        }
        if (!split) {
            split = [getExpandedAddress(address), ''];
        }
        return (
            <Wrapper>
                Expanded Address:
                <Code>
                    <span>{split[0]}</span>
                    <SecondHalf>{split[1]}</SecondHalf>
                </Code>
            </Wrapper>
        );
    }
}

export default ExpandedAddress;
