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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  p {
    margin: unset;
    color: ${({ theme }) => theme.colors.secondary};
  }

  button {
    margin: 0.5rem 0;
  }

  p.back {
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

  return (
    <>
      <Icon>
        <MdOutlinePassword />
      </Icon>
      <Title>Set new password</Title>
      <Form>
        <p>Must be at least 8 characters.</p>
        <Input label="Password" name="password" id="password" type="password" />
        <Input
          label="Confirm password"
          name="confirm-password"
          id="confirm_password"
          type="password"
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
