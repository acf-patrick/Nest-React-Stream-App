import { styled } from "styled-components";
import { GrPrevious, GrNext } from "react-icons/gr";

const Container = styled.nav`
  display: flex;
  justify-content: space-between;
  padding-top: 1.75rem;

  .buttons {
    display: flex;
    gap: 1.5rem;

    button {
      background: grey;
      outline: none;
      border: none;
      display: grid;
      place-items: center;
      padding: 1rem;
      border-radius: 10rem;
      font-size: 1rem;
      cursor: pointer;

      &:hover {
        background: blue;
      }
    }
  }
`;

function Header() {
  return (
    <Container>
      <div className="left">
        <div className="buttons">
          <button><GrPrevious /></button>
          <button><GrNext /></button>
        </div>
        <div className="searchbar">

        </div>
      </div>
      <div className="right">

      </div>
    </Container>
  );
}

export default Header;