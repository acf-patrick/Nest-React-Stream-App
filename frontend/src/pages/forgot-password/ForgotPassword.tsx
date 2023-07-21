import { styled } from "styled-components";
import { Outlet } from "react-router-dom";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  background: ${({ theme }) => theme.colors.background};
  & > div {
    flex-grow: 1;
  }
`;

const Card = styled.div`
  max-width: 360px;
  margin: 0 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  position: relative;
`;

const Image = styled.div`
  background: url(/images/forgot-pwd-bg.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  margin: 5px;
`;

function ForgotPassword() {
  return (
    <Container>
      <Card>
        <Outlet />
      </Card>
      <Image />
    </Container>
  );
}

export default ForgotPassword;
