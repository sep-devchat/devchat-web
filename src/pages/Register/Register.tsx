import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { UseMutationResult } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import publicRuntimeConfig from "@/config/publicRuntime";
import registerBgImage from "@/assets/registerBackground.png";
import testImage from "@/assets/test.jpg";
import googleIcon from "@/assets/google-icon.png";
import githubIcon from "@/assets/github-icon.png";
import {
    RegisterContainer,
    ContentContainer,
    RegisterCard,
    ImageSection,
    WelcomeTitle,
    WelcomeSubtitle,
    FormGroup,
    FormRow,
    Label,
    Input,
    RegisterButton,
    Divider,
    DividerText,
    GoogleButton,
    GitHubButton,
    SignInText,
    SignInLink,
    GoogleIcon,
    GitHubIcon,
    LabelOption,
    PasswordInputWrapper,
    EyeIcon,
} from "./Register.styled";


interface RegisterPageProps {
    codeChallenge?: string;
    codeChallengeMethod?: string;
    registerMutation: UseMutationResult<any, unknown, any, unknown>;
    registerPkceMutation: UseMutationResult<any, unknown, any, unknown>;
}


interface ValidationErrors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}


const RegisterPage: React.FC<RegisterPageProps> = ({
    codeChallenge,
    codeChallengeMethod,
    registerMutation,
    registerPkceMutation,
}) => {
    const [registerData, setRegisterData] = useState({
        username: "",
        displayName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });


    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<Set<string>>(new Set());


    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};


        // Validate required fields
        if (!registerData.username.trim()) {
            newErrors.username = "Username is required";
        }


        if (!registerData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
            newErrors.email = "Please enter a valid email address";
        }


        if (!registerData.password) {
            newErrors.password = "Password is required";
        } else if (registerData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }


        if (!registerData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (registerData.password !== registerData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            newErrors.password = "Passwords do not match";
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleInputChange = (field: string, value: string) => {
        setRegisterData({ ...registerData, [field]: value });


        // Mark field as touched
        setTouched(prev => new Set(prev).add(field));


        // Clear errors for this field when user starts typing (except password matching errors)
        if (errors[field as keyof ValidationErrors]) {
            // Only clear non-password-matching errors when typing
            if (field === 'password' || field === 'confirmPassword') {
                // Only clear if it's not a password match error, or clear other validation errors
                const currentError = errors[field as keyof ValidationErrors];
                if (currentError && currentError !== "Passwords do not match") {
                    setErrors(prev => ({ ...prev, [field]: undefined }));
                }
            } else {
                setErrors(prev => ({ ...prev, [field]: undefined }));
            }
        }
    };


    const handleRegister = () => {
        // Mark all required fields as touched
        setTouched(new Set(['username', 'email', 'password', 'confirmPassword']));


        if (!validateForm()) {
            return;
        }


        const registrationInfo = {
            username: registerData.username,
            displayName: registerData.displayName,
            email: registerData.email,
            password: registerData.password,
        };


        if (codeChallenge && codeChallengeMethod) {
            registerPkceMutation.mutate({
                method: "basic",
                data: registrationInfo,
                codeChallenge: codeChallenge,
                codeChallengeMethod: codeChallengeMethod,
            });
        } else {
            registerMutation.mutate({
                method: "basic",
                data: registrationInfo,
            });
        }
    };


    const handleGoogleSuccess = async (credentialResponse: any) => {
        if (!credentialResponse.credential) return;


        if (codeChallenge && codeChallengeMethod) {
            registerPkceMutation.mutate({
                method: "google",
                code: credentialResponse.credential,
                codeChallenge: codeChallenge,
                codeChallengeMethod: codeChallengeMethod,
            });
        } else {
            registerMutation.mutate({
                method: "google",
                code: credentialResponse.credential,
            });
        }
    };


    const handleGitHubRegister = () => {
        const githubAuthUrl = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${publicRuntimeConfig.GITHUB_CLIENT_ID}`;
        window.location.href = githubAuthUrl;
    };


    const hasError = (field: string) => {
        return touched.has(field) && errors[field as keyof ValidationErrors];
    };


    return (
        <RegisterContainer backgroundImage={registerBgImage}>
            <ContentContainer>
                <ImageSection backgroundImage={testImage} />


                <RegisterCard>
                    <WelcomeTitle>Register Individual Account!</WelcomeTitle>
                    <WelcomeSubtitle>
                        For the purpose of industry regulation, your details are required.
                    </WelcomeSubtitle>


                    <FormRow>
                        <FormGroup>
                            <Label htmlFor="username">Your username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Username"
                                value={registerData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                onBlur={() => setTouched(prev => new Set(prev).add('username'))}
                                required
                                style={{
                                    borderColor: hasError('username') ? '#ef4444' : undefined,
                                    borderWidth: hasError('username') ? '2px' : '1px'
                                }}
                            />
                            {hasError('username') && (
                                <div style={{
                                    color: '#ef4444',
                                    fontSize: '14px',
                                    marginTop: '4px',
                                    fontWeight: '500'
                                }}>
                                    {errors.username}
                                </div>
                            )}
                        </FormGroup>


                        <FormGroup>
                            <LabelOption htmlFor="displayName">Display name</LabelOption>
                            <Input
                                id="displayName"
                                type="text"
                                placeholder="Display name (Optional)"
                                value={registerData.displayName}
                                onChange={(e) => handleInputChange('displayName', e.target.value)}
                            />
                        </FormGroup>
                    </FormRow>


                    <FormGroup>
                        <Label htmlFor="email">Your email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Example@email.com"
                            value={registerData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            onBlur={() => setTouched(prev => new Set(prev).add('email'))}
                            required
                            style={{
                                borderColor: hasError('email') ? '#ef4444' : undefined,
                                borderWidth: hasError('email') ? '2px' : '1px'
                            }}
                        />
                        {hasError('email') && (
                            <div style={{
                                color: '#ef4444',
                                fontSize: '14px',
                                marginTop: '4px',
                                fontWeight: '500'
                            }}>
                                {errors.email}
                            </div>
                        )}
                    </FormGroup>


                    <FormRow>
                        <FormGroup>
                            <Label htmlFor="password">Password</Label>
                            <PasswordInputWrapper>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="At least 8 characters"
                                    value={registerData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    onBlur={() => setTouched(prev => new Set(prev).add('password'))}
                                    autoComplete="new-password"
                                    required
                                    style={{
                                        borderColor: hasError('password') ? '#ef4444' : undefined,
                                        borderWidth: hasError('password') ? '2px' : '1px'
                                    }}
                                />
                                {registerData.password && (
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
                                    color: '#ef4444',
                                    fontSize: '14px',
                                    marginTop: '4px',
                                    fontWeight: '500'
                                }}>
                                    {errors.password}
                                </div>
                            )}
                        </FormGroup>


                        <FormGroup>
                            <Label htmlFor="confirmPassword">Confirm password</Label>
                            <PasswordInputWrapper>
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm password"
                                    value={registerData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    onBlur={() => setTouched(prev => new Set(prev).add('confirmPassword'))}
                                    autoComplete="new-password"
                                    required
                                    style={{
                                        borderColor: hasError('confirmPassword') ? '#ef4444' : undefined,
                                        borderWidth: hasError('confirmPassword') ? '2px' : '1px'
                                    }}
                                />
                                {registerData.confirmPassword && (
                                    <EyeIcon
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                    >
                                        {showConfirmPassword ? (
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
                            {hasError('confirmPassword') && (
                                <div style={{
                                    color: '#ef4444',
                                    fontSize: '14px',
                                    marginTop: '4px',
                                    fontWeight: '500'
                                }}>
                                    {errors.confirmPassword}
                                </div>
                            )}
                        </FormGroup>
                    </FormRow>


                    <RegisterButton onClick={handleRegister}>Register Account</RegisterButton>


                    <Divider>
                        <DividerText>or</DividerText>
                    </Divider>


                    <GoogleButton>
                        <GoogleIcon src={googleIcon} alt="Google Icon" />
                        Register with Google
                    </GoogleButton>


                    <GitHubButton onClick={handleGitHubRegister}>
                        <GitHubIcon src={githubIcon} alt="GitHub Icon" />
                        Register with Github
                    </GitHubButton>


                    <SignInText>
                        Already have an account? <SignInLink as={Link} to="/auth/login">Sign in</SignInLink>
                    </SignInText>


                    <div style={{ display: "none" }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                console.log("Registration Failed");
                            }}
                        />
                    </div>
                </RegisterCard>
            </ContentContainer>
        </RegisterContainer>
    );
};


export default RegisterPage;
