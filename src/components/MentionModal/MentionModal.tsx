import React, { useState, useEffect, useRef } from "react";
import {
	Avatar,
	HeaderTitle,
	MemberInfo,
	MemberItem,
	MemberName,
	MemberSpecial,
	MembersSection,
	MemberUsername,
	ModalContainer,
	ModalHeader,
	ModalOverlay,
	SearchInput,
	SpecialMentionDescription,
	SpecialMentionItem,
	SpecialMentionName,
} from "./MentionModal.styled";

interface Member {
	id: string;
	name: string;
	username: string;
	avatarUrl?: string;
	description?: string;
}

interface MentionModalProps {
	show: boolean;
	searchTerm: string;
	onSelect: (mention: string) => void;
	onClose: () => void;
}

const MentionModal: React.FC<MentionModalProps> = ({
	show,
	searchTerm,
	onSelect,
	onClose,
}) => {
	const [highlightedIndex, setHighlightedIndex] = useState(0);
	const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm);
	const modalRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	const members: Member[] = [
		{
			id: "1",
			name: "Như Nguyên",
			username: "nn_01556",
			avatarUrl:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
		},
		{
			id: "2",
			name: "John Doe",
			username: "john_doe",
			avatarUrl:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
		},
		{
			id: "3",
			name: "Jane Smith",
			username: "jane_smith",
			avatarUrl:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
		},
		{
			id: "4",
			name: "Mike Johnson",
			username: "mike_johnson",
			avatarUrl:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
		},
		{
			id: "5",
			name: "Sarah Wilson",
			username: "sarah_wilson",
			avatarUrl:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
		},
	];

	const specialMentions = [
		{
			key: "everyone",
			label: "@everyone",
			description: "Notify everyone who has permission to view this channel",
		},
		{
			key: "here",
			label: "@here",
			description:
				"Notify everyone online who has permission to view this channel",
		},
	];

	const filteredMembers = members.filter(
		(member) =>
			member.name.toLowerCase().includes(internalSearchTerm.toLowerCase()) ||
			member.username.toLowerCase().includes(internalSearchTerm.toLowerCase()),
	);

	const filteredSpecialMentions = specialMentions.filter((mention) =>
		mention.key.includes(internalSearchTerm.toLowerCase()),
	);

	const allItems = [...filteredSpecialMentions, ...filteredMembers];

	useEffect(() => {
		setInternalSearchTerm(searchTerm);
	}, [searchTerm]);

	useEffect(() => {
		setHighlightedIndex(0);
	}, [internalSearchTerm]);

	useEffect(() => {
		if (show && searchInputRef.current) {
			setTimeout(() => {
				searchInputRef.current?.focus();
			}, 100);
		}
	}, [show]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!show) return;

			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setHighlightedIndex((prev) =>
						prev < allItems.length - 1 ? prev + 1 : 0,
					);
					break;
				case "ArrowUp":
					e.preventDefault();
					setHighlightedIndex((prev) =>
						prev > 0 ? prev - 1 : allItems.length - 1,
					);
					break;
				case "Enter":
					e.preventDefault();
					if (allItems[highlightedIndex]) {
						const item = allItems[highlightedIndex];
						if ("key" in item) {
							onSelect(`@${item.key}`);
						} else {
							onSelect(`@${item.username}`);
						}
					}
					break;
				case "Escape":
					onClose();
					break;
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [show, highlightedIndex, allItems, onSelect, onClose]);

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	const handleItemClick = (item: any, index: number) => {
		setHighlightedIndex(index);
		if ("key" in item) {
			onSelect(`@${item.key}`);
		} else {
			onSelect(`@${item.username}`);
		}
	};

	if (!show) return null;

	return (
		<ModalOverlay show={show} onClick={handleOverlayClick}>
			<ModalContainer ref={modalRef}>
				<ModalHeader>
					<HeaderTitle>MEMBERS</HeaderTitle>
					<SearchInput
						ref={searchInputRef}
						type="text"
						placeholder="Search members..."
						value={internalSearchTerm}
						onChange={(e) => setInternalSearchTerm(e.target.value)}
					/>
				</ModalHeader>

				<MembersSection>
					{filteredSpecialMentions.length > 0 && (
						<>
							{filteredSpecialMentions.map((mention, index) => (
								<SpecialMentionItem
									key={mention.key}
									highlighted={highlightedIndex === index}
									onClick={() => handleItemClick(mention, index)}
								>
									<Avatar>@</Avatar>
									<MemberSpecial>
										<SpecialMentionName>{mention.label}</SpecialMentionName>
										<SpecialMentionDescription>
											{mention.description}
										</SpecialMentionDescription>
									</MemberSpecial>
								</SpecialMentionItem>
							))}
						</>
					)}

					{filteredMembers.length > 0 && (
						<>
							{filteredMembers.map((member, index) => {
								const actualIndex = index + filteredSpecialMentions.length;
								return (
									<MemberItem
										key={member.id}
										highlighted={highlightedIndex === actualIndex}
										onClick={() => handleItemClick(member, actualIndex)}
									>
										<Avatar>
											<img
												src={member.avatarUrl}
												alt={member.name}
												style={{
													width: "100%",
													height: "100%",
													borderRadius: "50%",
													objectFit: "cover",
												}}
											/>
										</Avatar>
										<MemberInfo>
											<MemberName>{member.name}</MemberName>
											<MemberUsername>{member.username}</MemberUsername>
										</MemberInfo>
									</MemberItem>
								);
							})}
						</>
					)}

					{allItems.length === 0 && internalSearchTerm && (
						<MemberItem highlighted={false}>
							<MemberInfo>
								<MemberName>No results found</MemberName>
								<MemberUsername>Try a different search term</MemberUsername>
							</MemberInfo>
						</MemberItem>
					)}
				</MembersSection>
			</ModalContainer>
		</ModalOverlay>
	);
};

export default MentionModal;
