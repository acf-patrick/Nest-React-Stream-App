import styled from "styled-components";

const StyledVideoList = styled.div`
  ul {
    display: grid;
    gap: 1rem;
    // grid-auto-rows: 360px;
    grid-template-columns: repeat(4, 1fr);
    list-style: none;
    padding: unset;
    margin-top: 1.5rem;
    padding-right: 2rem;
  }
`;

export default StyledVideoList;
