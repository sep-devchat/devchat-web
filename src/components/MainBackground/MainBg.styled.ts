import styled from "styled-components";

export const PageWrapper = styled.div<{ backgroundImage: string }>`
  height: 100vh;
  width: 100%;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0px;
  left: 0px;
`;
