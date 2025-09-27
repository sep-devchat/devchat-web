import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { UseMutationResult } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import publicRuntimeConfig from "@/config/publicRuntime";
import registerBgImage from "@/assets/registerBackground.png";
import testImage from "@/assets/test.jpg";
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
	GitHubButton,
	SignInText,
	SignInLink,
	GitHubIcon,
	LabelOption,
	PasswordInputWrapper,
	EyeIcon,
	SocialButtonsContainer,
	SocialButtonsRow,
	SocialButtonWrapper,
	GoogleLoginWrapper,
	IconWrapper,
	Select,
	SelectWrapper,
} from "./Register.styled";

interface RegisterPageProps {
	codeChallenge?: string;
	codeChallengeMethod?: string;
	registerMutation: UseMutationResult<any, unknown, any, unknown>;
	registerPkceMutation: UseMutationResult<any, unknown, any, unknown>;
}

interface ValidationErrors {
	username?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
	avatarUrl?: string;
	timezone?: string;
	general?: string;
}

const timezones = [
	{ value: "", label: "Select timezone" },
	{ value: "UTC", label: "(UTC+00:00) UTC" },
	{ value: "Asia/Ho_Chi_Minh", label: "(UTC+07:00) Ho Chi Minh City" },
	{ value: "Asia/Bangkok", label: "(UTC+07:00) Bangkok" },
	{ value: "Asia/Singapore", label: "(UTC+08:00) Singapore" },
	{ value: "Asia/Shanghai", label: "(UTC+08:00) Shanghai" },
	{ value: "Asia/Tokyo", label: "(UTC+09:00) Tokyo" },
	{ value: "Asia/Seoul", label: "(UTC+09:00) Seoul" },
	{ value: "Australia/Sydney", label: "(UTC+10:00) Sydney" },
	{ value: "Europe/London", label: "(UTC+00:00) London" },
	{ value: "Europe/Paris", label: "(UTC+01:00) Paris" },
	{ value: "Europe/Berlin", label: "(UTC+01:00) Berlin" },
	{ value: "Europe/Moscow", label: "(UTC+03:00) Moscow" },
	{ value: "America/New_York", label: "(UTC-05:00) New York" },
	{ value: "America/Chicago", label: "(UTC-06:00) Chicago" },
	{ value: "America/Denver", label: "(UTC-07:00) Denver" },
	{ value: "America/Los_Angeles", label: "(UTC-08:00) Los Angeles" },
	{ value: "America/Sao_Paulo", label: "(UTC-03:00) São Paulo" },
];

