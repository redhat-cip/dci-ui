import styled from "styled-components";
import { Colors } from "../../ui";
import CoverImg from "./Cover.jpg";

const Cover = styled.div`
  min-height: 100vh;
  height: 100vh;
  background: ${Colors.black800} url(${CoverImg}) no-repeat fixed center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Cover;
