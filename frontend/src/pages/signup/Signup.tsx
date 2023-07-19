import { keyframes, styled } from "styled-components";
import { Logo } from "../../components";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const errorShowing = keyframes`
  from {
    transform: translateY(5px);
    opacity: 0;
  } to {
    transform: translate(0);
    opacity: 1;
  }
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 60% 40%;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: 0;
  display: grid;
  place-items: center;
  /* display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center; */

  p {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.secondary};
    margin-bottom: 2rem;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;

    & > div:not(.names) {
      display: flex;
      flex-direction: column;
    }
  }

  input {
    border: none;
    outline: none;
    background: transparent;
    border-bottom: 1px solid ${({ theme }) => theme.colors.secondaryVariant};
    padding: 1rem 0;

    &::placeholder {
      color: ${({ theme }) => theme.colors.primary};
      font-weight: bold;
    }
  }

  label {
    color: ${({ theme }) => theme.colors.secondaryVariant};
  }

  label[for="confirm_password"] {
    display: flex;
    justify-content: space-between;
  }

  .inner {
    /* padding: 0 5rem; */
    min-width: 480px;
    margin: 0 auto;
  }

  .names {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr 1fr;

    div {
      display: flex;
      flex-direction: column;
    }
  }

  .error {
    color: red;
    animation: ${errorShowing} 500ms both;
  }

  .submit-btn {
    padding-top: 0.75rem;
    flex-direction: row !important;
    justify-content: center;

    button {
      box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.35);
      font-size: 1rem;
      cursor: pointer;
      border: none;
      background: ${({ theme }) => theme.colors.quaternary};
      padding: 0.75rem 3rem;
      border-radius: 25px;
      color: ${({ theme }) => theme.colors.opposite};
      transition: transform 250ms;

      &:hover {
        transform: translateY(-3px);
      }
    }
  }
`;

const Image = styled.div`
  background: url(/images/signup-bg.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

function Signup() {
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const formOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!passwordMismatch) {
      const formData = new FormData(e.currentTarget);

      const signup = async () => {
        await api.post("/auth/signup", {
          fullname:
            formData.get("first-name") + " " + formData.get("last-name"),
          email: formData.get("email"),
          password: formData.get("password"),
        });

        const res = await api.post("/auth/signin", {
          email: formData.get("email"),
          password: formData.get("password"),
        });

        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      };

      signup().catch((err) => {
        console.error(err);
      });
    }
  };

  const passwordInputOnChange = () => {
    const password = passwordRef.current;
    const confirmPassword = confirmPasswordRef.current;

    if (password && confirmPassword) {
      const value = confirmPassword.value;
      if (value) {
        setPasswordMismatch(password.value !== value);
      } else {
        setPasswordMismatch(false);
      }
    }
  };

  return (
    <Container>
      <Card>
        <div className="inner">
          <h1>
            <Logo />
          </h1>
          <p>Create your account</p>
          <form onSubmit={formOnSubmit}>
            <div className="names">
              <div>
                <label htmlFor="first-name">First Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  name="first-name"
                  id="first-name"
                />
              </div>
              <div>
                <label htmlFor="last-name">Last Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  name="last-name"
                  id="last-name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                ref={passwordRef}
              />
            </div>
            <div>
              <label htmlFor="confirm_password">
                <span>Confirm password</span>
                {passwordMismatch && (
                  <span className="error">Passwords don't match</span>
                )}
              </label>
              <input
                type="password"
                id="confirm_password"
                onChange={passwordInputOnChange}
                ref={confirmPasswordRef}
              />
            </div>
            <div className="submit-btn">
              <button type="submit">Register</button>
            </div>
          </form>
        </div>
      </Card>
      <Image />
    </Container>
  );
}

export default Signup;
