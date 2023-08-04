import styled from "styled-components";
import { AiFillCompass, AiTwotoneHeart } from "react-icons/ai";
import { BsGearFill } from "react-icons/bs";
import { IoExitOutline } from "react-icons/io5";
import { useState } from "react";
import { Logo } from "../../../components";
import { rgba } from "polished";

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
    font-size: 0.85rem;
    font-weight: bold;
    padding-left: 1.75rem;
    color: ${({ theme }) => theme.colors.secondaryVariant};
  }

  .logo {
    margin: 1rem 0;
    padding-left: 1.75rem;
    user-select: none;
  }
`;

const Link = styled.li<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-left: 1.75rem;
  position: relative;
  background: transparent;
  transition: background 250ms;

  & > * {
    color: ${({ theme, $active }) =>
      $active ? theme.colors.quaternary : theme.colors.secondary} !important;
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
        },
        {
          icon: <AiFillCompass />,
          label: "Explore",
          to: "",
        },
      ],
    },
    {
      label: "General",
      links: [
        {
          label: "Settings",
          icon: <BsGearFill />,
        },
        {
          label: "Log out",
          icon: <IoExitOutline />,
        },
      ],
    },
  ];

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
              <Link key={link.label} $active={link.label === activeLink}>
                {link.icon}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveLink(link.label);
                    if (link.action) {
                      link.action();
                    }
                  }}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </ul>
        </div>
      ))}
    </Container>
  );
}

export default Sidebar;
