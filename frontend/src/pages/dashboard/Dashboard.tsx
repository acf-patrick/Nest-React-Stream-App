import styled from "styled-components";
import { Header } from "../../components";
import { Sidebar } from "./components";

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;

  & > * {
    flex-grow: 1;
  }
`;

function Dashboard() {
  return (
    <Container>
      <Sidebar />
      <main>
        <Header />
        <div>Dashboard</div>
      </main>
    </Container>
  );
}

export default Dashboard;
