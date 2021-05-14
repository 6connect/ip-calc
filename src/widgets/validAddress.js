import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { validateV4, validateV6 } from '../utility';
import styled from '@emotion/styled';

const Container = styled.div`
    display: block;
    background: rgba(0,0,50,0.25);
    border-radius: 1rem;
    font-size: 1rem;
    padding: 0.25rem 1rem;
    margin: 0.25rem;

    &.valid {
        box-shadow: 0px 0px 0px 0.2rem #9BC53D;
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
        const mode = this.props.mode.toLowerCase();
        const valid = mode === "v4" ? validateV4(this.props.value) : validateV6(this.props.value);
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
