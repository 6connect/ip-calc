import styled from '@emotion/styled';

export const Code = styled.code`
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

export const Wrapper = styled.div`
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 1rem;
`;