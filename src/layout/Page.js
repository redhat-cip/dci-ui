import styled from "styled-components";

const Page = styled.div`
  @media (min-width: 480px) {
    display: grid;
    grid-template-columns: 100px auto;
    grid-template-rows: 60px auto;
  }

  @media (min-width: 960px) {
    grid-template-columns: 220px auto;
  }
`;

export default Page;
