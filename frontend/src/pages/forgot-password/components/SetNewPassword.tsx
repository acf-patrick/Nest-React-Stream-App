import { BsArrowLeft } from "react-icons/bs";
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { MdOutlinePassword } from "react-icons/md";
import { styled } from "styled-components";
import Icon from "./Icon";
import Title from "./Title";
import Button from "./Button";
import Pagination from "./Pagination";
import { Input } from "../../../components";
import api from "../../../api";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  button {
    margin: 0.5rem 0;
  }

  .error {
    color: red;
    position: relative;
    margin-bottom: 0.5rem;

    p {
      margin: unset;
      position: absolute;
      top: 0;
      font-size: 0.75rem;
    }
  }

  .back {
    margin: unset;
    color: ${({ theme }) => theme.colors.secondary};

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;

    & > * {
      color: ${({ theme }) => theme.colors.secondary};
      transition: color 500ms;
    }

    &:hover > * {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

function SetNewPassword() {
  const location = useLocation();
  const [code, _] = useState<string>(location.state?.code);
  const [error, setError] = useState("");

  const formOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    api.post("/user/password", {
      code,
      password: data.get("password"),
    });
  };

  return (
    <>
      <Icon>
        <MdOutlinePassword />
      </Icon>
      <Title>Set new password</Title>
      <Form onSubmit={formOnSubmit}>
        <div className="error">{error && <p>Passwords don't match</p>}</div>
        <Input
          label="Password"
          name="password"
          id="password"
          type="password"
          onChange={() => {
            setError("");
          }}
        />
        <Input
          label="Confirm password"
          name="confirm-password"
          id="confirm_password"
          type="password"
          onChange={(value) => {
            const input = document.querySelector(
              "#password"
            ) as HTMLInputElement;

            if (value) {
              if (value !== input.value) {
                setError("Passwords don't match.");
              } else {
                setError("");
              }
            }
          }}
        />
        <Button type="submit">Reset password</Button>
        <p className="back">
          <BsArrowLeft />
          <Link to="/">
            <span>Back to log in</span>
          </Link>
        </p>
      </Form>
      <Pagination active={3} />
    </>
  );
}

export default SetNewPassword;
