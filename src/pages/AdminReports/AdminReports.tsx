import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import dayjs from "dayjs";
import MarkdownPreview from "@/components/custom/MarkdownPreview";
import {
	listReports,
	MessageReportType,
	type ReportListResponse,
	type ReportResponse,
} from "@/services/reportAPI";
import { listReportCategoriesPublic } from "@/services/reportCategoryAPI";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	ChevronLeft,
	ChevronRight,
	Eye,
	ExternalLink,
	Filter,
	ListFilter,
	Loader2,
	RefreshCcw,
	ChevronDown,
} from "lucide-react";
import * as S from "./AdminReports.styled";

const PAGE_SIZE_OPTIONS = [10, 20, 50];
type AdminReportsSearch = {
	reporterId?: string;
	messageId?: string;
	messageType?: MessageReportType;
};

const typeLabels: Record<MessageReportType, string> = {
	[MessageReportType.CHANNEL_MESSAGE]: "Channel message",
	[MessageReportType.DIRECT_MESSAGE]: "Direct message",
	[MessageReportType.THREAD_MESSAGE]: "Thread reply",
};

type ProfileLike = {
	firstName?: string | null;
	lastName?: string | null;
	username?: string | null;
	email?: string | null;
	id?: string;
	avatarUrl?: string | null;
} | null;

