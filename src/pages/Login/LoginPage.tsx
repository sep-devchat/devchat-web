import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { UseMutationResult } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import publicRuntimeConfig from "@/config/publicRuntime";
import bgImage from "@/assets/loginBackground.png";
import testImage from "@/assets/test.jpg";
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
	SignUpText,
	SignUpLink,
	GitHubIcon,
	PasswordInputWrapper,
	EyeIcon,
	SocialButtonsContainer,
	SocialButtonsRow,
	SocialButtonWrapper,
	GoogleLoginWrapper,
	IconWrapper,
	GitHubButton,
} from "./LoginPage.styled";

interface LoginPageProps {
	codeChallenge?: string;
	codeChallengeMethod?: string;
	loginMutation: UseMutationResult<any, unknown, any, unknown>;
	loginPkceMutation: UseMutationResult<any, unknown, any, unknown>;
}

interface ValidationErrors {
	usernameOrEmail?: string;
	password?: string;
	general?: string;
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
	const [successMessage, setSuccessMessage] = useState<string>("");

	useEffect(() => {
		if (loginMutation.error) {
			const error = loginMutation.error as any;
			setErrors({
				general:
					error?.response?.data?.message ||
					error?.message ||
					"Login failed. Please try again.",
			});
		}
		if (loginMutation.isSuccess) {
			setSuccessMessage("Login successful! Redirecting...");
			setErrors({});
		}
	}, [loginMutation.error, loginMutation.isSuccess]);

	useEffect(() => {
		if (loginPkceMutation.error) {
			const error = loginPkceMutation.error as any;
			setErrors({
				general:
					error?.response?.data?.message ||
					error?.message ||
					"Login failed. Please try again.",
			});
		}
		if (loginPkceMutation.isSuccess) {
			setSuccessMessage("Login successful! Opening application...");
			setErrors({});
		}
	}, [loginPkceMutation.error, loginPkceMutation.isSuccess]);

