import React from 'react';
import styled from '@emotion/styled';
const ipaddr = require('ipaddr.js');

const Container = styled.code`
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
const Wrapper = styled.div`
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
`;

class CompressedAddress extends React.Component {
    render() {
        let address = '';
        try {
            address = ipaddr.parse(this.props.address);
        } catch (e) {
            // Invalid address
            address = ipaddr.parse('0::')
        }
        return (
            <Wrapper>
                Compressed Address:
                <Container>
                    {address.toString()}
                </Container>
            </Wrapper>
        );
    }
}

export default CompressedAddress;
