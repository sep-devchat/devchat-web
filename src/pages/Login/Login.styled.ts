import styled from "styled-components";


export const LoginContainer = styled.div<{ backgroundImage: string }>`
  min-height: 100vh;
  width: 100%;
  background-image: url(${props => props.backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
`;


export const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  min-height: 500px;
  gap: 10px;
 
  @media (max-width: 768px) {
    flex-direction: column;
    max-width: 400px;
    gap: 16px;
  }
`;


export const LoginCard = styled.div`
  flex: 0 0 50%;
  max-width: none;
  padding: 32px 48px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);


 
  @media (max-width: 768px) {
    flex: none;
    padding: 24px 32px;
    max-width: 100%;
    min-height: 400px;
  }
`;


export const ImageSection = styled.div<{ backgroundImage: string }>`
  flex: 0 0 50%;
  min-height: 500px;
  background-image: url(${props => props.backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin: -15px;
  margin-left: 10px;
 
  @media (max-width: 768px) {
    flex: none;
    min-height: 300px;
    margin: 10px;
  }
`;


export const WelcomeTitle = styled.h1`
  font-size: 26px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 8px;
  line-height: 1.2;
`;


export const WelcomeSubtitle = styled.p`
  font-size: 15px;
  color: #666666;
  margin-bottom: 28px;
  line-height: 1.5;
`;


export const FormGroup = styled.div`
  margin-bottom: 20px;
  position: relative;
`;


export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1A1A1A;
  margin-bottom: 6px;
`;


export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: #ffffff;
  transition: all 0.2s ease;
 
  &::placeholder {
    color: #666666;
  }
 
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
 
  &:hover {
    border-color: #9ca3af;
  }
`;


export const ForgotPasswordLink = styled.a`
    position: absolute;
    right: 0;
    top: 80px;
  font-size: 12px;
  color: #608BC1;
  text-decoration: none;
 
  &:hover {
    text-decoration: underline;
  }
`;


export const SignInButton = styled.button`
  width: 100%;
  padding: 12px 24px;
  background: #133E87;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 20px;
 
  &:hover {
    background: #1952B3;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
  }
 
  &:active {
    transform: translateY(0);
  }
 
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;


export const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
  color: #9ca3af;
  font-size: 14px;


  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #e5e7eb;
  }


  &::before {
    margin-right: 0.75em;
  }


  &::after {
    margin-left: 0.75em;
  }
`;


export const DividerText = styled.span`
  background: #fff;
`;


export const SocialButton = styled.button`
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 10px;
 
  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
 
  &:active {
    transform: translateY(0);
  }
`;


export const GoogleButton = styled(SocialButton)`
  color: #666666;
`;


export const GitHubButton = styled(SocialButton)`
  color: #666666;
`;






export const GoogleIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`;


export const GitHubIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`;
export const SignUpText = styled.p`
  text-align: center;
  font-size: 14px;
  color: #666666;
  margin-top: 16px;
`;


export const SignUpLink = styled.a`
  color: #608BC1;
  text-decoration: none;
  font-weight: 500;
 
  &:hover {
    text-decoration: underline;
  }
`;


export const PasswordInputWrapper = styled.div`
  position: relative;
`;


export const EyeIcon = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #666666;
  display: flex;
  align-items: center;
  justify-content: center;
 
  &:hover {
    color: #333333;
  }


    &:focus {
    outline: none;
  }
`;