const getProfileDisplayName = (profile?: ProfileLike) => {
	if (!profile) return "Unknown user";
	if (profile.firstName || profile.lastName) {
		return `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim();
	}
	return profile.username ?? profile.email ?? profile.id ?? "Unknown user";
};

const getProfileAvatarUrl = (profile?: ProfileLike) => {
	const fallbackName = getProfileDisplayName(profile) || "User";
	const trimmed = profile?.avatarUrl?.trim();
	if (trimmed) return trimmed;
	return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=3b82f6&color=fff`;
};

const getErrorMessage = (error: unknown) => {
	if (!error) return "Something went wrong";
	if (typeof error === "string") return error;
	if (error instanceof Error) return error.message;
	const maybeResponse = error as { response?: { data?: { message?: string } } };
	return maybeResponse?.response?.data?.message ?? "Something went wrong";
};

const getTargetSenderProfile = (report: ReportResponse): ProfileLike => {
	switch (report.messageType) {
		case MessageReportType.DIRECT_MESSAGE:
			return report.directMessage?.from ?? null;
		case MessageReportType.THREAD_MESSAGE:
			return report.threadMessage?.sender ?? null;
		default:
			return report.message?.sender ?? null;
	}
};

const getReporterDisplayName = (report: ReportResponse) =>
	getProfileDisplayName(report.createdBy);

const getTargetContent = (report: ReportResponse) => {
	switch (report.messageType) {
		case MessageReportType.DIRECT_MESSAGE:
			return report.directMessage?.content ?? "(message unavailable)";
		case MessageReportType.THREAD_MESSAGE:
			return report.threadMessage?.content ?? "(message unavailable)";
		default:
			return report.message?.content ?? "(message unavailable)";
	}
};

// const getTargetSender = (report: ReportResponse) => {
// 	switch (report.messageType) {
// 		case MessageReportType.DIRECT_MESSAGE:
// 			return getProfileDisplayName(report.directMessage?.from);
// 		case MessageReportType.THREAD_MESSAGE:
// 			return getProfileDisplayName(report.threadMessage?.sender);
// 		default:
// 			return getProfileDisplayName(report.message?.sender);
// 	}
// };

// const getLocationSummary = (report: ReportResponse) => {
// 	switch (report.messageType) {
// 		case MessageReportType.DIRECT_MESSAGE: {
// 			const recipient = getProfileDisplayName(report.directMessage?.to);
// 			return `Direct message to ${recipient}`;
// 		}
// 		case MessageReportType.THREAD_MESSAGE: {
// 			const channelName =
// 				report.message?.channel?.name ??
// 				report.message?.channelId ??
// 				report.threadMessage?.channelId;
// 			const threadReference =
// 				report.threadMessage?.id ?? report.message?.thread?.id ?? undefined;
// 			if (channelName && threadReference) {
// 				return `Thread ${threadReference.slice(0, 8)} in #${channelName}`;
// 			}
// 			if (channelName) {
// 				return `Reply in #${channelName}`;
// 			}
// 			return threadReference
// 				? `Thread ${threadReference.slice(0, 8)}`
// 				: "Thread reply";
// 		}
// 		default: {
// 			const channel = report.message?.channel?.name;
// 			return channel ? `#${channel}` : "Channel message";
// 		}
// 	}
// };

const formatShortId = (id: string) => {
	if (id.length <= 12) return id;
	return `${id.slice(0, 6)}…${id.slice(-4)}`;
};

const AdminReports = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const search = useSearch({ from: "/admin/reports" }) as AdminReportsSearch;
	const reporterFilter = search?.reporterId;
	const messageFilterId = search?.messageId;
	const messageFilterType = search?.messageType;
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(20);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedReport, setSelectedReport] = useState<ReportResponse | null>(
		null,
	);

	const { data: categoryResponse, isLoading: categoriesLoading } = useQuery({
		queryKey: ["report-categories", "admin-filter"],
		queryFn: async () => {
			const response = await listReportCategoriesPublic();
			return response?.data ?? [];
		},
		staleTime: 5 * 60 * 1000,
	});

	const availableCategories = (categoryResponse ?? []).filter(
		(category) => !category.isRemoved,
	);

	const filters = useMemo(() => {
		const hasMessageFilter = Boolean(messageFilterId && messageFilterType);
		return {
			page,
			limit,
			createdById: reporterFilter || undefined,
			messageId: hasMessageFilter ? messageFilterId : undefined,
			messageType: hasMessageFilter ? messageFilterType : undefined,
			reportCategoryIds:
				selectedCategories.length > 0
					? [...selectedCategories].sort((a, b) => a.localeCompare(b))
					: undefined,
		};
	}, [
		page,
		limit,
		reporterFilter,
		messageFilterId,
		messageFilterType,
		selectedCategories,
	]);

	useEffect(() => {
		setPage(1);
	}, [reporterFilter, messageFilterId, messageFilterType]);

	const updateSearchParams = (
		updater: (prev: AdminReportsSearch) => AdminReportsSearch,
	) => {
		navigate({
			to: "/admin/reports",
			search: (prev: AdminReportsSearch) => updater(prev ?? {}),
		});
	};

	const setReporterFilterSearch = (value?: string) => {
		updateSearchParams((prev) => {
			const next = { ...prev };
			if (value) {
				next.reporterId = value;
			} else {
				delete next.reporterId;
			}
			return next;
		});
	};

	const setMessageFilterSearch = (
		messageId?: string,
		messageType?: MessageReportType,
	) => {
		updateSearchParams((prev) => {
			const next = { ...prev };
			if (messageId && messageType) {
				next.messageId = messageId;
				next.messageType = messageType;
			} else {
				delete next.messageId;
				delete next.messageType;
			}
			return next;
		});
	};

	const reportsQuery = useQuery<ReportListResponse>({
		queryKey: ["admin-reports", filters],
		queryFn: () =>
			listReports({
				page: filters.page,
				limit: filters.limit,
				messageId: filters.messageId,
				messageType: filters.messageType,
				createdById: filters.createdById,
				reportCategoryIds: filters.reportCategoryIds,
			}),
		placeholderData: (previousData) => previousData,
	});

	const reports = reportsQuery.data?.data ?? [];
	const pagination = reportsQuery.data?.pagination;
	const totalRecords = pagination?.totalRecord ?? reports.length;
	const totalPages = Math.max(1, pagination?.totalPage ?? 1);
	const isInitialLoading = reportsQuery.isLoading;
	const isRefetching = reportsQuery.isFetching && !reportsQuery.isLoading;
	const errorMessage = reportsQuery.isError
		? getErrorMessage(reportsQuery.error)
		: null;

	const pageStart =
		totalRecords === 0 ? 0 : (filters.page - 1) * filters.limit + 1;
	const pageEnd =
		totalRecords === 0
			? 0
			: Math.min(filters.page * filters.limit, totalRecords);

	const toggleCategory = (categoryId: string) => {
		setPage(1);
		setSelectedCategories((prev) =>
			prev.includes(categoryId)
				? prev.filter((id) => id !== categoryId)
				: [...prev, categoryId],
		);
	};

	const clearFilters = () => {
		setSelectedCategories([]);
		setReporterFilterSearch();
		setMessageFilterSearch();
		setPage(1);
	};

	const refreshList = () => {
		queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
	};

	const categoryPillLabels = selectedCategories
		.map(
			(id) => availableCategories.find((category) => category.id === id)?.name,
		)
		.filter((name): name is string => Boolean(name));

	const categoryButtonLabel = categoriesLoading
		? "Loading categories..."
		: categoryPillLabels.length > 0
			? `${categoryPillLabels.length} selected`
			: "All categories";
	const categoryButtonHint =
		selectedCategories.length > 0 ? "Filtered" : "Showing all";
	const reporterFilterLabel = reporterFilter
		? formatShortId(reporterFilter)
		: null;
	const messageFilterLabel =
		messageFilterId && messageFilterType
			? {
					id: formatShortId(messageFilterId),
					text: typeLabels[messageFilterType],
				}
			: null;

	return (
		<S.PageContainer>
			<S.Panel>
				<S.HeaderRow>
					<S.TitleBlock>
						{/* <S.Title>User reports</S.Title> */}
						<S.Subtitle>
							Review flagged messages, filter by category, and inspect reporter
							context.
						</S.Subtitle>
					</S.TitleBlock>
					<S.ActionGroup>
						<S.ActionButton
							type="button"
							onClick={refreshList}
							disabled={isInitialLoading}
						>
							{isRefetching ? (
								<Loader2 size={16} className="animate-spin" />
							) : (
								<RefreshCcw size={16} />
							)}
							Refresh
						</S.ActionButton>
						<S.ActionButton
							type="button"
							$variant="ghost"
							onClick={clearFilters}
						>
							<ListFilter size={16} />
							Clear filters
						</S.ActionButton>
					</S.ActionGroup>
				</S.HeaderRow>
				<S.FiltersGrid>
					<S.FilterField as="div">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<S.CategoryButton
									type="button"
									className={
										categoryPillLabels.length > 0 ? "has-selection" : ""
									}
								>
									<Filter size={18} strokeWidth={2.5} />
									<div>
										<div>{categoryButtonLabel}</div>
										<S.CategoryStatus $selected={categoryPillLabels.length > 0}>
											{categoryButtonHint}
										</S.CategoryStatus>
									</div>
									<ChevronDown
										size={16}
										style={{
											marginLeft: "auto",
											opacity: 0.6,
											transition: "transform 0.2s ease",
										}}
									/>
								</S.CategoryButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="start"
								sideOffset={8}
								style={{
									borderRadius: "12px",
									border: "1px solid #e2e8f0",
									boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12)",
									padding: "8px",
									width: "var(--radix-dropdown-menu-trigger-width)",
									minWidth: "280px",
								}}
							>
								<DropdownMenuLabel
									style={{
										fontSize: "14px",
										fontWeight: 600,
										color: "#0f172a",
										padding: "8px 26px 6px",
									}}
								>
									Filter by category
								</DropdownMenuLabel>
								<DropdownMenuSeparator style={{ margin: "6px 0" }} />
								{availableCategories.length === 0 ? (
									<p
										style={{
											padding: "12px",
											fontSize: 13,
											color: "#64748b",
											textAlign: "center",
											margin: 0,
										}}
									>
										No active categories
									</p>
								) : (
									availableCategories.map((category) => (
										<DropdownMenuCheckboxItem
											key={category.id}
											checked={selectedCategories.includes(category.id)}
											onCheckedChange={() => toggleCategory(category.id)}
											style={{
												padding: "10px 12px",
												borderRadius: "8px",
												margin: "2px 0",
												cursor: "pointer",
												transition: "all 0.15s ease",
											}}
										>
											<div style={{ paddingLeft: "8px" }}>
												<p
													style={{
														margin: "0 8px",
														fontSize: 14,
														fontWeight: 600,
														color: "#0f172a",
														lineHeight: 1.4,
													}}
												>
													{category.name}
												</p>
												{category.description && (
													<p
														style={{
															margin: "0 8px",
															fontSize: 12,
															color: "#94a3b8",
															lineHeight: 1.4,
														}}
													>
														{category.description}
													</p>
												)}
											</div>
										</DropdownMenuCheckboxItem>
									))
								)}
							</DropdownMenuContent>
						</DropdownMenu>
						{categoryPillLabels.length > 0 && (
							<S.FilterTags>
								{categoryPillLabels.map((label) => (
									<S.FilterTag key={label}>{label}</S.FilterTag>
								))}
							</S.FilterTags>
						)}
					</S.FilterField>
				</S.FiltersGrid>
				{reporterFilterLabel && (
					<S.ReporterFilterNotice>
						<span>
							Showing reports filed by user{" "}
							<S.ReporterFilterCode>{reporterFilterLabel}</S.ReporterFilterCode>
						</span>
						<S.ReporterFilterButton
							type="button"
							onClick={() => setReporterFilterSearch()}
						>
							Clear reporter filter
						</S.ReporterFilterButton>
					</S.ReporterFilterNotice>
				)}
				{messageFilterLabel && (
					<S.ReporterFilterNotice>
						<span>
							Showing reports about message{" "}
							<S.ReporterFilterCode>
								{messageFilterLabel.id}
							</S.ReporterFilterCode>
							{" · "}
							{messageFilterLabel.text}
						</span>
						<S.ReporterFilterButton
							type="button"
							onClick={() => setMessageFilterSearch()}
						>
							Clear message filter
						</S.ReporterFilterButton>
					</S.ReporterFilterNotice>
				)}
			</S.Panel>

			<S.TableCard>
				<S.TableHeader>
					<S.TableHeaderRow>
						<div>
							<S.TableTitle>Reports</S.TableTitle>
							<S.TableSubtitle>
								{isRefetching
									? "Refreshing data..."
									: "Latest user submitted reports"}
							</S.TableSubtitle>
						</div>
						<S.RowsControl>
							<span>Rows per page</span>
							<S.Select
								value={limit}
								onChange={(event) => {
									setLimit(Number(event.target.value));
									setPage(1);
								}}
							>
								{PAGE_SIZE_OPTIONS.map((size) => (
									<option key={size} value={size}>
										{size}
									</option>
								))}
							</S.Select>
						</S.RowsControl>
					</S.TableHeaderRow>
				</S.TableHeader>
				{isInitialLoading ? (
					<S.StateMessage>
						<Loader2 size={20} className="animate-spin" />
						Loading reports...
					</S.StateMessage>
				) : errorMessage ? (
					<S.ErrorState>{errorMessage}</S.ErrorState>
				) : reports.length === 0 ? (
					<S.StateMessage>No reports match the current filters.</S.StateMessage>
				) : (
					<>
						<S.TableWrapper>
							<S.Table>
								<S.TableHead>
									<tr>
										<S.Th style={{ width: "30%" }}>Reported content</S.Th>
										<S.Th>Categories</S.Th>
										<S.Th>Reported User</S.Th>
										<S.Th>Reporter</S.Th>
										<S.Th>Created</S.Th>
										<S.Th $align="right">Actions</S.Th>
									</tr>
								</S.TableHead>
								<tbody>
									{reports.map((report) => {
										const tableReporterNote = report.content?.trim();
										const reporterDisplayName = getReporterDisplayName(report);
										const reporterContact =
											report.createdBy?.email ??
											report.createdBy?.username ??
											"—";
										const reporterAvatar = getProfileAvatarUrl(
											report.createdBy,
										);

										const targetSenderProfile = getTargetSenderProfile(report);
										const targetSenderDisplayName =
											getProfileDisplayName(targetSenderProfile);
										const targetSenderContact =
											targetSenderProfile?.email ??
											targetSenderProfile?.username ??
											"—";
										const targetSenderAvatar =
											getProfileAvatarUrl(targetSenderProfile);
										return (
											<S.Row key={report.id}>
												<S.Td>
													<S.ContentCell>
														<S.MetaRow>
															<S.IdTag>#{report.id.slice(0, 8)}</S.IdTag>
															<S.TypeBadge $variant={report.messageType}>
																{typeLabels[report.messageType]}
															</S.TypeBadge>
														</S.MetaRow>
														<S.ContentText>
															<MarkdownPreview
																content={getTargetContent(report)}
															/>
														</S.ContentText>
														{tableReporterNote && (
															<S.ReporterNote>
																<span>Reporter note:</span>
																<MarkdownPreview content={tableReporterNote} />
															</S.ReporterNote>
														)}
													</S.ContentCell>
												</S.Td>
												<S.Td>
													{report.reportCategories?.length ? (
														<S.CategoriesCell>
															{report.reportCategories.map((category) => (
																<S.CategoryBadge key={category.id}>
																	{category.name}
																</S.CategoryBadge>
															))}
														</S.CategoriesCell>
													) : (
														<S.ReporterMeta>No categories</S.ReporterMeta>
													)}
												</S.Td>
												<S.Td>
													<S.ReporterInfo>
														<S.ReporterAvatar
															src={targetSenderAvatar}
															alt={`Avatar of ${targetSenderDisplayName}`}
															loading="lazy"
														/>
														<S.ReporterDetails>
															<S.ReporterName>
																{targetSenderDisplayName}
															</S.ReporterName>
															<S.ReporterMeta>
																{targetSenderContact}
															</S.ReporterMeta>
														</S.ReporterDetails>
													</S.ReporterInfo>
												</S.Td>
												<S.Td>
													<S.ReporterInfo>
														<S.ReporterAvatar
															src={reporterAvatar}
															alt={`Avatar of ${reporterDisplayName}`}
															loading="lazy"
														/>
														<S.ReporterDetails>
															<S.ReporterName>
																{reporterDisplayName}
															</S.ReporterName>
															<S.ReporterMeta>{reporterContact}</S.ReporterMeta>
														</S.ReporterDetails>
													</S.ReporterInfo>
												</S.Td>
												<S.Td>
													<S.DateText>
														{dayjs(report.createdAt).format("MMM D, YYYY")}
													</S.DateText>
													<S.DateMeta>
														{dayjs(report.createdAt).format("HH:mm z")}
													</S.DateMeta>
												</S.Td>
												<S.Td $align="right">
													<S.ViewButton
														type="button"
														onClick={() => setSelectedReport(report)}
													>
														<Eye size={16} />
														View
													</S.ViewButton>
												</S.Td>
											</S.Row>
										);
									})}
								</tbody>
							</S.Table>
						</S.TableWrapper>
						<S.PaginationBar>
							<S.PaginationInfo>
								Showing {pageStart}-{pageEnd} of {totalRecords} reports
							</S.PaginationInfo>
							<S.PaginationControls>
								<S.PaginationButton
									type="button"
									onClick={() => setPage((prev) => Math.max(1, prev - 1))}
									disabled={filters.page <= 1}
								>
									<ChevronLeft size={14} /> Previous
								</S.PaginationButton>
								<S.PaginationCurrent>
									Page {filters.page} / {totalPages}
								</S.PaginationCurrent>
								<S.PaginationButton
									type="button"
									onClick={() => setPage((prev) => prev + 1)}
									disabled={filters.page >= totalPages}
								>
									Next <ChevronRight size={14} />
								</S.PaginationButton>
							</S.PaginationControls>
						</S.PaginationBar>
					</>
				)}
			</S.TableCard>

			<ReportDetailDialog
				report={selectedReport}
				onClose={() => setSelectedReport(null)}
				onViewReporterReports={(reporterId) => {
					setReporterFilterSearch(reporterId);
					setSelectedReport(null);
				}}
				onViewMessageReports={(messageId, messageType) => {
					setMessageFilterSearch(messageId, messageType);
					setSelectedReport(null);
				}}
			/>
		</S.PageContainer>
	);
};

