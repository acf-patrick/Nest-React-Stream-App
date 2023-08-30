import { styled } from "styled-components";
import { IoTelescopeSharp } from "react-icons/io5";

const StyledContainer = styled.div``;

export default function Explore() {
  return (
    <StyledContainer>
      <h1>
        <span>Discover</span>
        <IoTelescopeSharp />
      </h1>
    </StyledContainer>
  );
}
