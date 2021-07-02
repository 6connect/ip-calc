import styled from '@emotion/styled';

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
`;

export const Wrapper = styled.div`
    text-align: center;
    display: block;
    max-width: 100%;
`;