interface ReportDetailDialogProps {
	report: ReportResponse | null;
	onClose: () => void;
	onViewReporterReports: (reporterId: string) => void;
	onViewMessageReports: (
		messageId: string,
		messageType: MessageReportType,
	) => void;
}

const ReportDetailDialog = ({
	report,
	onClose,
	onViewReporterReports,
	onViewMessageReports,
}: ReportDetailDialogProps) => {
	const messageType = report?.messageType;
	const type = messageType ?? MessageReportType.CHANNEL_MESSAGE;
	const reporterId = report?.createdBy?.id;
	const messageId =
		report?.messageId ??
		report?.message?.id ??
		report?.directMessage?.id ??
		report?.threadMessage?.id ??
		undefined;
	const canViewMessageReports = Boolean(messageId && messageType);
	const reporterNote = report?.content?.trim();
	const reporterDisplayName = report
		? getReporterDisplayName(report)
		: "Unknown user";
	const reporterContact =
		report?.createdBy?.email ?? report?.createdBy?.username ?? "—";
	const reporterAvatar = getProfileAvatarUrl(report?.createdBy);

	const targetSenderProfile = report ? getTargetSenderProfile(report) : null;
	const targetSenderDisplayName = getProfileDisplayName(targetSenderProfile);
	const targetSenderContact =
		targetSenderProfile?.email ?? targetSenderProfile?.username ?? "—";
	const targetSenderAvatar = getProfileAvatarUrl(targetSenderProfile);
	const targetSenderId = targetSenderProfile?.id;
	return (
		<Dialog open={Boolean(report)} onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				className="sm:max-w-2xl max-h-[90vh] overflow-y-auto border-none bg-transparent p-0"
				onInteractOutside={(e) => e.preventDefault()}
				onEscapeKeyDown={(e) => e.preventDefault()}
			>
				{report ? (
					<S.DetailCard>
						<DialogHeader>
							<DialogTitle
								style={{
									display: "flex",
									alignItems: "center",
									gap: "12px",
									fontSize: "22px",
									fontWeight: 600,
									color: "#0f172a",
								}}
							>
								Report #{report.id}
								<S.TypeBadge as="span" $variant={type}>
									{typeLabels[type]}
								</S.TypeBadge>
							</DialogTitle>
							<DialogDescription style={{ color: "#475569" }}>
								Filed {dayjs(report.createdAt).format("MMM D, YYYY HH:mm z")} by{" "}
								{getReporterDisplayName(report)}
							</DialogDescription>
						</DialogHeader>
						<S.DetailStack>
							<S.DetailSection>
								<S.DetailHeading>Reporter</S.DetailHeading>
								<S.ReporterInfo>
									<S.ReporterAvatar
										$size={56}
										src={reporterAvatar}
										alt={`Avatar of ${reporterDisplayName}`}
										loading="lazy"
									/>
									<S.ReporterDetails>
										<S.ReporterName>{reporterDisplayName}</S.ReporterName>
										<S.ReporterMeta>{reporterContact}</S.ReporterMeta>
									</S.ReporterDetails>
								</S.ReporterInfo>
								<S.DetailList>
									<S.DetailItem>
										<S.DetailLabel>Name</S.DetailLabel>
										<S.DetailValue>
											{getReporterDisplayName(report)}
										</S.DetailValue>
									</S.DetailItem>
									<S.DetailItem>
										<S.DetailLabel>Email</S.DetailLabel>
										<S.DetailValue>
											{report.createdBy?.email ?? "—"}
										</S.DetailValue>
									</S.DetailItem>
									<S.DetailItem>
										<S.DetailLabel>User ID</S.DetailLabel>
										<S.DetailValue>{report.createdBy?.id ?? "—"}</S.DetailValue>
									</S.DetailItem>
								</S.DetailList>
								{reporterId && (
									<S.DetailActions>
										<S.DetailActionButton
											type="button"
											onClick={() => onViewReporterReports(reporterId)}
										>
											<ExternalLink size={14} />
											View all reports from this user
										</S.DetailActionButton>
									</S.DetailActions>
								)}
							</S.DetailSection>

							{/* PHẦN MỚI: Target Message Sender */}
							<S.DetailSection>
								<S.DetailHeading>Message Sender</S.DetailHeading>
								<S.ReporterInfo>
									<S.ReporterAvatar
										$size={56}
										src={targetSenderAvatar}
										alt={`Avatar of ${targetSenderDisplayName}`}
										loading="lazy"
									/>
									<S.ReporterDetails>
										<S.ReporterName>{targetSenderDisplayName}</S.ReporterName>
										<S.ReporterMeta>{targetSenderContact}</S.ReporterMeta>
									</S.ReporterDetails>
								</S.ReporterInfo>
								<S.DetailList>
									<S.DetailItem>
										<S.DetailLabel>Name</S.DetailLabel>
										<S.DetailValue>{targetSenderDisplayName}</S.DetailValue>
									</S.DetailItem>
									<S.DetailItem>
										<S.DetailLabel>Email</S.DetailLabel>
										<S.DetailValue>
											{targetSenderProfile?.email ?? "—"}
										</S.DetailValue>
									</S.DetailItem>
									<S.DetailItem>
										<S.DetailLabel>User ID</S.DetailLabel>
										<S.DetailValue>{targetSenderId ?? "—"}</S.DetailValue>
									</S.DetailItem>
								</S.DetailList>

								<div style={{ marginTop: "16px" }}>
									<S.DetailLabel
										style={{ marginBottom: "8px", display: "block" }}
									>
										Message Content
									</S.DetailLabel>
									<S.DetailText>
										<MarkdownPreview content={getTargetContent(report)} />
									</S.DetailText>
								</div>

								{canViewMessageReports && messageId && messageType && (
									<S.DetailActions>
										<S.DetailActionButton
											type="button"
											onClick={() =>
												onViewMessageReports(messageId, messageType)
											}
										>
											<ExternalLink size={14} />
											View all reports about this message
										</S.DetailActionButton>
									</S.DetailActions>
								)}
							</S.DetailSection>
							<S.DetailSection>
								<S.DetailHeading>Reporter note</S.DetailHeading>
								{reporterNote ? (
									<S.DetailNote>
										<MarkdownPreview content={reporterNote} />
									</S.DetailNote>
								) : (
									<S.DetailMeta>No additional context provided.</S.DetailMeta>
								)}
							</S.DetailSection>
							<S.DetailSection>
								<S.DetailHeading>Categories</S.DetailHeading>
								{report.reportCategories?.length ? (
									<S.CategoriesCell>
										{report.reportCategories.map((category) => (
											<S.CategoryBadge key={category.id}>
												{category.name}
											</S.CategoryBadge>
										))}
									</S.CategoriesCell>
								) : (
									<S.DetailMeta>No category assigned.</S.DetailMeta>
								)}
							</S.DetailSection>
						</S.DetailStack>
					</S.DetailCard>
				) : null}
			</DialogContent>
		</Dialog>
	);
};

export default AdminReports;
