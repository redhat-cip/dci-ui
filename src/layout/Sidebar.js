import styled from "styled-components";

const Sidebar = styled.div`
  @media (min-width: 480px) {
    position: fixed;
    width: 100px;
    height: 100%;
    position: fixed;
    z-index: 1;
    overflow-x: hidden;
  }

  @media (min-width: 960px) {
    width: 220px;
  }
`;

export default Sidebar;
