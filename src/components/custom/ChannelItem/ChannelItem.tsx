import React, { useState, useRef, useEffect } from "react";
import { Hash, MoreVertical, Edit, Trash2, Info, X } from "lucide-react";
import {
	ChannelItemContainer,
	ChannelIconWrapper,
	ChannelNameText,
	MoreButton,
	DropdownMenu,
	DropdownItem,
	ChannelModalOverlay,
	ChannelModalContent,
	ChannelModalHeader,
	ChannelModalTitle,
	ChannelModalBody,
	ChannelModalFooter,
	InfoRow,
	InfoLabel,
	InfoValue,
	EditInput,
	EditTextarea,
	ModalButton,
	DeleteConfirmText,
	DeleteWarning,
	DeleteWarningText,
} from "./ChannelItem.styled";
import {
	ChannelResponse,
	detailChannel,
	updateChannel,
	deleteChannel,
	ChannelPutRequest,
} from "@/services/channelAPI";
import { CloseButton } from "@/layouts/MainLayout/LeftSidebar/LeftSidebar.styled";

interface ChannelItemProps {
	channel: ChannelResponse;
	groupId: string;
	isActive: boolean;
	onClick: () => void;
	onChannelUpdated: () => void;
	onChannelDeleted: () => void;
}

type ModalType = "info" | "edit" | "delete" | null;