	const validateForm = (): boolean => {
		const newErrors: ValidationErrors = {};

		if (!loginData.usernameOrEmail.trim()) {
			newErrors.usernameOrEmail = "Username or email is required";
		}

		if (!loginData.password) {
			newErrors.password = "Password is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (field: string, value: string) => {
		setLoginData({ ...loginData, [field]: value });

		setTouched((prev) => new Set(prev).add(field));

		if (errors[field as keyof ValidationErrors]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}

		if (errors.general) {
			setErrors((prev) => ({ ...prev, general: undefined }));
		}

		if (successMessage) {
			setSuccessMessage("");
		}
	};

	const handleLogin = () => {
		setTouched(new Set(["usernameOrEmail", "password"]));
		setErrors({});
		setSuccessMessage("");

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
		console.log("Google login success:", credentialResponse);
		if (!credentialResponse.credential) {
			console.error("No credential received from Google");
			setErrors({ general: "Google login failed. No credential received." });
			return;
		}

		setErrors({});
		setSuccessMessage("");

		try {
			if (codeChallenge && codeChallengeMethod) {
				localStorage.setItem("codeChallenge", codeChallenge);
				localStorage.setItem("codeChallengeMethod", codeChallengeMethod);

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
		} catch (error) {
			console.error("Error during Google login mutation:", error);
			setErrors({ general: "Google login failed. Please try again." });
		}
	};

	const handleGoogleError = () => {
		console.error("Google Login Failed");
		setErrors({ general: "Google login failed. Please try again." });
	};

	const handleGitHubLogin = () => {
		if (codeChallenge && codeChallengeMethod) {
			localStorage.setItem("codeChallenge", codeChallenge);
			localStorage.setItem("codeChallengeMethod", codeChallengeMethod);
		}

		const githubAuthUrl = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${publicRuntimeConfig.GITHUB_CLIENT_ID}`;
		window.location.href = githubAuthUrl;
	};

	const hasError = (field: string) => {
		return touched.has(field) && errors[field as keyof ValidationErrors];
	};

	const isLoading = loginMutation.isPending || loginPkceMutation.isPending;

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

					{errors.general && (
						<div
							style={{
								color: "#D83232",
								fontSize: "14px",
								marginBottom: "16px",
								padding: "12px",
								backgroundColor: "#FEF2F2",
								border: "1px solid #FECACA",
								borderRadius: "6px",
								fontWeight: "500",
							}}
						>
							{errors.general}
						</div>
					)}

					{successMessage && (
						<div
							style={{
								color: "#059669",
								fontSize: "14px",
								marginBottom: "16px",
								padding: "12px",
								backgroundColor: "#F0FDF4",
								border: "1px solid #BBF7D0",
								borderRadius: "6px",
								fontWeight: "500",
							}}
						>
							{successMessage}
						</div>
					)}

					<FormGroup>
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="Example@email.com"
							value={loginData.usernameOrEmail}
							onChange={(e) =>
								handleInputChange("usernameOrEmail", e.target.value)
							}
							onBlur={() =>
								setTouched((prev) => new Set(prev).add("usernameOrEmail"))
							}
							disabled={isLoading}
							required
							style={{
								borderColor: hasError("usernameOrEmail")
									? "#D83232"
									: undefined,
								borderWidth: hasError("usernameOrEmail") ? "2px" : "1px",
								minHeight: "44px",
								opacity: isLoading ? 0.6 : 1,
							}}
						/>
						{hasError("usernameOrEmail") && (
							<div
								style={{
									color: "#D83232",
									fontSize: "14px",
									marginTop: "4px",
									fontWeight: "500",
								}}
							>
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
								onChange={(e) => handleInputChange("password", e.target.value)}
								onBlur={() =>
									setTouched((prev) => new Set(prev).add("password"))
								}
								disabled={isLoading}
								required
								style={{
									borderColor: hasError("password") ? "#D83232" : undefined,
									borderWidth: hasError("password") ? "2px" : "1px",
									minHeight: "44px",
									opacity: isLoading ? 0.6 : 1,
								}}
							/>
							{loginData.password && (
								<EyeIcon
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									disabled={isLoading}
									aria-label={showPassword ? "Hide password" : "Show password"}
									style={{ opacity: isLoading ? 0.6 : 1 }}
								>
									{showPassword ? (
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
											<line x1="1" y1="1" x2="23" y2="23" />
										</svg>
									) : (
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
											<circle cx="12" cy="12" r="3" />
										</svg>
									)}
								</EyeIcon>
							)}
						</PasswordInputWrapper>
						{hasError("password") && (
							<div
								style={{
									color: "#D83232",
									fontSize: "14px",
									marginTop: "4px",
									fontWeight: "500",
								}}
							>
								{errors.password}
							</div>
						)}
						<ForgotPasswordLink href="#forgot">
							Forgot Password?
						</ForgotPasswordLink>
					</FormGroup>

					<SignInButton
						onClick={handleLogin}
						disabled={isLoading}
						style={{
							opacity: isLoading ? 0.6 : 1,
							cursor: isLoading ? "not-allowed" : "pointer",
							minHeight: "44px",
						}}
					>
						{isLoading ? "Signing in..." : "Sign in"}
					</SignInButton>

					<Divider>
						<DividerText>or</DividerText>
					</Divider>

					<SocialButtonsContainer>
						<SocialButtonsRow>
							<SocialButtonWrapper>
								<GoogleLoginWrapper>
									<GoogleLogin
										onSuccess={handleGoogleSuccess}
										onError={handleGoogleError}
										useOneTap={false}
										auto_select={false}
										text="signin_with"
										theme="outline"
										size="large"
										width="250"
										locale="en"
										shape="rectangular"
										type="standard"
										logo_alignment="center"
										containerProps={{
											style: {
												width: "100%",
												opacity: isLoading ? 0.6 : 1,
												pointerEvents: isLoading ? "none" : "auto",
												filter: isLoading ? "grayscale(0.5)" : "none",
												borderRadius: "16px",
											},
										}}
									/>
								</GoogleLoginWrapper>
							</SocialButtonWrapper>

							<SocialButtonWrapper>
								<GitHubButton
									onClick={handleGitHubLogin}
									disabled={isLoading}
									style={{
										opacity: isLoading ? 0.6 : 1,
										cursor: isLoading ? "not-allowed" : "pointer",
										minHeight: "40px",
									}}
								>
									<IconWrapper>
										<GitHubIcon src={githubIcon} alt="GitHub Icon" />
									</IconWrapper>
									<span>Sign in with GitHub</span>
								</GitHubButton>
							</SocialButtonWrapper>
						</SocialButtonsRow>
					</SocialButtonsContainer>

					<SignUpText>
						Don't you have an account?{" "}
						<SignUpLink as={Link} to="/auth/register">
							Sign up
						</SignUpLink>
					</SignUpText>
				</LoginCard>

				<ImageSection
					backgroundImage={testImage}
					style={{ minHeight: "calc(100vh - 40px)" }}
				/>
			</ContentContainer>
		</LoginContainer>
	);
};

export default LoginPage;
