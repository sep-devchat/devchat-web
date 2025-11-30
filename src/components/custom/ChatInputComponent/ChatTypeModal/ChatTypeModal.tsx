/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Input } from "../../../ui/input";
import { Image, Link } from "lucide-react";
import { InboxType } from "./InboxType";

type Props = {
	trigger?: React.ReactNode;
	onChoose: (type: InboxType, files?: File[]) => void;
};

export default function ChatTypeDropdown({
	trigger = "Attach",
	onChoose,
}: Props) {
	const [open, setOpen] = useState(false);
	const imgRef = useRef<HTMLInputElement | null>(null);
	const fileRef = useRef<HTMLInputElement | null>(null);

	const [windowWidth, setWindowWidth] = useState(
		typeof window !== "undefined" ? window.innerWidth : 1440,
	);

	React.useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const getResponsiveSize = (base: number) => {
		if (windowWidth <= 1220) return base * 0.7;
		if (windowWidth >= 1920) return base * 1.1;
		if (windowWidth >= 1440) return base * 0.8;
		return base;
	};

	const getMediumFontSize = () => {
		if (windowWidth <= 1220) return "12px";
		if (windowWidth >= 1920) return "16px";
		if (windowWidth >= 1440) return "13px";
		return "13px";
	};

	function handleImageClick() {
		setOpen(false);
		setTimeout(() => imgRef.current?.click(), 0);
	}

	function handleFileClick() {
		setOpen(false);
		setTimeout(() => fileRef.current?.click(), 0);
	}

	function handleImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files ? Array.from(e.target.files) : [];
		if (files.length) {
			onChoose("image", files);
		}
		e.currentTarget.value = "";
	}

	function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files ? Array.from(e.target.files) : [];
		if (files.length) {
			onChoose("file", files);
		}
		e.currentTarget.value = "";
	}

	return (
		<>
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<div style={{ background: "#fff" }}>
					<DropdownMenuTrigger asChild>
						<span>{trigger}</span>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						side="bottom"
						align="start"
						className="bg-white"
						style={{
							fontSize: getMediumFontSize(),
							padding: `${getResponsiveSize(4)}px`,
						}}
					>
						<DropdownMenuGroup>
							<DropdownMenuItem
								onSelect={(event) => {
									event.preventDefault();
									handleImageClick();
								}}
								style={{
									gap: `${getResponsiveSize(8)}px`,
									padding: `${getResponsiveSize(8)}px ${getResponsiveSize(12)}px`,
									fontSize: getMediumFontSize(),
								}}
							>
								<Image size={getResponsiveSize(16)} />
								Đính kèm ảnh
							</DropdownMenuItem>

							<DropdownMenuItem
								onSelect={(event) => {
									event.preventDefault();
									handleFileClick();
								}}
								style={{
									gap: `${getResponsiveSize(8)}px`,
									padding: `${getResponsiveSize(8)}px ${getResponsiveSize(12)}px`,
									fontSize: getMediumFontSize(),
								}}
							>
								<Link size={getResponsiveSize(16)} />
								Đính kèm file
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</div>
			</DropdownMenu>

			<Input
				ref={imgRef}
				type="file"
				accept="image/*"
				style={{ display: "none" }}
				multiple
				onChange={handleImageSelected}
			/>
			<Input
				ref={fileRef}
				type="file"
				style={{ display: "none" }}
				multiple
				onChange={handleFilesSelected}
			/>
		</>
	);
}
