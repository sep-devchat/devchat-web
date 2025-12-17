import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { taskAPI, TaskStatisticsResponse } from "@/services/taskAPI";
import {
	SectionWrapper,
	TitleSection,
	StatisticsGrid,
	StatCard,
	StatLabel,
	StatValue,
	DetailSection,
	DetailTitle,
	DetailGrid,
	DetailItem,
	DetailLabel,
	DetailValue,
	LoadingContainer,
	ErrorContainer,
} from "./TaskOverviewSection.styled";

export default function TaskOverviewSection() {
	const params = useParams({ strict: false }) as { groupId?: string };
	const groupId = params.groupId;

	const [statistics, setStatistics] = useState<TaskStatisticsResponse | null>(
		null,
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchStatistics = async () => {
			if (!groupId) {
				setError("Group ID not found");
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setError(null);
				const response = await taskAPI.getTaskStatistics(groupId);
				setStatistics(response.data);
			} catch (err) {
				console.error("Failed to fetch task statistics:", err);
				setError("Failed to load task statistics. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		fetchStatistics();
	}, [groupId]);

	if (loading) {
		return <LoadingContainer>Loading task statistics...</LoadingContainer>;
	}

	if (error || !statistics) {
		return (
			<ErrorContainer>
				{error || "Failed to load task statistics"}
			</ErrorContainer>
		);
	}

	const completionRate =
		statistics.totalTasks > 0
			? Math.round((statistics.completedTasks / statistics.totalTasks) * 100)
			: 0;

	return (
		<SectionWrapper>
			<TitleSection>Task Overview</TitleSection>

			<StatisticsGrid>
				<StatCard $color="rgba(59, 130, 246, 0.1)">
					<StatLabel>Total Tasks</StatLabel>
					<StatValue>{statistics.totalTasks}</StatValue>
				</StatCard>

				<StatCard $color="rgba(251, 191, 36, 0.1)">
					<StatLabel>Pending Tasks</StatLabel>
					<StatValue>{statistics.pendingTasks}</StatValue>
				</StatCard>

				<StatCard $color="rgba(34, 197, 94, 0.1)">
					<StatLabel>Completed Tasks</StatLabel>
					<StatValue>{statistics.completedTasks}</StatValue>
				</StatCard>

				<StatCard $color="rgba(168, 85, 247, 0.1)">
					<StatLabel>Completion Rate</StatLabel>
					<StatValue>{completionRate}%</StatValue>
				</StatCard>
			</StatisticsGrid>

			<DetailSection>
				<DetailTitle>Task Status Breakdown</DetailTitle>
				<DetailGrid>
					<DetailItem>
						<DetailLabel>To Do</DetailLabel>
						<DetailValue $color="#94a3b8">
							{statistics.byStatus.todo}
						</DetailValue>
					</DetailItem>
					<DetailItem>
						<DetailLabel>In Progress</DetailLabel>
						<DetailValue $color="#3b82f6">
							{statistics.byStatus.inProgress}
						</DetailValue>
					</DetailItem>
					<DetailItem>
						<DetailLabel>Done</DetailLabel>
						<DetailValue $color="#22c55e">
							{statistics.byStatus.done}
						</DetailValue>
					</DetailItem>
				</DetailGrid>
			</DetailSection>

			<DetailSection>
				<DetailTitle>Task Priority Distribution</DetailTitle>
				<DetailGrid>
					<DetailItem>
						<DetailLabel>Low Priority</DetailLabel>
						<DetailValue $color="#22c55e">
							{statistics.byPriority.low}
						</DetailValue>
					</DetailItem>
					<DetailItem>
						<DetailLabel>Medium Priority</DetailLabel>
						<DetailValue $color="#f59e0b">
							{statistics.byPriority.medium}
						</DetailValue>
					</DetailItem>
					<DetailItem>
						<DetailLabel>High Priority</DetailLabel>
						<DetailValue $color="#ef4444">
							{statistics.byPriority.high}
						</DetailValue>
					</DetailItem>
				</DetailGrid>
			</DetailSection>

			<DetailSection>
				<DetailTitle>Additional Statistics</DetailTitle>
				<DetailGrid>
					<DetailItem>
						<DetailLabel>Unassigned Tasks</DetailLabel>
						<DetailValue $color="#6b7280">
							{statistics.unassignedTasks}
						</DetailValue>
					</DetailItem>
					<DetailItem>
						<DetailLabel>Overdue Tasks</DetailLabel>
						<DetailValue $color="#dc2626">
							{statistics.overdueTasks}
						</DetailValue>
					</DetailItem>
				</DetailGrid>
			</DetailSection>
		</SectionWrapper>
	);
}
