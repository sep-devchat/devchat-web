import { theme } from "@/themes";
import styled from "styled-components";

export const PageWrapper = styled.div`
  background: #fff;
  width: 100vw;
  z-index: -1;
  position: absolute;

  @media (prefers-color-scheme: dark) {
      background: linear-gradient(0deg, var(--primary-100, #0A1F43) 0%, var(--primary-100, #0A1F43) 100%), #FFF;
              height: 100%;
        top: 0px;
        left: 0px;
  }
`;

export const ElipYellow1 = styled.div`
  width: 325px;
  height: 325px;
  flex-shrink: 0;
  aspect-ratio: 1/1;
  border-radius: 325px;
  opacity: 0.58;
  background: ${theme.color.secondary};
  filter: blur(150px);
  position: fixed;
  top: 85px;
  left: -46px;

  @media (prefers-color-scheme: dark) {
    opacity: 0.58;
    background: rgba(215, 215, 59, 0.52);
    filter: blur(150px);
  }
`;

export const ElipBlue1 = styled.div`
  width: 453px;
  height: 453px;
  flex-shrink: 0;
  border-radius: 453px;
  opacity: 0.58;
  background: ${theme.color.primary30};
  filter: blur(150px);
  position: fixed;
  top: -71px;
  left: 249px;

  @media (prefers-color-scheme: dark) {
opacity: 0.58;
background: rgba(0, 94, 255, 0.36);
filter: blur(150px);
  }
`;

export const ElipYellow2 = styled.div`
  width: 453px;
  height: 453px;
  flex-shrink: 0;
  border-radius: 453px;
  opacity: 0.58;
  background: ${theme.color.secondary};
  filter: blur(150px);
  position: fixed;
  top: 358px;
  right: -22px;

  @media (prefers-color-scheme: dark) {
    opacity: 0.58;
    background: rgba(215, 215, 59, 0.52);
    filter: blur(150px);
  }
`;

export const ElipBlue2 = styled.div`
  width: 453px;
  height: 453px;
  transform: rotate(74.335deg);
  flex-shrink: 0;
  border-radius: 453px;
  opacity: 0.44;
  background: ${theme.color.primary30};
  filter: blur(150px);
  position: fixed;
  bottom: -255px;
  left: 385px;

   @media (prefers-color-scheme: dark) {
opacity: 0.58;
background: rgba(0, 94, 255, 0.36);
filter: blur(150px);
  }
`;
