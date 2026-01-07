/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { X } from "lucide-react";

import {
	AlertContainer,
	showGlobalAlert,
} from "@/components/custom/AlertCustom/Alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import {
	DescripSection,
	SectionWrapper,
	TitleArea,
	TitleSection,
} from "../GroupSetting.styled";

import type { ProgrammingLanguageResponse } from "@/services/programmingLanguagesAPI";
import { getActiveProgrammingLanguages } from "@/services/programmingLanguagesAPI";
import { getGroupSubscriptions } from "@/services/groupAPI";
import {
	addGroupSupportedProgrammingLanguage,
	listGroupSupportedProgrammingLanguages,
	removeGroupSupportedProgrammingLanguage,
} from "@/services/groupSupportedProgrammingLanguageAPI";

type GroupProgrammingLanguageSectionProps = {
	canManage?: boolean;
	groupId?: string;
};

export default function GroupProgrammingLanguageSection({
	canManage = false,
	groupId: groupIdProp,
}: GroupProgrammingLanguageSectionProps) {
	const params = useParams({ strict: false }) as { groupId?: string };
	const groupId = groupIdProp ?? params.groupId;

	const [loading, setLoading] = useState(false);
	const [loadingGroup, setLoadingGroup] = useState(false);
	const [loadingLanguages, setLoadingLanguages] = useState(false);

	const [groupLanguages, setGroupLanguages] = useState<
		ProgrammingLanguageResponse[]
	>([]);
	const [allLanguages, setAllLanguages] = useState<
		ProgrammingLanguageResponse[]
	>([]);
	const [selectedLanguageId, setSelectedLanguageId] = useState<string>("");
	const [languageLimitFromEntitlement, setLanguageLimitFromEntitlement] =
		useState<number | null>(null);
	const [languagesUsedFromUsage, setLanguagesUsedFromUsage] = useState<
		number | null
	>(null);
	const [entitlementUsageLoading, setEntitlementUsageLoading] = useState(false);

	const groupLanguageIdSet = useMemo(() => {
		return new Set(groupLanguages.map((l) => l.id));
	}, [groupLanguages]);

	const selectableLanguages = useMemo(() => {
		return [...allLanguages]
			.filter((l) => l.isActive)
			.sort((a, b) =>
				String(a.languageName).localeCompare(String(b.languageName)),
			);
	}, [allLanguages]);

	const refreshGroupLanguages = useCallback(async () => {
		if (!groupId) return;
		setLoadingGroup(true);
		try {
			const res = await listGroupSupportedProgrammingLanguages(groupId);
			setGroupLanguages(res?.data ?? []);
		} catch (err: any) {
			showGlobalAlert({
				type: "error",
				message: String(
					err?.response?.data?.message ??
						err?.message ??
						"Failed to load group languages",
				),
			});
		} finally {
			setLoadingGroup(false);
		}
	}, [groupId]);

	const refreshAllLanguages = useCallback(async () => {
		setLoadingLanguages(true);
		try {
			const res = await getActiveProgrammingLanguages();
			setAllLanguages(res?.data ?? []);
		} catch (err: any) {
			showGlobalAlert({
				type: "error",
				message: String(
					err?.response?.data?.message ??
						err?.message ??
						"Failed to load programming languages",
				),
			});
		} finally {
			setLoadingLanguages(false);
		}
	}, []);

	useEffect(() => {
		void refreshAllLanguages();
	}, [refreshAllLanguages]);

	useEffect(() => {
		void refreshGroupLanguages();
	}, [refreshGroupLanguages]);

	const refreshEntitlementUsage = useCallback(async () => {
		if (!groupId) return;
		setEntitlementUsageLoading(true);
		try {
			const res = await getGroupSubscriptions(groupId);
			const entitlement = (res as any)?.data?.currentEntitlement;
			const usage = (res as any)?.data?.usage;
			const limitRaw =
				entitlement?.entitlements?.limits?.programmingLanguagesInGroups;
			const usedRaw = usage?.currentProgrammingLanguagesInGroups;
			const parsedLimit = Number(limitRaw);
			setLanguageLimitFromEntitlement(
				Number.isFinite(parsedLimit) ? parsedLimit : null,
			);
			setLanguagesUsedFromUsage(
				usedRaw === null || typeof usedRaw === "undefined"
					? null
					: Number(usedRaw),
			);
		} catch {
			setLanguageLimitFromEntitlement(null);
			setLanguagesUsedFromUsage(null);
		} finally {
			setEntitlementUsageLoading(false);
		}
	}, [groupId]);

	useEffect(() => {
		if (!groupId) {
			setLanguageLimitFromEntitlement(null);
			setLanguagesUsedFromUsage(null);
			setEntitlementUsageLoading(false);
			return;
		}
		void refreshEntitlementUsage();
	}, [groupId, refreshEntitlementUsage]);

	const languageLimitUi = useMemo(() => {
		const usedFallback = groupLanguages.length;
		const used = Number(languagesUsedFromUsage ?? usedFallback);
		const limit = Number(languageLimitFromEntitlement);
		const hasLimit =
			languageLimitFromEntitlement !== null && Number.isFinite(limit);
		if (entitlementUsageLoading) {
			return {
				text: "Loading language entitlement...",
				pct: 0,
			};
		}
		if (!hasLimit) {
			return {
				text:
					languagesUsedFromUsage === null
						? "Language entitlement: N/A"
						: `Languages: ${used} • Limit: N/A`,
				pct: 0,
			};
		}
		const isUnlimited = Number.isFinite(limit) && limit < 0;
		const isDisabled = !isUnlimited && limit <= 0;
		const pct =
			!isUnlimited && !isDisabled && limit > 0
				? Math.min(100, Math.max(0, Math.round((used / limit) * 100)))
				: 0;
		const text = isUnlimited
			? `Languages: ${used} • Limit: Unlimited`
			: isDisabled
				? `Languages: ${used} • Limit: 0`
				: `Languages: ${used} / ${limit}`;
		return { text, pct };
	}, [
		entitlementUsageLoading,
		groupLanguages.length,
		languagesUsedFromUsage,
		languageLimitFromEntitlement,
	]);

	// If the selected language is already added, clear it.
	useEffect(() => {
		if (selectedLanguageId && groupLanguageIdSet.has(selectedLanguageId)) {
			setSelectedLanguageId("");
		}
	}, [selectedLanguageId, groupLanguageIdSet]);

	const handleAdd = async () => {
		if (!canManage) return;
		if (!groupId) {
			showGlobalAlert({ type: "warning", message: "Missing group id" });
			return;
		}
		if (!selectedLanguageId) return;

		try {
			setLoading(true);
			await addGroupSupportedProgrammingLanguage(groupId, selectedLanguageId);
			showGlobalAlert({ type: "success", message: "Added successfully" });
			setSelectedLanguageId("");
			await refreshGroupLanguages();
			await refreshEntitlementUsage();
		} catch (err: any) {
			showGlobalAlert({
				type: "error",
				message: String(
					err?.response?.data?.message ??
						err?.message ??
						"Failed to add language",
				),
			});
		} finally {
			setLoading(false);
		}
	};

	const handleRemove = async (languageId: string) => {
		if (!canManage) return;
		if (!groupId) {
			showGlobalAlert({ type: "warning", message: "Missing group id" });
			return;
		}
		try {
			setLoading(true);
			await removeGroupSupportedProgrammingLanguage(groupId, languageId);
			showGlobalAlert({ type: "success", message: "Removed successfully" });
			await refreshGroupLanguages();
			await refreshEntitlementUsage();
		} catch (err: any) {
			showGlobalAlert({
				type: "error",
				message: String(
					err?.response?.data?.message ??
						err?.message ??
						"Failed to remove language",
				),
			});
		} finally {
			setLoading(false);
		}
	};

	const addDisabled =
		!canManage ||
		!groupId ||
		!selectedLanguageId ||
		loading ||
		groupLanguageIdSet.has(selectedLanguageId);

	return (
		<SectionWrapper>
			<AlertContainer />
			<TitleArea>
				<TitleSection>Programming Languages</TitleSection>
				<DescripSection>
					Manage which programming languages are enabled for this group.
				</DescripSection>
				<div className="mt-2 grid gap-2">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Entitlement usage</span>
						<span className="text-xs text-muted-foreground">
							{languageLimitUi.text}
						</span>
					</div>
					<Progress value={languageLimitUi.pct} />
				</div>
			</TitleArea>

			<Card className="mb-4">
				<CardHeader>
					<CardTitle className="text-base">Add language</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
					<div className="flex-1">
						<Select
							value={selectedLanguageId}
							onValueChange={setSelectedLanguageId}
							disabled={!canManage || loadingLanguages || !groupId}
						>
							<SelectTrigger>
								<SelectValue
									placeholder={
										loadingLanguages
											? "Loading languages..."
											: "Select a language"
									}
								/>
							</SelectTrigger>
							<SelectContent>
								{selectableLanguages.map((lang) => {
									const alreadyAdded = groupLanguageIdSet.has(lang.id);
									const label = `${lang.languageName}${lang.languageVersion ? ` (${lang.languageVersion})` : ""}`;
									return (
										<SelectItem
											key={lang.id}
											value={lang.id}
											disabled={alreadyAdded}
										>
											{alreadyAdded ? `${label} — Added` : label}
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>
					</div>

					<Button onClick={handleAdd} disabled={addDisabled}>
						Add
					</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Current languages</CardTitle>
				</CardHeader>
				<CardContent>
					{loadingGroup ? (
						<div className="text-sm text-muted-foreground">Loading...</div>
					) : groupLanguages.length === 0 ? (
						<div className="text-sm text-muted-foreground">
							No languages have been added to this group.
						</div>
					) : (
						<div className="flex flex-wrap gap-2">
							{groupLanguages
								.slice()
								.sort((a, b) =>
									String(a.languageName).localeCompare(String(b.languageName)),
								)
								.map((lang) => {
									const label = `${lang.languageName}${lang.languageVersion ? ` (${lang.languageVersion})` : ""}`;
									return (
										<Badge key={lang.id} variant="secondary" className="gap-1">
											<span>{label}</span>
											{canManage ? (
												<Button
													variant="ghost"
													size="icon-sm"
													className="ml-1 h-6 w-6"
													onClick={() => handleRemove(lang.id)}
													disabled={loading}
													title="Remove"
												>
													<X className="h-4 w-4" />
												</Button>
											) : null}
										</Badge>
									);
								})}
						</div>
					)}
				</CardContent>
			</Card>
		</SectionWrapper>
	);
}
