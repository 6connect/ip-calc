import React from 'react';
import { getExpandedAddress, splitAtBit } from '../utility';
import { Code } from './common';
import styled from '@emotion/styled';
const ipaddr = require('ipaddr.js');

const Indicator = styled.div`
    border-radius: 0.35em;
    position: absolute;
    background: currentColor;
    bottom: calc(100% + 1em);
    left: 0;
    width: 2.5em;
    margin-left: -1em;
    &::after {
        position: absolute;
        top: 100%;
        left: 0%;
        content: '';
        padding: 25% 50%;
        background-image: url(/down-arrow.svg);
        background-size: 100% 100%;
    }
    & > span {
        color: #fff;
        white-space: nowrap;
    }
`;
const Rainbow = styled.span`
    & > span {
        position: relative;
    }
    & > span:nth-of-type(1) {
        color: var(--color-tertiary);
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
        let splits = [];

        try {
            address = ipaddr.parse(this.props.address);
            for (let index = 0; index < this.props.cidr.length; index++) {
                const element = this.props.cidr[index];
                splits.push(Number(element));
            }
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
            content.push(<span key={index}>
                {splits[index-1] && <Indicator><span>/{splits[index-1]}</span></Indicator>}
                {split[index]}
            </span>);
        }
        return (
            <div>
                {this.props.descriptor !== false ? "Expanded Address:" : ""}
                <Code>
                    <Rainbow>{content}</Rainbow>
                </Code>
            </div>
        );
    }
}

export default ExpandedAddress;
