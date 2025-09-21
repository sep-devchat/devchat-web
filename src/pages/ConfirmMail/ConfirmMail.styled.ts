import { Button } from "@/components/ui/button";
import { theme } from "@/themes";
import styled from "styled-components";

export const PageWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`;

export const ContentCard = styled.div`
  display: flex;
  padding: 0px 72px;
  justify-content: center;
  align-items: center;
  gap: 30px;
  flex-direction: column;
`;

export const TitleGr = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 85%;
`;

export const TitleCard = styled.h1`
  color: ${theme.color.primary90};
  font-size: 40px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
`;


export const SubmitButton = styled(Button)`
  width: 100%;
  background: ${theme.color.primary90};
  color: #fff;
  padding: 16px 0;
  &:hover {
    color: ${theme.color.primary90};
    border: 1px solid ${theme.color.primary90};
    background: #fff;
  }
`;

export const LoginButton = styled(Button)`
  width: 100%;
  
  color: ${theme.color.primary90};
    border: 1px solid ${theme.color.primary90};
    background: #fff;
  
  padding: 16px 0;
  &:hover {
    background: ${theme.color.primary90};
    color: #fff;
  }
`;

export const BackText = styled.p`
  color: #666;
  text-align: center;
  font-feature-settings:
    "liga" off,
    "clig" off;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%; /* 16px */
  letter-spacing: 0.16px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export const Text = styled.p`
  color: #666;
  text-align: center;
  font-feature-settings:
    "liga" off,
    "clig" off;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%; /* 16px */
  letter-spacing: 0.16px;
`;

export const BoldText = styled.p`
  color: #666;
  text-align: center;
  font-feature-settings:
    "liga" off,
    "clig" off;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 100%; /* 16px */
  letter-spacing: 0.16px;
`;

export const ButtonActionGr = styled.div`
  display: flex;
  width: 100%;
  gap: 20px;
`;

export const ConfirmImage = styled.img`
  width: 249px;
height: 249px;
aspect-ratio: 1/1;
`;