import { BsArrowLeft, BsFingerprint } from "react-icons/bs";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Pagination from "./Pagination";
import Icon from "./Icon";
import { Input } from "../../../components";
import api from "../../../api";

const Title = styled.h1`
  margin: unset;
`;

const Form = styled.form`
  .buttons {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    button {
      padding: 0.5rem 0;
      cursor: pointer;
      border: none;
      outline: none;
      color: ${({ theme }) => theme.colors.opposite};
      background: ${({ theme }) => theme.colors.primary};
      transition: background 500ms;

      &:hover {
        background: ${({ theme }) => theme.colors.secondary};
      }
    }

    a {
      color: ${({ theme }) => theme.colors.secondary};
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
    }
  }
`;

function EnterEmail() {
  const formOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const email: string = e.currentTarget.email.value;
  };

  return (
    <>
      <Icon>
        <BsFingerprint />
      </Icon>
      <Title>Forgot password?</Title>
      <p>Don't panic, we'll send you reset instructions.</p>
      <Form onSubmit={formOnSubmit}>
        <Input name="email" id="email" type="email" label="Enter your email" />
        <div className="buttons">
          <button type="submit">Reset password</button>
          <Link to="/">
            <BsArrowLeft />
            <span>Back to log in</span>
          </Link>
        </div>
      </Form>
      <Pagination active={1} />
    </>
  );
}

export default EnterEmail;
