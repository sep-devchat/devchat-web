import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { UseMutationResult } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import publicRuntimeConfig from "@/config/publicRuntime";
import registerBgImage from "@/assets/image/registerBackground.png";
import testImage from "@/assets/image/test.jpg";
import githubIcon from "@/assets/image/github-icon.png";
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
	AvatarUploadContainer,
	AvatarUploadBox,
	AvatarPreviewWrapper,
	AvatarImage,
	RemoveAvatarButton,
	LoadingOverlay,
	LoadingSpinner,
	DefaultAvatarCircle,
	AvatarUploadInfo,
	ProgressTitle,
	ProgressBar,
	ProgressContainer,
	ProgressFill,
	ProgressText,
	HiddenFileInput,
	UploadTitle,
	UploadSubtitle,
	UploadButton,
} from "./Register.styled";
import {
	getUploadSignature,
	directUploadWithSignature,
	saveDirectUpload,
} from "@/services/upload/upload.api";

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
	avatar?: string;
	timezone?: string;
	general?: string;
}

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
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string>("");
	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const [isUploading, setIsUploading] = useState(false);

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

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const allowedTypes = [
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/gif",
			"image/webp",
		];
		if (!allowedTypes.includes(file.type)) {
			setErrors((prev) => ({
				...prev,
				avatar: "Please upload a valid image file (JPEG, PNG, GIF, or WebP)",
			}));
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			setErrors((prev) => ({
				...prev,
				avatar: "File size must not exceed 5MB",
			}));
			return;
		}

		setAvatarFile(file);
		setErrors((prev) => {
			const newErrors = { ...prev };
			delete newErrors.avatar;
			return newErrors;
		});

		const reader = new FileReader();
		reader.onloadend = () => {
			setAvatarPreview(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleRemoveAvatar = () => {
		setAvatarFile(null);
		setAvatarPreview("");
		setUploadProgress(0);
		setRegisterData((prev) => ({ ...prev, avatarUrl: "" }));
	};

	const uploadAvatar = async (): Promise<string> => {
		if (!avatarFile) return "";

		try {
			setIsUploading(true);
			setUploadProgress(0);

			const signature = await getUploadSignature({
				folder: "avatars",
			});

			const result = await directUploadWithSignature({
				file: avatarFile,
				signature,
				onProgress: (data) => {
					setUploadProgress(data.progress);
				},
				generateDelivery: {
					publicId: "",
					transformations: [
						{
							width: 200,
							height: 200,
							crop: "fill",
							gravity: "face",
						},
					],
				},
			});

			await saveDirectUpload(result.upload);

			setIsUploading(false);
			return result.delivery?.url || result.upload.secure_url;
		} catch (error) {
			console.error("Avatar upload failed:", error);
			setIsUploading(false);
			throw new Error("Failed to upload avatar");
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
			"timezone",
		];
		setTouched(new Set(allFields));
		setSuccessMessage("");

		if (!validateForm()) {
			return;
		}

		try {
			let avatarUrl = "";
			if (avatarFile) {
				try {
					avatarUrl = await uploadAvatar();
				} catch (uploadError) {
					console.error("Avatar upload failed:", uploadError);
					setErrors({
						general:
							"Failed to upload avatar. Please try again or register without avatar.",
					});
					setIsUploading(false);
					return;
				}
			}

			const registrationData: any = {
				username: registerData.username,
				firstName: registerData.firstName,
				lastName: registerData.lastName,
				email: registerData.email,
				password: registerData.password,
				timezone: registerData.timezone || "Asia/Ho_Chi_Minh",
			};

			if (avatarUrl) {
				registrationData.avatarUrl = avatarUrl;
			}

			let mutationPromise;

			if (codeChallenge && codeChallengeMethod) {
				mutationPromise = registerPkceMutation.mutateAsync({
					method: "basic",
					data: registrationData,
					codeChallenge: codeChallenge,
					codeChallengeMethod: codeChallengeMethod,
				});
			} else {
				mutationPromise = registerMutation.mutateAsync({ ...registrationData });
			}

			const result = await mutationPromise;

			setSuccessMessage(
				result.data?.message ||
					"Registration successful! Please check your email for verification.",
			);

			setRegisterData({
				username: "",
				firstName: "",
				lastName: "",
				email: "",
				password: "",
				confirmPassword: "",
				avatarUrl: "",
				timezone: "",
			});

			setAvatarFile(null);
			setAvatarPreview("");
			setUploadProgress(0);
			setTouched(new Set());
			setErrors({});

			setTimeout(() => {
				// navigate('/auth/login')
			}, 2000);
		} catch (error: any) {
			console.error("Registration failed:", error);

			if (error?.message === "Network Error" || error?.code === "ERR_NETWORK") {
				setErrors({
					general:
						"Network error. Please check your internet connection and try again.",
				});
				window.scrollTo({ top: 0, behavior: "smooth" });
				return;
			}

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
		registerMutation.isPending || registerPkceMutation.isPending || isUploading;
	console.log("RegisterPage render, isLoading:", isLoading);

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
					</FormRow>

					<FormGroup>
						<LabelOption htmlFor="avatar">
							Profile Picture (Optional)
						</LabelOption>
						<AvatarUploadContainer>
							<AvatarUploadBox>
								<AvatarPreviewWrapper>
									{avatarPreview ? (
										<>
											<AvatarImage src={avatarPreview} alt="Avatar preview" />
											{!isUploading && (
												<RemoveAvatarButton
													type="button"
													onClick={handleRemoveAvatar}
													disabled={isLoading}
													title="Remove avatar"
												>
													×
												</RemoveAvatarButton>
											)}
											{isUploading && (
												<LoadingOverlay>
													<LoadingSpinner
														width="32"
														height="32"
														viewBox="0 0 24 24"
														fill="none"
														stroke="white"
														strokeWidth="2"
													>
														<circle
															cx="12"
															cy="12"
															r="10"
															strokeOpacity="0.25"
														/>
														<path
															d="M12 2a10 10 0 0 1 10 10"
															strokeLinecap="round"
														/>
													</LoadingSpinner>
												</LoadingOverlay>
											)}
										</>
									) : (
										<DefaultAvatarCircle>
											<svg
												width="48"
												height="48"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#9ca3af"
												strokeWidth="2"
											>
												<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
												<circle cx="12" cy="7" r="4" />
											</svg>
										</DefaultAvatarCircle>
									)}
								</AvatarPreviewWrapper>

								<AvatarUploadInfo>
									{isUploading ? (
										<ProgressContainer>
											<ProgressTitle>Uploading your photo...</ProgressTitle>
											<ProgressBar>
												<ProgressFill progress={uploadProgress} />
											</ProgressBar>
											<ProgressText>{uploadProgress}% completed</ProgressText>
										</ProgressContainer>
									) : (
										<>
											<UploadTitle>
												{avatarFile
													? avatarFile.name
													: "Upload a profile picture"}
											</UploadTitle>
											<UploadSubtitle>
												JPG, PNG, GIF or WebP. Max 5MB.
											</UploadSubtitle>
											<UploadButton htmlFor="avatar" disabled={isLoading}>
												<svg
													width="18"
													height="18"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
												>
													<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
													<polyline points="17 8 12 3 7 8" />
													<line x1="12" y1="3" x2="12" y2="15" />
												</svg>
												{avatarFile ? "Change Photo" : "Choose Photo"}
											</UploadButton>
										</>
									)}
								</AvatarUploadInfo>
							</AvatarUploadBox>

							<HiddenFileInput
								id="avatar"
								type="file"
								accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
								onChange={handleAvatarChange}
								disabled={isLoading}
							/>

							{errors.avatar && (
								<div
									style={{
										color: "#ef4444",
										fontSize: "14px",
										marginTop: "8px",
										fontWeight: "500",
										display: "flex",
										alignItems: "center",
										gap: "6px",
									}}
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<circle cx="12" cy="12" r="10" opacity="0.2" />
										<path
											d="M12 8v4m0 4h.01"
											strokeWidth="2"
											stroke="currentColor"
											fill="none"
										/>
									</svg>
									{errors.avatar}
								</div>
							)}
						</AvatarUploadContainer>
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
