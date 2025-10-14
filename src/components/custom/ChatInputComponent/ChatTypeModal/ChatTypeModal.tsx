/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"; // shadcn dropdown
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

	// function handleChooseCode() {
	// 	onChoose("quillCode");
	// }

	function handleImageClick() {
		// đóng menu trước, sau đó mở file picker
		setOpen(false);
		// small delay can help some browsers, but usually not needed
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
		// reset so re-select same file later works
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

					<DropdownMenuContent side="bottom" align="start" className="bg-white">
						<DropdownMenuGroup>
							{/* <DropdownMenuItem
								onSelect={(event) => {
									event.preventDefault();
									setOpen(false);
									handleChooseCode();
								}}
							>
								<Pencil />
								Hiển thị tùy chọn Định dạng
							</DropdownMenuItem> */}

							<DropdownMenuItem
								onSelect={(event) => {
									event.preventDefault();
									// close menu then open picker
									handleImageClick();
								}}
							>
								<Image />
								Đính kèm ảnh
							</DropdownMenuItem>

							<DropdownMenuItem
								onSelect={(event) => {
									event.preventDefault();
									handleFileClick();
								}}
							>
								<Link />
								Đính kèm file
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</div>
			</DropdownMenu>

			{/* hidden inputs */}
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
