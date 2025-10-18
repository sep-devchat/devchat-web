import { useState } from "react";
import { Edit2, Trash2, Code2 } from "lucide-react";
import * as S from "./CodePermission.styled";

interface CodeEnvironment {
	id: string;
	language: string;
	status: "Active" | "Inactive";
	enabled: boolean;
	timeout: number;
	memoryLimit: string;
}

interface AddEnvironmentFormData {
	language: string;
	timeout: number;
	memoryLimit: string;
	enabled: boolean;
}

const MOCK_CODE_DATA: CodeEnvironment[] = [
	{
		id: "1",
		language: "JavaScript",
		status: "Active",
		enabled: true,
		timeout: 30,
		memoryLimit: "512 MB",
	},
	{
		id: "2",
		language: "Python",
		status: "Active",
		enabled: true,
		timeout: 45,
		memoryLimit: "1 GB",
	},
	{
		id: "3",
		language: "TypeScript",
		status: "Active",
		enabled: true,
		timeout: 30,
		memoryLimit: "512 MB",
	},
	{
		id: "4",
		language: "Java",
		status: "Inactive",
		enabled: false,
		timeout: 60,
		memoryLimit: "2 GB",
	},
];

export const CodePermission = () => {
	const [environments, setEnvironments] =
		useState<CodeEnvironment[]>(MOCK_CODE_DATA);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formData, setFormData] = useState<AddEnvironmentFormData>({
		language: "",
		timeout: 30,
		memoryLimit: "512 MB",
		enabled: true,
	});

	const handleAddEnvironment = () => {
		setFormData({
			language: "",
			timeout: 30,
			memoryLimit: "512 MB",
			enabled: true,
		});
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleSubmit = () => {
		if (formData.language.trim()) {
			const newEnvironment: CodeEnvironment = {
				id: (environments.length + 1).toString(),
				language: formData.language,
				status: formData.enabled ? "Active" : "Inactive",
				enabled: formData.enabled,
				timeout: formData.timeout,
				memoryLimit: formData.memoryLimit,
			};
			setEnvironments([...environments, newEnvironment]);
			setIsModalOpen(false);
		}
	};

	const handleToggleStatus = (id: string) => {
		setEnvironments(
			environments.map((env) =>
				env.id === id
					? {
							...env,
							enabled: !env.enabled,
							status: env.enabled ? "Inactive" : "Active",
						}
					: env,
			),
		);
	};

	const handleEdit = (id: string) => {
		console.log(`Edit environment ${id}`);
	};

	const handleDelete = (id: string) => {
		setEnvironments(environments.filter((env) => env.id !== id));
	};

	return (
		<S.Container>
			<S.Content>
				{/* Header */}
				<S.Header>
					<div>
						<S.Title>Code Execution Permissions</S.Title>
						<S.Subtitle>
							Configure programming languages allowed to run and resource limits
						</S.Subtitle>
					</div>
					<S.AddButton onClick={handleAddEnvironment}>
						<span style={{ fontSize: "18px", lineHeight: "1" }}>+</span> Add
						Language
					</S.AddButton>
				</S.Header>

				<S.EnvironmentList>
					{environments.map((env) => (
						<S.Card key={env.id}>
							<S.CardHeader>
								<S.CardHeaderLeft>
									<S.IconContainer>
										<Code2 size={20} />
									</S.IconContainer>
									<div>
										<S.LanguageName>{env.language}</S.LanguageName>
										<S.StatusText>{env.status}</S.StatusText>
									</div>
								</S.CardHeaderLeft>

								<S.Actions>
									<S.ToggleLabel>
										<S.ToggleInput
											type="checkbox"
											checked={env.enabled}
											onChange={() => handleToggleStatus(env.id)}
											$enabled={env.enabled}
										/>
										<S.ToggleSlider $enabled={env.enabled} />
									</S.ToggleLabel>

									<S.ActionButton onClick={() => handleEdit(env.id)}>
										<Edit2 size={18} />
									</S.ActionButton>

									<S.DeleteButton onClick={() => handleDelete(env.id)}>
										<Trash2 size={18} />
									</S.DeleteButton>
								</S.Actions>
							</S.CardHeader>

							<S.CardDetails>
								<div>
									<S.DetailLabel>TIMEOUT (SECONDS)</S.DetailLabel>
									<S.DetailValue>{env.timeout}</S.DetailValue>
								</div>
								<div>
									<S.DetailLabel>MEMORY LIMIT</S.DetailLabel>
									<S.DetailValue>{env.memoryLimit}</S.DetailValue>
								</div>
								<div>
									<S.DetailLabel>STATUS</S.DetailLabel>
									<S.DetailStatus $enabled={env.enabled}>
										✓ {env.enabled ? "Active" : "Inactive"}
									</S.DetailStatus>
								</div>
							</S.CardDetails>
						</S.Card>
					))}
				</S.EnvironmentList>
			</S.Content>

			{isModalOpen && (
				<S.ModalOverlay onClick={handleCloseModal}>
					<S.Modal onClick={(e: any) => e.stopPropagation()}>
						<S.ModalHeader>
							<S.ModalTitle>Add Programming Language</S.ModalTitle>
							<S.CloseButton onClick={handleCloseModal}>✕</S.CloseButton>
						</S.ModalHeader>

						<S.ModalContent>
							<S.FormGroup>
								<S.Label>
									Language Name <S.Required>*</S.Required>
								</S.Label>
								<S.Input
									type="text"
									placeholder="Example: Rust, Ruby, PHP..."
									value={formData.language}
									onChange={(e) =>
										setFormData({ ...formData, language: e.target.value })
									}
								/>
							</S.FormGroup>

							<S.FormRow>
								<S.FormGroup>
									<S.Label>
										Timeout (seconds) <S.Required>*</S.Required>
									</S.Label>
									<S.Input
										type="number"
										value={formData.timeout}
										onChange={(e) =>
											setFormData({
												...formData,
												timeout: parseInt(e.target.value) || 0,
											})
										}
									/>
								</S.FormGroup>

								<S.FormGroup>
									<S.Label>
										Memory Limit <S.Required>*</S.Required>
									</S.Label>
									<S.Input
										type="text"
										value={formData.memoryLimit}
										onChange={(e) =>
											setFormData({ ...formData, memoryLimit: e.target.value })
										}
									/>
								</S.FormGroup>
							</S.FormRow>

							<S.CheckboxLabel>
								<S.ToggleLabel>
									<S.ToggleInput
										type="checkbox"
										checked={formData.enabled}
										onChange={(e) =>
											setFormData({
												...formData,
												enabled: e.target.checked,
											})
										}
										$enabled={formData.enabled}
									/>
									<S.ToggleSlider $enabled={formData.enabled} />
								</S.ToggleLabel>
								<span>Activate now</span>
							</S.CheckboxLabel>
						</S.ModalContent>

						<S.ModalFooter>
							<S.CancelButton onClick={handleCloseModal}>Cancel</S.CancelButton>
							<S.SubmitButton onClick={handleSubmit}>
								Add Language
							</S.SubmitButton>
						</S.ModalFooter>
					</S.Modal>
				</S.ModalOverlay>
			)}
		</S.Container>
	);
};

export default CodePermission;
