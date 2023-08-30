import styled from "styled-components";
import { AiTwotoneHeart } from "react-icons/ai";
import { FaRegCompass } from "react-icons/fa";
import { BsGear } from "react-icons/bs";
import { IoExitOutline } from "react-icons/io5";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../../components";
import { rgba } from "polished";
import api from "../../../api";
import { Link } from "react-router-dom";

type Link = {
  icon: React.JSX.Element;
  label: string;
  to?: string;
  action?: () => void;
};

type Section = {
  label: string;
  links: Link[];
};

const Container = styled.nav`
  display: flex;
  flex-direction: column;
  min-width: 280px;
  max-width: 280px;
  align-items: stretch;
  padding-top: 1rem;
  border-right: 2px solid ${({ theme }) => rgba(theme.colors.secondary, 0.3)};

  ul {
    list-style: none;
    padding: unset;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
  }

  .section > p {
    font-size: 0.75rem;
    padding-left: 1.75rem;
    color: ${({ theme }) => theme.colors.secondaryVariant};
  }

  .logo {
    margin: 1rem 0;
    padding-left: 1.75rem;
    user-select: none;
  }
`;

const StyledLink = styled.li<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-left: 1.75rem;
  position: relative;
  background: transparent;
  transition: background 250ms;

  & > a {
    color: ${({ theme, $active }) =>
      $active
        ? theme.colors.primary
        : rgba(theme.colors.primary, 0.6)} !important;
  }

  & > svg {
    color: ${({ theme, $active }) =>
      $active
        ? theme.colors.quaternary
        : rgba(theme.colors.primary, 0.6)} !important;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.tertiary};
  }

  &::before {
    position: absolute;
    left: 1px;
    border-radius: 5px;
    display: ${({ $active }) => ($active ? "block" : "none")};
    content: "";
    width: 5px;
    height: 1.5rem;
    background: ${({ theme }) => theme.colors.quaternary};
  }

  svg {
    font-size: 1.25rem;
  }

  a {
    flex-grow: 1;
    padding: 0.5rem 0;
  }
`;

function Sidebar() {
  const sections: Section[] = [
    {
      label: "Menu",
      links: [
        {
          icon: <AiTwotoneHeart />,
          label: "My Videos",
          to: "/",
        },
        {
          icon: <FaRegCompass />,
          label: "Explore",
          to: "/explore",
        },
      ],
    },
    {
      label: "General",
      links: [
        {
          label: "Settings",
          icon: <BsGear />,
          to: "/settings",
        },
        {
          label: "Log out",
          icon: <IoExitOutline />,
          action() {
            const token = localStorage.getItem("refresh");
            const logout = async () => {
              const res = await api.get("/auth/refresh-tokens", {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              const { accessToken } = res.data;
              await api.get("/auth/logout", {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });
            };

            logout()
              .then(() => {
                localStorage.clear();
                navigate("/login");
              })
              .catch((err) => console.error(err));
          },
        },
      ],
    },
  ];

  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(sections[0].links[0].label);

  return (
    <Container>
      <h1 className="logo">
        <Logo />
      </h1>
      {sections.map((section, i) => (
        <div className="section" key={i}>
          <p>{section.label}</p>
          <ul>
            {section.links.map((link) => (
              <StyledLink key={link.label} $active={link.label === activeLink}>
                {link.icon}
                {link.action ? (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveLink(link.label);
                      link.action!();
                    }}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.to!}
                    onClick={() => {
                      setActiveLink(link.label);
                    }}
                  >
                    {link.label}
                  </Link>
                )}
              </StyledLink>
            ))}
          </ul>
        </div>
      ))}
    </Container>
  );
}

export default Sidebar;
