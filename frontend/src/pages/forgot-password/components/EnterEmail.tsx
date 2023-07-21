import { BsArrowLeft, BsFingerprint } from "react-icons/bs";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Pagination from "./Pagination";
import Icon from "./Icon";
import { useRef } from "react";
import api from "../../../api";

const Title = styled.h1`
  margin: unset;
`;

const Form = styled.form`
  input {
    color: ${({ theme }) => theme.colors.secondary};
    background: transparent;
    outline: none;
    border: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.secondary};
    padding: 0 0 0.5rem;
  }

  label {
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 0.85rem;
    transform: translateY(1rem);
    transition: transform 250ms;
    cursor: text;
  }

  label.outside {
    transform: translateY(-0.5rem);
  }

  .input {
    display: flex;
    flex-direction: column-reverse;
  }

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
  const labelRef = useRef<HTMLLabelElement>(null);

  const formOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const email: string = e.currentTarget.email.value;
    
  };

  const inputOnFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
    const label = labelRef.current;
    if (label) {
      const input = e.currentTarget;
      if (input.value === "") {
        label.classList.add("outside");
      }
    }
  };

  const inputOnBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    const label = labelRef.current;
    if (label) {
      const input = e.currentTarget;
      if (input.value === "") {
        label.classList.remove("outside");
      }
    }
  };

  return (
    <>
      <Icon>
        <BsFingerprint />
      </Icon>
      <Title>Forgot password?</Title>
      <p>Don't panic, we'll send you reset instructions.</p>
      <Form onSubmit={formOnSubmit}>
        <div className="input">
          <input
            type="email"
            name="email"
            id="email"
            required
            onFocus={inputOnFocus}
            onBlur={inputOnBlur}
          />
          <label htmlFor="email" ref={labelRef}>
            Enter your email
          </label>
        </div>
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