const RegisterPage: React.FC<RegisterPageProps> = ({
	codeChallenge,
	codeChallengeMethod,
	registerMutation,
	registerPkceMutation,
}) => {
	const [registerData, setRegisterData] = useState({
		username: "",
		firstName: "",
		lastName: "",
		displayName: "",
		email: "",
		password: "",
		confirmPassword: "",
		timezone: "",
		avatarUrl: "",
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [touched, setTouched] = useState<Set<string>>(new Set());
	const [successMessage, setSuccessMessage] = useState("");

	const isValidUrl = (url: string): boolean => {
		if (!url) return true;
		try {
			const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
			return urlPattern.test(url) && new URL(url) !== null;
		} catch {
			return false;
		}
	};

	const validateField = (field: string, value: string): string | undefined => {
		switch (field) {
			case "username":
				if (!value.trim()) {
					return "Username is required";
				}
				if (value.length > 50) {
					return "Username must not exceed 50 characters";
				}
				break;

			case "firstName":
				if (!value.trim()) {
					return "First name is required";
				}
				if (value.length > 100) {
					return "First name must not exceed 100 characters";
				}
				break;

			case "lastName":
				if (!value.trim()) {
					return "Last name is required";
				}
				if (value.length > 100) {
					return "Last name must not exceed 100 characters";
				}
				break;

			case "email":
				if (!value.trim()) {
					return "Email is required";
				}
				if (value.length > 255) {
					return "Email must not exceed 255 characters";
				}
				if (!/\S+@\S+\.\S+/.test(value)) {
					return "Please enter a valid email address";
				}
				break;

			case "password":
				if (!value) {
					return "Password is required";
				}
				if (value.length < 8) {
					return "Password must be at least 8 characters";
				}
				if (value.length > 128) {
					return "Password must not exceed 128 characters";
				}
				// Check if confirm password matches when password is valid
				if (
					registerData.confirmPassword &&
					value !== registerData.confirmPassword
				) {
					return "Passwords do not match";
				}
				break;

			case "confirmPassword":
				if (!value) {
					return "Please confirm your password";
				}
				if (registerData.password !== value) {
					return "Passwords do not match";
				}
				break;

			case "avatarUrl":
				if (value && !isValidUrl(value)) {
					return "Please enter a valid URL (e.g., https://example.com/image.jpg)";
				}
				break;

			case "timezone":
				if (value && value.length > 50) {
					return "Timezone must not exceed 50 characters";
				}
				break;

			default:
				break;
		}
		return undefined;
	};

	const validateForm = (): boolean => {
		const newErrors: ValidationErrors = {};
		const fieldsToValidate = [
			"username",
			"firstName",
			"lastName",
			"email",
			"password",
			"confirmPassword",
			"avatarUrl",
			"timezone",
		];

		fieldsToValidate.forEach((field) => {
			const error = validateField(
				field,
				registerData[field as keyof typeof registerData],
			);
			if (error) {
				newErrors[field as keyof ValidationErrors] = error;
			}
		});

		if (
			registerData.password &&
			registerData.confirmPassword &&
			registerData.password !== registerData.confirmPassword
		) {
			newErrors.password = "Passwords do not match";
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (field: string, value: string) => {
		setRegisterData({ ...registerData, [field]: value });

		setTouched((prev) => new Set(prev).add(field));

		const error = validateField(field, value);

		if (field === "password") {
			const newErrors = { ...errors };
			if (error) {
				newErrors.password = error;
			} else {
				delete newErrors.password;
			}

			if (registerData.confirmPassword) {
				const confirmError = validateField(
					"confirmPassword",
					registerData.confirmPassword,
				);
				if (confirmError) {
					newErrors.confirmPassword = confirmError;
				} else {
					delete newErrors.confirmPassword;
				}
			}
			setErrors(newErrors);
		} else if (field === "confirmPassword") {
			const newErrors = { ...errors };
			if (error) {
				newErrors.confirmPassword = error;
			} else {
				delete newErrors.confirmPassword;
			}

			if (registerData.password && value === registerData.password) {
				if (errors.password === "Passwords do not match") {
					delete newErrors.password;
				}
			}
			setErrors(newErrors);
		} else {
			if (error) {
				setErrors((prev) => ({ ...prev, [field]: error }));
			} else {
				setErrors((prev) => {
					const newErrors = { ...prev };
					delete newErrors[field as keyof ValidationErrors];
					return newErrors;
				});
			}
		}
	};

	const isFormValid = (): boolean => {
		const hasErrors = Object.keys(errors).length > 0;
		const requiredFields = [
			"username",
			"firstName",
			"lastName",
			"email",
			"password",
			"confirmPassword",
		];
		const hasAllRequiredFields = requiredFields.every(
			(field) => registerData[field as keyof typeof registerData].trim() !== "",
		);

		return !hasErrors && hasAllRequiredFields;
	};

	const handleRegister = async () => {
		const allFields = [
			"username",
			"firstName",
			"lastName",
			"email",
			"password",
			"confirmPassword",
			"avatarUrl",
			"timezone",
		];
		setTouched(new Set(allFields));
		setSuccessMessage("");

		if (!validateForm()) {
			return;
		}

		const registrationInfo = {
			username: registerData.username,
			displayName: registerData.displayName || registerData.username,
			firstName: registerData.firstName,
			lastName: registerData.lastName,
			email: registerData.email,
			password: registerData.password,
			avatarUrl: registerData.avatarUrl || "",
			timezone: registerData.timezone || "",
		};

		try {
			let mutationPromise;

			if (codeChallenge && codeChallengeMethod) {
				mutationPromise = registerPkceMutation.mutateAsync({
					method: "basic",
					data: registrationInfo,
					codeChallenge: codeChallenge,
					codeChallengeMethod: codeChallengeMethod,
				});
			} else {
				mutationPromise = registerMutation.mutateAsync({
					method: "basic",
					data: registrationInfo,
				});
			}

			const result = await mutationPromise;

			console.log("Registration successful:", result);

			setSuccessMessage(
				"Registration successful! Please check your email for verification.",
			);

			setRegisterData({
				username: "",
				firstName: "",
				lastName: "",
				displayName: "",
				email: "",
				password: "",
				confirmPassword: "",
				avatarUrl: "",
				timezone: "",
			});

			setTouched(new Set());
			setErrors({});

			setTimeout(() => {
				// navigate('/auth/login') or window.location.href = '/auth/login'
			}, 2000);
		} catch (error: any) {
			console.error("Registration failed:", error);

			if (error?.response?.data?.message) {
				const serverMessage = error.response.data.message;

				if (serverMessage.toLowerCase().includes("username")) {
					setErrors({ username: serverMessage });
				} else if (serverMessage.toLowerCase().includes("email")) {
					setErrors({ email: serverMessage });
				} else {
					setErrors({ general: serverMessage });
				}
			} else if (error?.response?.data?.errors) {
				const serverErrors = error.response.data.errors;
				setErrors(serverErrors);
			} else if (error?.message) {
				setErrors({ general: error.message });
			} else {
				setErrors({ general: "Registration failed. Please try again later." });
			}

			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};
	const isLoading =
		registerMutation.isPending || registerPkceMutation.isPending;

	const handleGoogleSuccess = async (credentialResponse: any) => {
		console.log("Google registration success:", credentialResponse);
		if (!credentialResponse.credential) {
			console.error("No credential received from Google");
			setErrors({
				general: "Google registration failed. No credential received.",
			});
			return;
		}

		setErrors({});
		setSuccessMessage("");

		try {
			if (codeChallenge && codeChallengeMethod) {
				localStorage.setItem("codeChallenge", codeChallenge);
				localStorage.setItem("codeChallengeMethod", codeChallengeMethod);

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
		} catch (error) {
			console.error("Error during Google registration mutation:", error);
			setErrors({ general: "Google registration failed. Please try again." });
		}
	};

	const handleGoogleError = () => {
		console.error("Google Registration Failed");
		setErrors({ general: "Google registration failed. Please try again." });
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

					{errors.general && (
						<div
							style={{
								color: "#ef4444",
								fontSize: "14px",
								marginBottom: "16px",
								padding: "8px",
								backgroundColor: "#fef2f2",
								border: "1px solid #fecaca",
								borderRadius: "4px",
								textAlign: "center",
							}}
						>
							{errors.general}
						</div>
					)}

					{successMessage && (
						<div
							style={{
								color: "#10b981",
								fontSize: "14px",
								marginBottom: "16px",
								padding: "8px",
								backgroundColor: "#f0fdf4",
								border: "1px solid #bbf7d0",
								borderRadius: "4px",
								textAlign: "center",
							}}
						>
							{successMessage}
						</div>
					)}

					<FormRow>
						<FormGroup>
							<Label htmlFor="username">Your username</Label>
							<Input
								id="username"
								type="text"
								placeholder="Username"
								value={registerData.username}
								onChange={(e) => handleInputChange("username", e.target.value)}
								onBlur={() =>
									setTouched((prev) => new Set(prev).add("username"))
								}
								required
								disabled={isLoading}
								style={{
									borderColor: hasError("username") ? "#ef4444" : undefined,
									borderWidth: hasError("username") ? "2px" : "1px",
								}}
							/>
							{hasError("username") && (
								<div
									style={{
										color: "#ef4444",
										fontSize: "14px",
										marginTop: "4px",
										fontWeight: "500",
									}}
								>
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
								onChange={(e) =>
									handleInputChange("displayName", e.target.value)
								}
								disabled={isLoading}
							/>
						</FormGroup>
					</FormRow>
					<FormRow>
						<FormGroup>
							<Label htmlFor="firstName">First name</Label>
							<Input
								id="firstName"
								type="text"
								placeholder="Firstname"
								value={registerData.firstName}
								onChange={(e) => handleInputChange("firstName", e.target.value)}
								onBlur={() =>
									setTouched((prev) => new Set(prev).add("firstName"))
								}
								required
								disabled={isLoading}
								style={{
									borderColor: hasError("firstName") ? "#ef4444" : undefined,
									borderWidth: hasError("firstName") ? "2px" : "1px",
								}}
							/>
							{hasError("firstName") && (
								<div
									style={{
										color: "#ef4444",
										fontSize: "14px",
										marginTop: "4px",
										fontWeight: "500",
									}}
								>
									{errors.firstName}
								</div>
							)}
						</FormGroup>

						<FormGroup>
							<Label htmlFor="lastName">Last name</Label>
							<Input
								id="lastName"
								type="text"
								placeholder="Last name"
								value={registerData.lastName}
								onChange={(e) => handleInputChange("lastName", e.target.value)}
								onBlur={() =>
									setTouched((prev) => new Set(prev).add("lastName"))
								}
								required
								disabled={isLoading}
								style={{
									borderColor: hasError("lastName") ? "#ef4444" : undefined,
									borderWidth: hasError("lastName") ? "2px" : "1px",
								}}
							/>
							{hasError("lastName") && (
								<div
									style={{
										color: "#ef4444",
										fontSize: "14px",
										marginTop: "4px",
										fontWeight: "500",
									}}
								>
									{errors.lastName}
								</div>
							)}
						</FormGroup>
					</FormRow>

					<FormGroup>
						<Label htmlFor="email">Your email</Label>
						<Input
							id="email"
							type="email"
							placeholder="Example@email.com"
							value={registerData.email}
							onChange={(e) => handleInputChange("email", e.target.value)}
							onBlur={() => setTouched((prev) => new Set(prev).add("email"))}
							required
							disabled={isLoading}
							style={{
								borderColor: hasError("email") ? "#ef4444" : undefined,
								borderWidth: hasError("email") ? "2px" : "1px",
							}}
						/>
						{hasError("email") && (
							<div
								style={{
									color: "#ef4444",
									fontSize: "14px",
									marginTop: "4px",
									fontWeight: "500",
								}}
							>
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
									onChange={(e) =>
										handleInputChange("password", e.target.value)
									}
									onBlur={() =>
										setTouched((prev) => new Set(prev).add("password"))
									}
									autoComplete="new-password"
									required
									disabled={isLoading}
									style={{
										borderColor: hasError("password") ? "#ef4444" : undefined,
										borderWidth: hasError("password") ? "2px" : "1px",
									}}
								/>
								{registerData.password && !isLoading && (
									<EyeIcon
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										aria-label={
											showPassword ? "Hide password" : "Show password"
										}
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
										color: "#ef4444",
										fontSize: "14px",
										marginTop: "4px",
										fontWeight: "500",
									}}
								>
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
									onChange={(e) =>
										handleInputChange("confirmPassword", e.target.value)
									}
									onBlur={() =>
										setTouched((prev) => new Set(prev).add("confirmPassword"))
									}
									autoComplete="new-password"
									required
									disabled={isLoading}
									style={{
										borderColor: hasError("confirmPassword")
											? "#ef4444"
											: undefined,
										borderWidth: hasError("confirmPassword") ? "2px" : "1px",
									}}
								/>
								{registerData.confirmPassword && !isLoading && (
									<EyeIcon
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										aria-label={
											showConfirmPassword
												? "Hide confirm password"
												: "Show confirm password"
										}
									>
										{showConfirmPassword ? (
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
							{hasError("confirmPassword") && (
								<div
									style={{
										color: "#ef4444",
										fontSize: "14px",
										marginTop: "4px",
										fontWeight: "500",
									}}
								>
									{errors.confirmPassword}
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
									onChange={(e) =>
										handleInputChange("confirmPassword", e.target.value)
									}
									onBlur={() =>
										setTouched((prev) => new Set(prev).add("confirmPassword"))
									}
									autoComplete="new-password"
									required
									disabled={isLoading}
									style={{
										borderColor: hasError("confirmPassword")
											? "#ef4444"
											: undefined,
										borderWidth: hasError("confirmPassword") ? "2px" : "1px",
									}}
								/>
								{registerData.confirmPassword && !isLoading && (
									<EyeIcon
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										aria-label={
											showConfirmPassword
												? "Hide confirm password"
												: "Show confirm password"
										}
									>
										{showConfirmPassword ? (
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
							{hasError("confirmPassword") && (
								<div
									style={{
										color: "#ef4444",
										fontSize: "14px",
										marginTop: "4px",
										fontWeight: "500",
									}}
								>
									{errors.confirmPassword}
								</div>
							)}
						</FormGroup>
					</FormRow>

					<FormGroup>
						<LabelOption htmlFor="avatarUrl">Avatar URL</LabelOption>
						<Input
							id="avatarUrl"
							type="url"
							placeholder="https://example.com/avatar.jpg (Optional)"
							value={registerData.avatarUrl}
							onChange={(e) => handleInputChange("avatarUrl", e.target.value)}
							onBlur={() =>
								setTouched((prev) => new Set(prev).add("avatarUrl"))
							}
							disabled={isLoading}
							style={{
								borderColor: hasError("avatarUrl") ? "#ef4444" : undefined,
								borderWidth: hasError("avatarUrl") ? "2px" : "1px",
							}}
						/>
						{hasError("avatarUrl") && (
							<div
								style={{
									color: "#ef4444",
									fontSize: "14px",
									marginTop: "4px",
									fontWeight: "500",
								}}
							>
								{errors.avatarUrl}
							</div>
						)}
					</FormGroup>

					<FormGroup>
						<LabelOption htmlFor="timezone">Time Zone</LabelOption>
						<SelectWrapper>
							<Select
								id="timezone"
								value={registerData.timezone}
								onChange={(e) => handleInputChange("timezone", e.target.value)}
								onBlur={() =>
									setTouched((prev) => new Set(prev).add("timezone"))
								}
								disabled={isLoading}
								isLoading={isLoading}
							>
								{timezones.map((tz) => (
									<option key={tz.value} value={tz.value}>
										{tz.label}
									</option>
								))}
							</Select>
						</SelectWrapper>
						{hasError("timezone") && (
							<div
								style={{
									color: "#ef4444",
									fontSize: "14px",
									marginTop: "4px",
									fontWeight: "500",
								}}
							>
								{errors.timezone}
							</div>
						)}
					</FormGroup>

					<RegisterButton
						onClick={handleRegister}
						disabled={isLoading || !isFormValid()}
						style={{
							opacity: isLoading || !isFormValid() ? 0.6 : 1,
							cursor: isLoading || !isFormValid() ? "not-allowed" : "pointer",
						}}
					>
						{isLoading ? "Registering..." : "Register Account"}
					</RegisterButton>

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
										text="signup_with"
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
									onClick={handleGitHubRegister}
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
									<span>Sign up with GitHub</span>
								</GitHubButton>
							</SocialButtonWrapper>
						</SocialButtonsRow>
					</SocialButtonsContainer>

					<SignInText>
						Already have an account?{" "}
						<SignInLink as={Link} to="/auth/login">
							Sign in
						</SignInLink>
					</SignInText>
				</RegisterCard>
			</ContentContainer>
		</RegisterContainer>
	);
};

export default RegisterPage;
