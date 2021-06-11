import React from 'react';
import { getExpandedAddress, splitAtBit } from '../utility';
import { Code, Wrapper } from './common';
import styled from '@emotion/styled';
const ipaddr = require('ipaddr.js');

const Rainbow = styled.span`
    & > span:nth-of-type(1) {
        //color: #25A9DF;
    }
    & > span:nth-of-type(2) {
        color: var(--color-primary);
    }
    & > span:nth-of-type(3) {
        color: #7BE0AD;
    }
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
        const content = [];
        for (let index = 0; index < split.length; index++) {
            content.push(<span key={index}>{split[index]}</span>);
        }
        return (
            <Wrapper>
                {this.props.descriptor !== false ? "Expanded Address:" : ""}
                <Code>
                    <Rainbow>{content}</Rainbow>
                </Code>
            </Wrapper>
        );
    }
}

export default ExpandedAddress;