export const ChannelItem: React.FC<ChannelItemProps> = ({
	channel,
	groupId,
	isActive,
	onClick,
	onChannelUpdated,
	onChannelDeleted,
}) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const [modalType, setModalType] = useState<ModalType>(null);
	const [channelDetail, setChannelDetail] = useState<ChannelResponse | null>(
		null,
	);
	const [editName, setEditName] = useState("");
	const [editDescription, setEditDescription] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setShowDropdown(false);
			}
		};

		if (showDropdown) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showDropdown]);

	const handleMoreClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setShowDropdown(!showDropdown);
	};

	const fetchChannelDetail = async () => {
		try {
			setIsLoading(true);
			const res = await detailChannel(groupId, channel.id);
			const detail = res?.data || res;
			setChannelDetail(detail);
			setEditName(detail.name || "");
			setEditDescription(detail.description || "");
		} catch (err) {
			console.error("Failed to fetch channel detail:", err);
			alert("Failed to load channel details.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleShowInfo = async () => {
		setShowDropdown(false);
		await fetchChannelDetail();
		setModalType("info");
	};

	const handleShowEdit = async () => {
		setShowDropdown(false);
		await fetchChannelDetail();
		setModalType("edit");
	};

	const handleShowDelete = () => {
		setShowDropdown(false);
		setModalType("delete");
	};

	const handleCloseModal = () => {
		setModalType(null);
		setChannelDetail(null);
		setEditName("");
		setEditDescription("");
	};

	const handleUpdateChannel = async () => {
		if (!editName.trim()) {
			alert("Channel name is required");
			return;
		}

		try {
			setIsLoading(true);
			const payload: ChannelPutRequest = {
				name: editName.trim(),
				description: editDescription.trim() || null,
			};

			await updateChannel(groupId, channel.id, payload);
			onChannelUpdated();
			handleCloseModal();
		} catch (err) {
			console.error("Failed to update channel:", err);
			alert("Failed to update channel. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteChannel = async () => {
		try {
			setIsLoading(true);
			await deleteChannel(groupId, channel.id);
			onChannelDeleted();
			handleCloseModal();
		} catch (err) {
			console.error("Failed to delete channel:", err);
			alert("Failed to delete channel. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const formatDate = (date: Date | string) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<>
			<ChannelItemContainer onClick={onClick}>
				<ChannelIconWrapper>
					<Hash className="h-4 w-4" />
				</ChannelIconWrapper>
				<ChannelNameText
					className={isActive ? "active" : ""}
					title={channel.name}
				>
					{channel.name}
				</ChannelNameText>
				<div style={{ position: "relative" }} ref={dropdownRef}>
					<MoreButton
						onClick={handleMoreClick}
						className={showDropdown ? "active" : ""}
					>
						<MoreVertical size={16} />
					</MoreButton>
					{showDropdown && (
						<DropdownMenu>
							<DropdownItem onClick={handleShowInfo}>
								<Info size={16} />
								Channel Info
							</DropdownItem>
							<DropdownItem onClick={handleShowEdit}>
								<Edit size={16} />
								Edit Channel
							</DropdownItem>
							<DropdownItem onClick={handleShowDelete} className="danger">
								<Trash2 size={16} />
								Delete Channel
							</DropdownItem>
						</DropdownMenu>
					)}
				</div>
			</ChannelItemContainer>

			{modalType === "info" && channelDetail && (
				<ChannelModalOverlay onClick={handleCloseModal}>
					<ChannelModalContent onClick={(e) => e.stopPropagation()}>
						<ChannelModalHeader>
							<ChannelModalTitle>Channel Information</ChannelModalTitle>
							<CloseButton onClick={handleCloseModal}>
								<X size={20} />
							</CloseButton>
						</ChannelModalHeader>
						<ChannelModalBody>
							<InfoRow>
								<InfoLabel>Channel Name</InfoLabel>
								<InfoValue>{channelDetail.name}</InfoValue>
							</InfoRow>
							<InfoRow>
								<InfoLabel>Description</InfoLabel>
								<InfoValue>
									{channelDetail.description || "No description"}
								</InfoValue>
							</InfoRow>
							<InfoRow>
								<InfoLabel>Created At</InfoLabel>
								<InfoValue>{formatDate(channelDetail.createdAt)}</InfoValue>
							</InfoRow>
							<InfoRow>
								<InfoLabel>Created By</InfoLabel>
								<InfoValue>{channelDetail.createdBy}</InfoValue>
							</InfoRow>
						</ChannelModalBody>
						<ChannelModalFooter>
							<ModalButton variant="secondary" onClick={handleCloseModal}>
								Close
							</ModalButton>
						</ChannelModalFooter>
					</ChannelModalContent>
				</ChannelModalOverlay>
			)}

			{modalType === "edit" && channelDetail && (
				<ChannelModalOverlay onClick={handleCloseModal}>
					<ChannelModalContent onClick={(e) => e.stopPropagation()}>
						<ChannelModalHeader>
							<ChannelModalTitle>Edit Channel</ChannelModalTitle>
							<CloseButton onClick={handleCloseModal}>
								<X size={20} />
							</CloseButton>
						</ChannelModalHeader>
						<ChannelModalBody>
							<InfoRow>
								<InfoLabel>Channel Name</InfoLabel>
								<EditInput
									type="text"
									value={editName}
									onChange={(e) => setEditName(e.target.value)}
									placeholder="Enter channel name"
									disabled={isLoading}
								/>
							</InfoRow>
							<InfoRow>
								<InfoLabel>Description</InfoLabel>
								<EditTextarea
									value={editDescription}
									onChange={(e) => setEditDescription(e.target.value)}
									placeholder="Enter channel description (optional)"
									disabled={isLoading}
								/>
							</InfoRow>
						</ChannelModalBody>
						<ChannelModalFooter>
							<ModalButton
								variant="secondary"
								onClick={handleCloseModal}
								disabled={isLoading}
							>
								Cancel
							</ModalButton>
							<ModalButton
								variant="primary"
								onClick={handleUpdateChannel}
								disabled={!editName.trim() || isLoading}
							>
								{isLoading ? "Saving..." : "Save Changes"}
							</ModalButton>
						</ChannelModalFooter>
					</ChannelModalContent>
				</ChannelModalOverlay>
			)}

			{modalType === "delete" && (
				<ChannelModalOverlay onClick={handleCloseModal}>
					<ChannelModalContent onClick={(e) => e.stopPropagation()}>
						<ChannelModalHeader>
							<ChannelModalTitle>Delete Channel</ChannelModalTitle>
							<CloseButton onClick={handleCloseModal}>
								<X size={20} />
							</CloseButton>
						</ChannelModalHeader>
						<ChannelModalBody>
							<DeleteWarning>
								<DeleteWarningText>
									This action cannot be undone. All messages in this channel
									will be permanently deleted.
								</DeleteWarningText>
							</DeleteWarning>
							<DeleteConfirmText>
								Are you sure you want to delete <strong>#{channel.name}</strong>
								? This will permanently remove the channel and all its messages.
							</DeleteConfirmText>
						</ChannelModalBody>
						<ChannelModalFooter>
							<ModalButton
								variant="secondary"
								onClick={handleCloseModal}
								disabled={isLoading}
							>
								Cancel
							</ModalButton>
							<ModalButton
								variant="danger"
								onClick={handleDeleteChannel}
								disabled={isLoading}
							>
								{isLoading ? "Deleting..." : "Delete Channel"}
							</ModalButton>
						</ChannelModalFooter>
					</ChannelModalContent>
				</ChannelModalOverlay>
			)}
		</>
	);
};
