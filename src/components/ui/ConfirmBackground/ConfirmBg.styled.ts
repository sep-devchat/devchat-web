import { theme } from "@/themes";
import styled from "styled-components";

export const PageWrapper = styled.div`
  background: #fff;
  width: 100vw;
  z-index: -1;
    position: absolute;
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
`;
