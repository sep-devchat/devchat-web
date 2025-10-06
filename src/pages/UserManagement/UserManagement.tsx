// src/pages/UserManagement.tsx
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export type TabId = "user" | "group";

export interface Tab {
	id: TabId;
	label: string;
}

export const TABS: Tab[] = [
	{ id: "user", label: "User" },
	{ id: "group", label: "Group" },
];

export const DEFAULT_TAB: TabId = "user";

const tabButtonBaseStyle: React.CSSProperties = {
	padding: "8px 14px",
	borderRadius: 8,
	border: "1px solid #E5E7EB",
	background: "white",
	cursor: "pointer",
	fontWeight: 600,
};

const activeTabStyle: React.CSSProperties = {
	...tabButtonBaseStyle,
	background: "#111827",
	color: "white",
	border: "1px solid #111827",
};

export default function UserManagement(): JSX.Element {
	const [activeTab, setActiveTab] = useState<TabId>(DEFAULT_TAB);

	return (
		<div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
			{/* Tab header */}
			<div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
				{TABS.map((tab) => (
					<Button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						style={activeTab === tab.id ? activeTabStyle : tabButtonBaseStyle}
						aria-pressed={activeTab === tab.id}
					>
						{tab.label}
					</Button>
				))}
			</div>

			{/* Content area */}
			<div
				style={{
					background: "white",
					borderRadius: 12,
					padding: 24,
					boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
					minHeight: 320,
				}}
			>
				{activeTab === "user" && (
					<section>
						<h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
							User Management
						</h2>
						<p style={{ color: "#6B7280", marginTop: 8 }}>
							Nội dung quản lý user — danh sách user, tìm kiếm, lọc, hành động
							(create/edit/ban)...
						</p>

						{/* placeholder */}
						<div
							style={{
								marginTop: 18,
								padding: 18,
								borderRadius: 8,
								background: "#F9FAFB",
								border: "1px dashed #E5E7EB",
							}}
						>
							(Thêm table/list user ở đây)
						</div>
					</section>
				)}

				{activeTab === "group" && (
					<section>
						<h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
							Group Management
						</h2>
						<p style={{ color: "#6B7280", marginTop: 8 }}>
							Nội dung quản lý group — danh sách nhóm, phân quyền, tạo/xóa
							nhóm...
						</p>

						{/* placeholder */}
						<div
							style={{
								marginTop: 18,
								padding: 18,
								borderRadius: 8,
								background: "#F9FAFB",
								border: "1px dashed #E5E7EB",
							}}
						>
							(Thêm table/list group ở đây)
						</div>
					</section>
				)}
			</div>
		</div>
	);
}
