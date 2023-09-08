import styled from "styled-components";
import { Header } from "../../components";
import { Sidebar } from "./components";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;

  & > * {
    flex-grow: 1;
  }

  main {
    overflow-y: auto;
  }

  .outlet {
    padding-left: 3rem;

    &>div>h1 {
      color: ${({ theme }) => theme.colors.primary};
      display: flex;
      align-items: center;
      gap: 1rem;
      font-weight: unset;
      letter-spacing: 2px;
    }
  }
`;

function Dashboard() {
  return (
    <Container>
      <Sidebar />
      <main>
        <Header />
        <div className="outlet">
          <Outlet />
        </div>
      </main>
    </Container>
  );
}

export default Dashboard;
