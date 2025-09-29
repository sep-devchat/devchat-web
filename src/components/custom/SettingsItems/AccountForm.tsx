import { Mail } from "lucide-react";
import React, { useState } from "react";
import {
	AddEmailButton,
	Avatar,
	EditButton,
	EmailAddress,
	EmailDetails,
	EmailIcon,
	EmailItem,
	EmailSection,
	EmailSectionTitle,
	EmailTime,
	FormContainer,
	FormContent,
	FormGroup,
	FormRow,
	Input,
	Label,
	ProfileDetails,
	ProfileEmail,
	ProfileHeader,
	ProfileInfo,
	ProfileName,
	SelectAccount,
} from "./SettingsItems.styled";

interface AccountFormProps {
	initialData?: {
		fullName?: string;
		displayName?: string;
		phoneNumber?: string;
		gender?: string;
		country?: string;
		usageType?: string;
		email?: string;
	};
	onSave?: (data: any) => void;
}

const AccountForm: React.FC<AccountFormProps> = ({
	initialData = {},
	onSave,
}) => {
	const [formData, setFormData] = useState({
		fullName: initialData.fullName || "Amanda Nguyen",
		displayName: initialData.displayName || "Amanda",
		phoneNumber: initialData.phoneNumber || "0865181875",
		gender: initialData.gender || "Female",
		country: initialData.country || "Viet Nam",
		usageType: initialData.usageType || "Personal",
		email: initialData.email || "abc123@gmail.com",
	});

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSave = () => {
		if (onSave) {
			onSave(formData);
		}
	};

	return (
		<FormContainer>
			<ProfileHeader>
				<ProfileInfo>
					<Avatar>{formData.displayName.charAt(0).toUpperCase()}</Avatar>
					<ProfileDetails>
						<ProfileName>{formData.fullName}</ProfileName>
						<ProfileEmail>{formData.email}</ProfileEmail>
					</ProfileDetails>
				</ProfileInfo>
				<EditButton onClick={handleSave}>EDIT</EditButton>
			</ProfileHeader>

			<FormContent>
				<FormRow>
					<FormGroup>
						<Label>Full Name</Label>
						<Input
							type="text"
							value={formData.fullName}
							onChange={(e: any) =>
								handleInputChange("fullName", e.target.value)
							}
							placeholder="Enter full name"
						/>
					</FormGroup>

					<FormGroup>
						<Label>Display Name</Label>
						<Input
							type="text"
							value={formData.displayName}
							onChange={(e: any) =>
								handleInputChange("displayName", e.target.value)
							}
							placeholder="Enter display name"
						/>
					</FormGroup>
				</FormRow>

				<FormRow>
					<FormGroup>
						<Label>Phone Number</Label>
						<Input
							type="tel"
							value={formData.phoneNumber}
							onChange={(e: any) =>
								handleInputChange("phoneNumber", e.target.value)
							}
							placeholder="Enter phone number"
						/>
					</FormGroup>

					<FormGroup>
						<Label>Gender</Label>
						<SelectAccount
							value={formData.gender}
							onChange={(e: any) => handleInputChange("gender", e.target.value)}
						>
							<option value="Female">Female</option>
							<option value="Male">Male</option>
							<option value="Other">Other</option>
							<option value="Prefer not to say">Prefer not to say</option>
						</SelectAccount>
					</FormGroup>
				</FormRow>

				<FormRow>
					<FormGroup>
						<Label>Country</Label>
						<SelectAccount
							value={formData.country}
							onChange={(e: any) =>
								handleInputChange("country", e.target.value)
							}
						>
							<option value="Viet Nam">Viet Nam</option>
							<option value="United States">United States</option>
							<option value="United Kingdom">United Kingdom</option>
							<option value="Japan">Japan</option>
							<option value="South Korea">South Korea</option>
							<option value="Singapore">Singapore</option>
							<option value="Thailand">Thailand</option>
							<option value="Malaysia">Malaysia</option>
						</SelectAccount>
					</FormGroup>

					<FormGroup>
						<Label>Usage Type</Label>
						<SelectAccount
							value={formData.usageType}
							onChange={(e: any) =>
								handleInputChange("usageType", e.target.value)
							}
						>
							<option value="Personal">Personal</option>
							<option value="Business">Business</option>
							<option value="Education">Education</option>
							<option value="Non-profit">Non-profit</option>
						</SelectAccount>
					</FormGroup>
				</FormRow>

				<EmailSection>
					<EmailSectionTitle>My email Address</EmailSectionTitle>
					<EmailItem>
						<EmailIcon>
							<Mail size={24} />
						</EmailIcon>
						<EmailDetails>
							<EmailAddress>{formData.email}</EmailAddress>
							<EmailTime>1 month ago</EmailTime>
						</EmailDetails>
					</EmailItem>
					<AddEmailButton>Add email address</AddEmailButton>
				</EmailSection>
			</FormContent>
		</FormContainer>
	);
};

export default AccountForm;
