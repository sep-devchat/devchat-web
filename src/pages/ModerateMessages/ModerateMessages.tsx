import React, { useState } from "react";
import { useSearch } from "@tanstack/react-router";
import * as S from "./ModerateMessages.styled";
import { FilterBar } from "@/components/custom/FilterBar/FilterBar";
import { StatCard } from "@/components/custom/StatCard/StatCard";
import { ContentArea } from "@/components/custom/ContentArea/ContentArea";

import { TabId, FilterValues } from "./moderateMessages.types";

import {
	TABS,
	DEFAULT_TAB,
	getTodayDateFormatted,
} from "./moderateMessages.constants";
import { STATS_DATA } from "./moderateMessages.statsData";
import { MOCK_MESSAGES_DATA } from "./moderateMessages.mockData";

export const ModerateMessages: React.FC = () => {
	const search = useSearch({ from: "/admin/moderate-messages" });
	const activeTab = (search.tab as TabId) || DEFAULT_TAB;

	const [tabFilters, setTabFilters] = useState<Record<TabId, FilterValues>>({
		"pending-review": {
			priority: "all",
			category: "all",
			group: "all",
			dateRange: getTodayDateFormatted(),
		},
		approved: {
			priority: "all",
			category: "all",
			group: "all",
			dateRange: getTodayDateFormatted(),
		},
		deleted: {
			priority: "all",
			category: "all",
			group: "all",
			dateRange: getTodayDateFormatted(),
		},
		"user-warned": {
			priority: "all",
			category: "all",
			group: "all",
			dateRange: getTodayDateFormatted(),
		},
		escalated: {
			priority: "all",
			category: "all",
			group: "all",
			dateRange: getTodayDateFormatted(),
		},
	});

	const handleFilterApply = (filters: FilterValues) => {
		setTabFilters((prev) => ({
			...prev,
			[activeTab]: filters,
		}));
		console.log(`Filters applied for ${activeTab}:`, filters);
	};

	const handleFilterReset = () => {
		const defaultFilters: FilterValues = {
			priority: "all",
			category: "all",
			group: "all",
			dateRange: getTodayDateFormatted(),
		};
		setTabFilters((prev) => ({
			...prev,
			[activeTab]: defaultFilters,
		}));
		console.log(`Filters reset for ${activeTab}`);
	};

	const getHeaderActions = () => {
		if (activeTab === "pending-review") {
			return (
				<>
					<button
						style={{
							padding: "0.5rem 1rem",
							backgroundColor: "#1CCA93",
							color: "white",
							border: "none",
							borderRadius: "0.375rem",
							cursor: "pointer",
							fontWeight: "500",
						}}
						onClick={() => console.log("Bulk Approve")}
					>
						Bulk Approve
					</button>
					<button
						style={{
							padding: "0.5rem 1rem",
							backgroundColor: "#D83232",
							color: "white",
							border: "none",
							borderRadius: "0.375rem",
							cursor: "pointer",
							fontWeight: "500",
						}}
						onClick={() => console.log("Bulk Reject")}
					>
						Bulk Reject
					</button>
				</>
			);
		}

		if (
			activeTab === "deleted" ||
			activeTab === "user-warned" ||
			activeTab === "escalated"
		) {
			return (
				<button
					style={{
						padding: "0.5rem 1rem",
						backgroundColor: "#D83232",
						color: "white",
						border: "none",
						borderRadius: "0.375rem",
						cursor: "pointer",
						fontWeight: "500",
					}}
					onClick={() => console.log("Select to Ban")}
				>
					Select to Ban
				</button>
			);
		}

		return null;
	};

	const currentStats = STATS_DATA[activeTab];
	const currentFilters = tabFilters[activeTab];
	const currentMessages = MOCK_MESSAGES_DATA[activeTab] || [];

	return (
		<S.Container>
			<S.StatsGrid>
				{currentStats.map((stat, index) => (
					<StatCard key={index} {...stat} />
				))}
			</S.StatsGrid>

			<FilterBar
				key={activeTab}
				defaultFilters={currentFilters}
				onApply={handleFilterApply}
				onReset={handleFilterReset}
			/>

			<ContentArea
				title={`${TABS.find((tab) => tab.id === activeTab)?.label} Queue`}
				headerActions={getHeaderActions()}
				showCheckbox={true}
				showHeaderCheckbox={activeTab === "pending-review"}
				items={currentMessages}
				totalPages={9}
				themeId={activeTab}
				onSelectAll={(checked) => console.log("Select all:", checked)}
				onSelectItem={(id, checked) => console.log("Select item:", id, checked)}
				onPageChange={(page) => console.log("Page changed:", page)}
			/>
		</S.Container>
	);
};

export default ModerateMessages;
