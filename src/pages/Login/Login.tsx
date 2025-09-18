import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { UseMutationResult } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import publicRuntimeConfig from "@/config/publicRuntime";
import bgImage from "@/assets/loginBackground.png";
import testImage from "@/assets/test.jpg";
import googleIcon from "@/assets/google-icon.png";
import githubIcon from "@/assets/github-icon.png";
import {
    LoginContainer,
    ContentContainer,
    LoginCard,
    ImageSection,
    WelcomeTitle,
    WelcomeSubtitle,
    FormGroup,
    Label,
    Input,
    ForgotPasswordLink,
    SignInButton,
    Divider,
    DividerText,
    GoogleButton,
    GitHubButton,
    SignUpText,
    SignUpLink,
    GoogleIcon,
    GitHubIcon,
    PasswordInputWrapper,
    EyeIcon,
} from "./Login.styled";


interface LoginPageProps {
    codeChallenge?: string;
    codeChallengeMethod?: string;
    loginMutation: UseMutationResult<any, unknown, any, unknown>;
    loginPkceMutation: UseMutationResult<any, unknown, any, unknown>;
}


interface ValidationErrors {
    usernameOrEmail?: string;
    password?: string;
}


const LoginPage: React.FC<LoginPageProps> = ({
    codeChallenge,
    codeChallengeMethod,
    loginMutation,
    loginPkceMutation,
}) => {
    const [loginData, setLoginData] = useState({
        usernameOrEmail: "",
        password: "",
    });


    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<Set<string>>(new Set());


    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};


        // Validate required fields
        if (!loginData.usernameOrEmail.trim()) {
            newErrors.usernameOrEmail = "Username is required";
        }


        if (!loginData.password) {
            newErrors.password = "Password is required";
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleInputChange = (field: string, value: string) => {
        setLoginData({ ...loginData, [field]: value });


        // Mark field as touched
        setTouched(prev => new Set(prev).add(field));


        // Clear errors for this field when user starts typing
        if (errors[field as keyof ValidationErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };


    const handleLogin = () => {
        // Mark all required fields as touched
        setTouched(new Set(['usernameOrEmail', 'password']));


        if (!validateForm()) {
            return;
        }


        const code = btoa(`${loginData.usernameOrEmail}:${loginData.password}`);
        if (codeChallenge && codeChallengeMethod) {
            loginPkceMutation.mutate({
                method: "basic",
                code: code,
                codeChallenge: codeChallenge,
                codeChallengeMethod: codeChallengeMethod,
            });
        } else {
            loginMutation.mutate({
                method: "basic",
                code: code,
            });
        }
    };


    const handleGoogleSuccess = async (credentialResponse: any) => {
        if (!credentialResponse.credential) return;


        if (codeChallenge && codeChallengeMethod) {
            loginPkceMutation.mutate({
                method: "google",
                code: credentialResponse.credential,
                codeChallenge: codeChallenge,
                codeChallengeMethod: codeChallengeMethod,
            });
        } else {
            loginMutation.mutate({
                method: "google",
                code: credentialResponse.credential,
            });
        }
    };


    const handleGitHubLogin = () => {
        const githubAuthUrl = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${publicRuntimeConfig.GITHUB_CLIENT_ID}`;
        window.location.href = githubAuthUrl;
    };


    const hasError = (field: string) => {
        return touched.has(field) && errors[field as keyof ValidationErrors];
    };


    return (
        <LoginContainer backgroundImage={bgImage}>
            <ContentContainer>
                <LoginCard>
                    <WelcomeTitle>Welcome Back!</WelcomeTitle>
                    <WelcomeSubtitle>
                        Today is a new day. It's your day. You shape it.
                        <br />
                        Sign in to start managing your projects.
                    </WelcomeSubtitle>


                    <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Example@email.com"
                            value={loginData.usernameOrEmail}
                            onChange={(e) => handleInputChange('usernameOrEmail', e.target.value)}
                            onBlur={() => setTouched(prev => new Set(prev).add('usernameOrEmail'))}
                            required
                            style={{
                                borderColor: hasError('usernameOrEmail') ? '#D83232' : undefined,
                                borderWidth: hasError('usernameOrEmail') ? '2px' : '1px'
                            }}
                        />
                        {hasError('usernameOrEmail') && (
                            <div style={{
                                color: '#D83232',
                                fontSize: '14px',
                                marginTop: '4px',
                                fontWeight: '500'
                            }}>
                                {errors.usernameOrEmail}
                            </div>
                        )}
                    </FormGroup>


                    <FormGroup>
                        <Label htmlFor="password">Password</Label>
                        <PasswordInputWrapper>
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="At least 8 characters"
                                value={loginData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                onBlur={() => setTouched(prev => new Set(prev).add('password'))}
                                required
                                style={{
                                    borderColor: hasError('password') ? '#D83232' : undefined,
                                    borderWidth: hasError('password') ? '2px' : '1px'
                                }}
                            />
                            {loginData.password && (
                                <EyeIcon
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </EyeIcon>
                            )}
                        </PasswordInputWrapper>
                        {hasError('password') && (
                            <div style={{
                                color: '#D83232',
                                fontSize: '14px',
                                marginTop: '4px',
                                fontWeight: '500'
                            }}>
                                {errors.password}
                            </div>
                        )}
                        <ForgotPasswordLink href="#forgot">Forgot Password?</ForgotPasswordLink>
                    </FormGroup>


                    <SignInButton onClick={handleLogin}>Sign in</SignInButton>


                    <Divider>
                        <DividerText>or</DividerText>
                    </Divider>


                    <GoogleButton>
                        <GoogleIcon src={googleIcon} alt="Google Icon" />
                        Sign in with Google
                    </GoogleButton>


                    <GitHubButton onClick={handleGitHubLogin}>
                        <GitHubIcon src={githubIcon} alt="GitHub Icon" />
                        Sign in with GitHub
                    </GitHubButton>


                    <SignUpText>
                        Don't you have an account? <SignUpLink as={Link} to="/auth/register">Sign up</SignUpLink>
                    </SignUpText>


                    <div style={{ display: "none" }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                console.log("Login Failed");
                            }}
                        />
                    </div>
                </LoginCard>


                <ImageSection backgroundImage={testImage} />
            </ContentContainer>
        </LoginContainer>
    );
};


export default LoginPage;
