import { BsArrowLeft, BsFingerprint } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Pagination from "./Pagination";
import Icon from "./Icon";
import { Input } from "../../../components";
import Button from "./Button";
import Title from "./Title";
import api from "../../../api";


const Form = styled.form`
  .buttons {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

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
  const navigate = useNavigate();

  const formOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const email: string = e.currentTarget.email.value;
    navigate("/forgot-password/2", {
      state: {
        email,
      },
    });
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
          <Button type="submit">Reset password</Button>
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
