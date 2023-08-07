import { styled } from "styled-components";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaMoon, FaSun } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { rgba } from "polished";
import ThemeContext from "../contexts/theme";
import api from "../api";

const Container = styled.nav`
  display: flex;
  justify-content: space-between;
  padding-top: 1.75rem;

  .left {
    display: flex;
    gap: 2rem;
    margin-left: 2rem;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-right: 1.75rem;

    & > * {
      cursor: pointer;
    }

    button {
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      font-size: 1.25rem;
      border: none;
      outline: none;
      border-radius: 5rem;
      background: transparent;
      transition: background 500ms;

      &:hover {
        background: ${({ theme }) => rgba(theme.colors.primary, 0.125)};
      }
    }

    .incoming {
      position: relative;

      &::after {
        display: block;
        content: "";
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 5rem;
        background: ${({ theme }) => theme.colors.quaternary};
        right: 6px;
        top: 6px;
      }
    }
  }

  .searchbar {
    position: relative;

    label {
      position: absolute;
      top: 0.95rem;
      left: 1rem;
    }

    input {
      height: 100%;
      width: 100%;
      outline: none;
      padding: 0;
      padding-left: 3rem;
      border: 1px solid ${({ theme }) => rgba(theme.colors.primary, 0.25)};
      border-radius: 1rem;
      min-width: ${({ theme }) => theme.sizes.inputWidth};

      &:focus {
        border: 1px solid ${({ theme }) => theme.colors.secondaryVariant};
      }
    }
  }

  .buttons {
    display: flex;

    button {
      outline: none;
      border: none;
      display: grid;
      place-items: center;
      padding: 0.75rem;
      border-radius: 10rem;
      font-size: 1.5rem;
      cursor: pointer;
      background: transparent;
      transition: background 250ms;

      &:hover {
        background: ${({ theme }) => rgba(theme.colors.primary, 0.125)};
      }

      &:active {
        box-shadow: 1px 1px 5px
          ${({ theme }) => rgba(theme.colors.primary, 0.265)} inset;
      }
    }
  }

  .user {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .name {
      font-weight: bold;
      margin-left: 0.5rem;
    }
  }

  .profil {
    padding: 2px;
    border: 2px solid black;
    border-radius: 10rem;
    display: grid;
    place-items: center;

    div {
      width: 32px;
      aspect-ratio: 1;
      background-size: cover;
      border-radius: 10rem;
    }
  }
`;

function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [userName, setUserName] = useState("");
  const [userPicture, setUserPicture] = useState("/images/profile-pic.png");

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id && localStorage.getItem("token")) {
      api
        .get(`user/${id}`)
        .then((res) => {
          const user = res.data;

          const names: string[] = user.fullname.split(" ");
          let name = names[0];
          if (names.length >= 1) {
            for (let i = 1; i < names.length; ++i) {
              name += ` ${names[i][0]}.`;
            }
          }
          setUserName(name);

          if (user.avatar) {
            setUserPicture(user.avatar);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <Container>
      <div className="left">
        <div className="buttons">
          <button disabled>
            <IoIosArrowBack />
          </button>
          <button>
            <IoIosArrowForward />
          </button>
        </div>
        <div className="searchbar">
          <label htmlFor="search-input">
            <FiSearch />
          </label>
          <input
            type="text"
            id="search-input"
            placeholder="Search everything..."
          />
        </div>
      </div>
      <div className="right">
        <button className="incoming">
          <GoBell />
        </button>
        <button onClick={toggleTheme}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
        <div className="user">
          <span className="name">{userName}</span>
          <div className="profil">
            <div
              style={{
                backgroundImage: `url(${userPicture})`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Header;
