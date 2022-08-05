import styled from '@emotion/styled';


export const Row = styled.div`
	font-size: 1rem;
	display: flex;
	flex-wrap: wrap;
	width: 95%;
	max-width: 500px;
	justify-content: center;
	padding: 0.5rem 0;

    &[disabled] {
        pointer-events: none;
    }
`;

export const Code = styled.code`
    max-width: 100%;
    display: block;
    background: var(--color-darker);
    border-radius: 1rem;
    font-size: 1rem;
    padding: 0.25rem 1rem;
    margin: 0.25rem auto;
    border: 0.2rem solid transparent;
    overflow-wrap: break-word;

    & > span {
        display: inline;
    }

    &.valid {
        border-color: #9BC53D;
        svg {
            color: #9BC53D;
        }
    }
    &[data-min=true] {
        min-width: 24rem;
    }
`;

export const Wrapper = styled.div`
    text-align: center;
    display: block;
    max-width: 100%;
`;

export const SubnetWrapper = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;

	cursor: default;

	& > div:nth-of-type(1) {
		display: inline-block;
		width: calc(100% - 4rem);
		box-sizing: border-box;
		position: relative;
		z-index: 2;
		margin-bottom: 0;
	}
`;

export const SubnetInput = styled.input`
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
	&::-webkit-inner-spin-button {
		opacity: 1;
	}
	&[disabled] {
		&::-webkit-inner-spin-button {
			opacity: 0;
		}
		cursor: not-allowed;
	}
`;