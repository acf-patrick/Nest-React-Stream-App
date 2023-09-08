import styled from "styled-components";
import { BiPencil } from "react-icons/bi";
import { darken, lighten } from "polished";

const StyledContainer = styled.div`
  form {
    display: flex;
    gap: 1rem;

    & > div:first-of-type {
      flex-grow: 1;
      max-width: 640px;
    }
  }

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .profil-pic {
    & > div {
      width: 186px;
      height: 186px;
      background: grey;
      border-radius: 100%;
      position: relative;
    }

    img {
      width: 100%;
      border-radius: 100%;
    }
  }

  .edit {
    all: unset;
    background: ${({ theme }) =>
      theme.theme === "light"
        ? darken(0.125, theme.colors.background)
        : lighten(0.125, theme.colors.background)};
    position: absolute;
    top: 1rem;
    right: -1rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 2px 5px;
    border-radius: 5px;
    border: 2px solid ${({ theme }) => theme.colors.background};
    cursor: pointer;
  }
`;

export default function Settings() {
  return (
    <StyledContainer>
      <h1>Account settings</h1>
      <form>
        <div></div>
        <div className="profil-pic">
          <label>Profile picture</label>
          <div>
            <img src="/public/images/profile-pic.png" alt="profile" />
            <button className="edit">
              <BiPencil />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </form>
    </StyledContainer>
  );
}
