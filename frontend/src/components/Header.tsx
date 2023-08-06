import { styled } from "styled-components";
import { FiSearch } from "react-icons/fi";
import { GrPrevious, GrNext } from "react-icons/gr";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Container = styled.nav`
  display: flex;
  justify-content: space-between;
  padding-top: 1.75rem;

  .left {
    display: flex;
  }

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
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [userPicture, setUserPicture] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id && localStorage.getItem("token")) {
      api
        .get(`user/${id}`)
        .then((res) => {
          const user = res.data;
          setUserName(user.fullname);
          setUserPicture(user.avatar);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      navigate("/");
    }
  }, []);

  return (
    <Container>
      <div className="left">
        <div className="buttons">
          <button>
            <GrPrevious />
          </button>
          <button>
            <GrNext />
          </button>
        </div>
        <div className="searchbar">
          <label htmlFor="search-input">
            <FiSearch />
          </label>
          <input type="text" id="search-input" placeholder="Search..." />
        </div>
      </div>
      <div className="right"></div>
    </Container>
  );
}

export default Header;
