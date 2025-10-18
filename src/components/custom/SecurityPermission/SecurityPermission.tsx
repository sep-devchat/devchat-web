import { useState } from "react";
import { Trash2, Plus, Lock, Laptop } from "lucide-react";
import {
	AddButton,
	CancelButton,
	ConfirmButton,
	Container,
	DeleteButton,
	DeleteConfirmButton,
	InputField,
	IPInputContainer,
	IPInputField,
	IPInputWrapper,
	IPItem,
	IPList,
	Modal,
	ModalButtons,
	ModalMessage,
	ModalOverlay,
	ModalTitle,
	SaveButton,
	Section,
	SectionFooter,
	SectionTitle,
	SettingDescription,
	SettingItem,
	SettingLabel,
	SettingTitle,
	ToggleContainer,
	ToggleSwitch,
	WhitelistDescription,
	WhitelistLabel,
	ErrorMessage,
} from "./SecurityPermission.styled";

export default function SecurityPermission() {
	const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
	const [sessionTimeout, setSessionTimeout] = useState(30);
	const [failedAttempts, setFailedAttempts] = useState(5);
	const [dangerousActionEnabled, setDangerousActionEnabled] = useState(true);
	const [ipList, setIpList] = useState(["192.168.1.0/24", "10.0.0.0/8"]);
	const [newIP, setNewIP] = useState("");
	const [ipError, setIpError] = useState("");
	const [deleteModal, setDeleteModal] = useState(false);
	const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
	const [saveModal, setSaveModal] = useState(false);

	const [initialTwoFactor] = useState(true);
	const [initialSessionTimeout] = useState(30);
	const [initialFailedAttempts] = useState(5);
	const [initialDangerousAction] = useState(true);

	const hasChanges =
		twoFactorEnabled !== initialTwoFactor ||
		sessionTimeout !== initialSessionTimeout ||
		failedAttempts !== initialFailedAttempts ||
		dangerousActionEnabled !== initialDangerousAction;

	const handleAddIP = () => {
		if (!newIP.trim()) {
			setIpError("Please enter an IP address");
			return;
		}
		setIpList([...ipList, newIP]);
		setNewIP("");
		setIpError("");
	};

	const handleDeleteIP = (index: number) => {
		setDeleteIndex(index);
		setDeleteModal(true);
	};

	const handleConfirmDelete = () => {
		if (deleteIndex !== null) {
			setIpList(ipList.filter((_, i) => i !== deleteIndex));
			setDeleteModal(false);
			setDeleteIndex(null);
		}
	};

	const handleSaveChanges = () => {
		setSaveModal(true);
	};

	const handleConfirmSave = () => {
		setSaveModal(false);
	};

	const handleIPInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewIP(e.target.value);
		if (e.target.value.trim()) {
			setIpError("");
		}
	};

	return (
		<Container>
			<Section>
				<SectionTitle>
					<Lock
						size={24}
						color="#1976d2"
						style={{
							background: "#e3f2fd",
							padding: "5px",
							borderRadius: "4px",
						}}
					/>
					Access Permissions
				</SectionTitle>

				<SettingItem>
					<SettingLabel>
						<SettingTitle>Two-Factor Authentication (2FA)</SettingTitle>
						<SettingDescription>
							Admin must enable 2FA to login securely
						</SettingDescription>
					</SettingLabel>
					<ToggleContainer>
						<ToggleSwitch
							type="checkbox"
							checked={twoFactorEnabled}
							onChange={(e) => setTwoFactorEnabled(e.target.checked)}
						/>
					</ToggleContainer>
				</SettingItem>

				<SettingItem>
					<SettingLabel>
						<SettingTitle>Session Timeout (minutes)</SettingTitle>
						<SettingDescription>
							Auto-logout after inactivity timeout
						</SettingDescription>
					</SettingLabel>
					<InputField
						type="number"
						value={sessionTimeout}
						onChange={(e) => setSessionTimeout(parseInt(e.target.value) || 0)}
						min="1"
					/>
				</SettingItem>

				<SettingItem>
					<SettingLabel>
						<SettingTitle>Failed Login Attempts</SettingTitle>
						<SettingDescription>
							Lock account after a number of failed login attempts
						</SettingDescription>
					</SettingLabel>
					<InputField
						type="number"
						value={failedAttempts}
						onChange={(e) => setFailedAttempts(parseInt(e.target.value) || 0)}
						min="1"
					/>
				</SettingItem>

				<SettingItem>
					<SettingLabel>
						<SettingTitle>Dangerous Action Prompt</SettingTitle>
						<SettingDescription>
							Minimum of 8 characters, including uppercase letters, numbers, and
							special characters
						</SettingDescription>
					</SettingLabel>
					<ToggleContainer>
						<ToggleSwitch
							type="checkbox"
							checked={dangerousActionEnabled}
							onChange={(e) => setDangerousActionEnabled(e.target.checked)}
						/>
					</ToggleContainer>
				</SettingItem>

				<SectionFooter>
					<SaveButton onClick={handleSaveChanges} disabled={!hasChanges}>
						Save Changes
					</SaveButton>
				</SectionFooter>
			</Section>

			<Section>
				<SectionTitle>
					<Laptop
						size={24}
						color="#1976d2"
						style={{
							background: "#e3f2fd",
							padding: "5px",
							borderRadius: "4px",
						}}
					/>
					IP Whitelist
				</SectionTitle>
				<WhitelistLabel>IP Address Whitelist</WhitelistLabel>
				<WhitelistDescription>
					Only admin from these IPs can access CIDR format
				</WhitelistDescription>

				<IPInputContainer>
					<IPInputWrapper>
						<IPInputField
							type="text"
							placeholder="Enter IP or CIDR (vd: 192.168.1.0/24)"
							value={newIP}
							onChange={handleIPInputChange}
							isError={!!ipError}
						/>
						<AddButton onClick={handleAddIP}>
							<Plus size={18} />
							Add
						</AddButton>
					</IPInputWrapper>
					{ipError && <ErrorMessage>{ipError}</ErrorMessage>}
				</IPInputContainer>

				<IPList>
					{ipList.map((ip, index) => (
						<IPItem key={index}>
							{ip}
							<DeleteButton onClick={() => handleDeleteIP(index)}>
								<Trash2 size={18} />
							</DeleteButton>
						</IPItem>
					))}
				</IPList>
			</Section>

			{deleteModal && (
				<ModalOverlay onClick={() => setDeleteModal(false)}>
					<Modal onClick={(e) => e.stopPropagation()}>
						<ModalTitle>Delete IP Address</ModalTitle>
						<ModalMessage>
							Are you sure you want to delete this IP address? This action
							cannot be undone.
						</ModalMessage>
						<ModalButtons>
							<CancelButton onClick={() => setDeleteModal(false)}>
								Cancel
							</CancelButton>
							<DeleteConfirmButton onClick={handleConfirmDelete}>
								Delete
							</DeleteConfirmButton>
						</ModalButtons>
					</Modal>
				</ModalOverlay>
			)}

			{saveModal && (
				<ModalOverlay onClick={() => setSaveModal(false)}>
					<Modal onClick={(e) => e.stopPropagation()}>
						<ModalTitle>Save Changes</ModalTitle>
						<ModalMessage>
							Are you sure you want to save these changes?
						</ModalMessage>
						<ModalButtons>
							<CancelButton onClick={() => setSaveModal(false)}>
								Cancel
							</CancelButton>
							<ConfirmButton onClick={handleConfirmSave}>OK</ConfirmButton>
						</ModalButtons>
					</Modal>
				</ModalOverlay>
			)}
		</Container>
	);
}
