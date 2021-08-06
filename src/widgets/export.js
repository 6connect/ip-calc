import React from 'react';
import styled from '@emotion/styled';
import { Row, SubnetWrapper, SubnetInput } from './common';
import ExpandedAddress from './expandedAddress';

const FloatingWrapper = styled.div`
    z-index: 999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    padding: 3rem 1rem;
    overflow: auto;

    display: flex;
    flex-direction: column;
    align-items: center;
`;
const ContentWrapper = styled.div`
    box-shadow: 0px 0px 3rem 1rem rgba(0,0,0, 0.5);
    background-color: var(--color-bg);
    border-radius: 1rem;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const Button = styled.button`
	display: inline-block;
    margin: 0 0.5rem;
    background: var(--color-primary);
    &[data-secondary] {
        background: var(--color-secondary);
    }
    border-radius: 1.5rem;
    font-size: 1rem;
    padding: 0.75rem 2rem;
    line-height: 1rem;
	outline: none;
	color: var(--color-bg);
	font-weight: bold;
    &[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;
const CheckboxRow = styled.div`
    width: 100%;
    text-align: left;
    padding: 0 1rem;
    margin: auto;
    max-width: 25rem;
    & > input {
        margin-right: 0.5rem;
    }
`;

const CIDRInput = styled.input`
	display: inline-block;
    margin: 0 0.5rem;
    text-align: center;
	box-sizing: border-box;
	width: 50%;
    background: #61dafb;
    border-radius: 1rem;
    font-size: 1rem;
    padding: 0.15rem 0.5rem 0.15rem 1rem;
    border: 0.2rem solid transparent;
    overflow-wrap: break-word;
	position: relative;
	outline: none;
	color: var(--color-bg);
	font-weight: bold;
`;

class ExportComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: this.props.address,
            start: this.props.start,
            end: this.props.end,
            exclusions: [],
        }

        this.inputRef = React.createRef();
    }

    updateInputValue(e) {
        this.setState({
            inputValue: e.target.value,
        });
    }

    cidrChange(e) {
        // listens to the change event of the input and updates the start and end values of the state
        switch (e.target.dataset.target) {
            case 'start':
                this.setState({
                    start: e.target.value,
                });
                if (this.state.end < e.target.value) {
                    this.setState({
                        end: e.target.value,
                    });
                }
                break;
            case 'end':
                this.setState({
                    end: e.target.value,
                });
                if (this.state.start > e.target.value) {
                    this.setState({
                        start: e.target.value,
                    });
                }
                break;
            default:
                break;
        }
        this.setState({
            [e.target.dataset.target]: e.target.value,
        });
    }

    addExclusionRow() {
        const exclusions = this.state.exclusions;
        exclusions.push({
            cidr: this.state.end,
            address: this.state.inputValue,
        });
        this.setState({
            exclusions,
        });
    }

    exclusionUpdate(e) {
        let exclusions = this.state.exclusions;
        exclusions[e.target.dataset.index].cidr = e.target.value;
        this.setState({
            exclusions,
        });
    }

    exclusionUpdateAddress(e) {
        let exclusions = this.state.exclusions;
        exclusions[e.target.dataset.index].address = e.target.value;
        this.setState({
            exclusions,
        });
    }


    closeIfClicked(e) {
        if (e && e.target && e.target.classList.contains('close')) {
            this.props.close();
        }
    }

    componentDidMount () {
        // call this.props.close if escape key is pressed
        window.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                this.props.close();
            }
        });
    }

    render() {
        const exclusions = [];
        for (let index = 0; index < this.state.exclusions.length; index++) {
            const element = this.state.exclusions[index];
            exclusions.push(
                <div key={index}>
                    <input type="text" value={element.address} onChange={this.exclusionUpdateAddress.bind(this)} data-index={index} ref={this.inputRef} className="primary-input" data-size="small" placeholder="ip address" autoFocus />
                    <SubnetWrapper className="mt-0 mb-8">
                        <ExpandedAddress flipped={true} descriptor={false} address={element.address} cidr={[this.state.start, element.cidr]} prominentIndicator={2} />
                        <SubnetInput onChange={this.exclusionUpdate.bind(this)} data-index={index} type="number" value={element.cidr} min={this.state.start + 1} max={this.state.end} />
                    </SubnetWrapper>
                </div>
            );
        }

        return (
            <FloatingWrapper className="close" onClick={this.closeIfClicked.bind(this)}>
                <ContentWrapper>
                    <Row>
                        <h1>Export</h1>
                        <input type="text" value={this.state.inputValue} onChange={this.updateInputValue.bind(this)} ref={this.inputRef} className="primary-input" placeholder="ip address" autoFocus />
                    </Row>
                    <Row>
                        <h2 className="text-xl">CIDRs</h2>
                        <div className="flex justify-center w-full">
                            <span className="w-full text-center">Start</span>
                            <span className="w-full text-center">End</span>
                        </div>
                        <div className="flex justify-center w-full">
                            <CIDRInput data-target="start" onChange={this.cidrChange.bind(this)} type="number" value={this.state.start} min="0" max="128" />
                            <CIDRInput data-target="end" onChange={this.cidrChange.bind(this)} type="number" value={this.state.end} min="0" max="128" />
                        </div>
                    </Row>
                    <Row className="mt-4 mb-4">
                        <ExpandedAddress address={this.state.inputValue} cidr={[this.state.start, this.state.end]} flipped />
                    </Row>
                    <Row className="mb-4">
                        <h2 className="text-xl w-full block mb-2">Exclusions</h2>
                        {exclusions}
                        <Button data-secondary onClick={this.addExclusionRow.bind(this)}>Add row</Button>
                    </Row>
                    <Row>
                        <CheckboxRow>
                            <input type="checkbox" defaultChecked id="cidrNotationCheckbox" />
                            <label htmlFor="cidrNotationCheckbox">Export with CIDR notation</label>
                        </CheckboxRow>
                        {/* <CheckboxRow>
                            <input type="checkbox" id="exportEveryAddress" />
                            <label htmlFor="exportEveryAddress">Export every address <small>(limited to 65,536 results)</small></label>
                        </CheckboxRow> */}
                    </Row>
                    <Row>
                        <Button disabled>Save</Button>
                    </Row>
                </ContentWrapper>
            </FloatingWrapper>
        );
    }
}

export default ExportComponent;
