/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchProfile } from "@/services/auth/authAPI";
import { Profile } from "@/services/auth/auth.type";
import { deleteUser, updateUser } from "@/services/userAPI";
import {
	getAllProgrammingLanguages,
	ProgrammingLanguageResponse,
} from "@/services/programmingLanguagesAPI";
import { toast } from "sonner";
import {
	getUploadSignature,
	directUploadWithSignature,
	saveDirectUpload,
} from "@/services/upload/upload.api";
import type { UploadResult } from "@/services/upload/upload.type";

type AlertType = "success" | "warning" | "error";
export const fireAlert = (
	type: AlertType,
	message: string,
	duration = 4000,
) => {
	if (typeof window === "undefined") return;
	window.dispatchEvent(
		new CustomEvent("app:alert", { detail: { type, message, duration } }),
	);
};

export const useAccountSettings = () => {
	// Inline reset password flow state
	const [showReset, setShowReset] = useState(false);
	const [step, setStep] = useState<1 | 2>(1);
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const [success, setSuccess] = useState<string>("");
	const [cooldown, setCooldown] = useState<number>(0);
	const [codeSent, setCodeSent] = useState<boolean>(false);
	const cooldownTimerRef = useRef<number | null>(null);

	const [original, setOriginal] = useState<Profile | null>(null);
	const [form, setForm] = useState<any>(null);
	const [isDirty, setIsDirty] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [resetKey, setResetKey] = useState(0);

	// Change email/password modals
	const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

	// Delete account modal
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [deleteConfirmText, setDeleteConfirmText] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);

	// User languages state
	const [userLanguages, setUserLanguages] = useState<any[]>([]);
	const [originalLanguages, setOriginalLanguages] = useState<any[]>([]);
	const [availableLanguages, setAvailableLanguages] = useState<
		ProgrammingLanguageResponse[]
	>([]);
	const [newLanguageForms, setNewLanguageForms] = useState<any[]>([]);
	const [editingLanguageId, setEditingLanguageId] = useState<string | null>(
		null,
	);

	// Avatar upload state
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarUploadProgress, setAvatarUploadProgress] = useState<
		number | null
	>(null);

	const profile = useSelector((state: RootState) => state.user.profile);

	useEffect(() => {
		const init = async () => {
			try {
				const res = await fetchProfile();
				const data = res?.data ?? res;
				setOriginal(data);
				setForm(data ? { ...data } : {});

				if (data?.userLanguages) {
					const sortedLanguages = [...data.userLanguages].sort(
						(a: any, b: any) => a.orderIndex - b.orderIndex,
					);
					setUserLanguages(sortedLanguages);
					setOriginalLanguages(JSON.parse(JSON.stringify(sortedLanguages)));
				}
			} catch (err) {
				console.error("fetch profile failed", err);
				fireAlert("error", "Failed to load profile");
			}
		};
		init();

		if (!showReset && cooldownTimerRef.current) {
			window.clearInterval(cooldownTimerRef.current);
			cooldownTimerRef.current = null;
			setCooldown(0);
		}
		return () => {
			if (cooldownTimerRef.current) {
				window.clearInterval(cooldownTimerRef.current);
				cooldownTimerRef.current = null;
			}
		};
	}, [showReset]);

	useEffect(() => {
		const fetchLanguages = async () => {
			try {
				const response = await getAllProgrammingLanguages({ isActive: true });
				if (response && response.data && Array.isArray(response.data)) {
					setAvailableLanguages(response.data);
				} else {
					setAvailableLanguages([]);
				}
			} catch (err) {
				console.error("fetch languages failed", err);
				fireAlert("error", "Failed to load programming languages");
			}
		};
		fetchLanguages();
	}, []);

	const handleFormChange = useCallback(
		(newForm: any) => {
			setForm((prev: any) => {
				if (!prev) return newForm;
				const keys = [
					"firstName",
					"lastName",
					"username",
					"timezone",
					"email",
					"avatarUrl",
				];
				for (const k of keys) {
					if (String(prev[k] ?? "") !== String(newForm[k] ?? "")) {
						return newForm;
					}
				}
				return prev;
			});

			if (!original) {
				setIsDirty(true);
				return;
			}
			const keysToCompare = [
				"firstName",
				"lastName",
				"username",
				"timezone",
				"email",
				"avatarUrl",
			];
			const dirty = keysToCompare.some(
				(k) =>
					String((original as any)[k] ?? "") !== String(newForm?.[k] ?? ""),
			);
			setIsDirty(dirty);
		},
		[original],
	);

	const checkLanguagesDirty = useCallback(() => {
		if (newLanguageForms.length > 0) return true;
		if (userLanguages.length !== originalLanguages.length) return true;

		return userLanguages.some((lang: any, index: number) => {
			const original = originalLanguages[index];
			if (!original) return true;
			return (
				lang.languageId !== original.languageId ||
				lang.proficiencyLevel !== original.proficiencyLevel ||
				lang.orderIndex !== original.orderIndex
			);
		});
	}, [userLanguages, originalLanguages, newLanguageForms]);

	useEffect(() => {
		const languagesDirty = checkLanguagesDirty();
		setIsDirty(() => {
			if (!original || !form) return languagesDirty;
			const keysToCompare = [
				"firstName",
				"lastName",
				"username",
				"timezone",
				"email",
				"avatarUrl",
			];
			const formDirty = keysToCompare.some(
				(k) => String((original as any)[k] ?? "") !== String(form?.[k] ?? ""),
			);
			return formDirty || languagesDirty;
		});
	}, [
		userLanguages,
		originalLanguages,
		newLanguageForms,
		form,
		original,
		checkLanguagesDirty,
	]);

	const handleReset = () => {
		setResetKey((v) => v + 1);
		setForm(original ? { ...original } : {});
		setUserLanguages(JSON.parse(JSON.stringify(originalLanguages)));
		setNewLanguageForms([]);
		setEditingLanguageId(null);
		setAvatarFile(null);
		setAvatarUploadProgress(null);
		setIsDirty(false);
		fireAlert("warning", "Changes reverted");
	};

	const handleCancelFloatingCard = () => {
		handleReset();
	};

	const computeDiff = (orig: any = {}, cur: any = {}) => {
		const diff: any = {};
		Object.keys(cur).forEach((k) => {
			const o = orig[k];
			const c = cur[k];
			if (String(o ?? "") !== String(c ?? "")) diff[k] = c;
		});
		return diff;
	};

	const handleSave = async () => {
		if (!original || !form) return;
		setIsSubmitting(true);

		try {
			setAvatarUploadProgress(null);
			let avatarUrl: string | null = null;

			// Upload avatar if there's a new file
			if (avatarFile) {
				const suggestedPublicId = `${original.id}_avatar_${Date.now()}`;

				// 1) fetch upload signature from backend
				const sig = await getUploadSignature({
					folder: "users/avatars",
					publicId: suggestedPublicId,
				});

				// 2) upload with progress
				const { upload: uploadRes, delivery } =
					(await directUploadWithSignature({
						file: avatarFile,
						signature: sig,
						onProgress: ({ progress }) => {
							setAvatarUploadProgress(Math.round(progress));
						},
						generateDelivery: false,
					})) as { upload: UploadResult; delivery?: { url: string } };

				if (!uploadRes) {
					throw new Error("Upload failed: no upload result returned");
				}

				avatarUrl = uploadRes.secure_url ?? delivery?.url ?? null;

				// Optional: persist metadata to your server
				await saveDirectUpload(uploadRes);

				// ensure progress shows 100
				setAvatarUploadProgress(100);
			}

			const payload = computeDiff(original, form);

			// Add avatar URL to payload if uploaded
			if (avatarUrl) {
				payload.avatarUrl = avatarUrl;
			}

			const allLanguages = [...userLanguages, ...newLanguageForms];
			const hadLanguages = originalLanguages.length > 0;
			if (allLanguages.length > 0 || hadLanguages) {
				payload.userLanguages = allLanguages.map((lang: any) => ({
					languageId: lang.languageId || lang.language?.id,
					proficiencyLevel: lang.proficiencyLevel,
					orderIndex: lang.orderIndex,
				}));
			}

			if (Object.keys(payload).length === 0) {
				toast.warning("No changes to save");
				setIsSubmitting(false);
				return;
			}

			await updateUser(String(original.id), payload);
			const updated = { ...original, ...payload };
			setOriginal(updated as Profile);
			setForm(updated);

			if (payload.userLanguages) {
				setUserLanguages(allLanguages);
				setOriginalLanguages(JSON.parse(JSON.stringify(allLanguages)));
				setNewLanguageForms([]);
			}

			setIsDirty(false);
			setAvatarFile(null);
			setAvatarUploadProgress(null);
			toast.success("Saved changes");
			setResetKey((k) => k + 1);

			const res = await fetchProfile();
			const data = res?.data ?? res;
			setOriginal(data);
			setForm(data);
			if (data?.userLanguages) {
				const sortedLanguages = [...data.userLanguages].sort(
					(a: any, b: any) => a.orderIndex - b.orderIndex,
				);
				setUserLanguages(sortedLanguages);
				setOriginalLanguages(JSON.parse(JSON.stringify(sortedLanguages)));
			}
		} catch (err: any) {
			console.error("save failed", err);
			const statusCode = err?.response?.status;
			const message =
				err?.response?.data?.message ??
				err?.message ??
				"Failed to update profile";

			if (statusCode >= 400 && statusCode < 600) {
				toast.error(`Cannot update: ${message}`);
			} else {
				toast.error(`Save failed: ${message}`);
			}

			// Reset all editing states when save fails
			setNewLanguageForms([]);
			setEditingLanguageId(null);
			setAvatarFile(null);
			setAvatarUploadProgress(null);
			setIsDirty(false);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChangeEmail = async (newEmail: string) => {
		if (!original) return;
		try {
			setIsSubmitting(true);
			await updateUser(String(original.id), { email: newEmail });
			const updated = { ...original, email: newEmail };
			setOriginal(updated as Profile);
			setForm(updated);
			setIsDirty(false);
			setIsEmailModalOpen(false);
			fireAlert("success", "Email updated");
			setResetKey((k) => k + 1);
		} catch (err: any) {
			console.error("change email failed", err);
			fireAlert("error", "Failed to change email");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChangePassword = async (newPassword: string) => {
		if (!original) return;
		try {
			setIsSubmitting(true);
			await updateUser(String(original.id), { password: newPassword });
			setIsPasswordModalOpen(false);
			fireAlert("success", "Password changed");
		} catch (err: any) {
			console.error("change password failed", err);
			fireAlert("error", "Failed to change password");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteAccount = async () => {
		if (!original) return;
		if (deleteConfirmText !== (original.username ?? "")) return;
		setIsDeleting(true);
		try {
			await deleteUser(String(original.id));
			fireAlert("success", "Account deleted");
			setIsDeleteOpen(false);
			window.location.href = "/auth/login";
		} catch (err: any) {
			console.error("delete account failed", err);
			fireAlert("error", "Failed to delete account");
		} finally {
			setIsDeleting(false);
			setDeleteConfirmText("");
		}
	};

	// User languages handlers
	const handleAddLanguage = () => {
		const newId = `temp-${Date.now()}`;
		setNewLanguageForms([
			...newLanguageForms,
			{
				id: newId,
				languageId: "",
				proficiencyLevel: "BEGINNER",
				orderIndex: userLanguages.length + newLanguageForms.length + 1,
			},
		]);
	};

	const handleRemoveNewLanguageForm = (id: string) => {
		setNewLanguageForms(newLanguageForms.filter((form) => form.id !== id));
	};

	const handleNewLanguageChange = (id: string, data: any) => {
		setNewLanguageForms(
			newLanguageForms.map((form) =>
				form.id === id ? { ...form, ...data } : form,
			),
		);
	};

	const handleEditLanguage = (languageId: string) => {
		setEditingLanguageId(languageId);
	};

	const handleCancelEditLanguage = () => {
		setEditingLanguageId(null);
	};

	const applyLanguagePatch = (lang: any, data: any) => {
		const nextLanguageId =
			data.languageId ?? lang.languageId ?? lang.language?.id ?? "";
		const selectedLanguage = availableLanguages.find(
			(languageOption) => languageOption.id === nextLanguageId,
		);
		return {
			...lang,
			...data,
			languageId: nextLanguageId,
			language: selectedLanguage ? { ...selectedLanguage } : lang.language,
		};
	};

	const handleLanguageDraftChange = (id: string, data: any) => {
		setUserLanguages((prev) =>
			prev.map((lang: any) =>
				lang.id === id ? applyLanguagePatch(lang, data) : lang,
			),
		);
	};

	const handleDeleteLanguage = (id: string) => {
		setUserLanguages(userLanguages.filter((lang: any) => lang.id !== id));
	};

	const getAvailableLanguages = (includeLanguageId?: string) => {
		const selectedIds = [
			...userLanguages.map(
				(lang: any) => lang.languageId || lang.language?.id || "",
			),
			...newLanguageForms.map((form) => form.languageId || ""),
		].filter(Boolean);

		return availableLanguages.filter((lang) => {
			if (includeLanguageId && lang.id === includeLanguageId) {
				return true;
			}
			return !selectedIds.includes(lang.id);
		});
	};

	const getUsedOrderIndexes = (excludeId?: string) => {
		const allLanguages = [
			...userLanguages.filter((lang: any) => lang.id !== excludeId),
			...newLanguageForms.filter((form) => form.id !== excludeId),
		];
		return allLanguages.map((lang: any) => lang.orderIndex);
	};

	const getMaxOrderIndex = () => {
		return userLanguages.length + newLanguageForms.length + 1;
	};

	const handleAvatarChange = (file: File) => {
		setAvatarFile(file);
		setIsDirty(true);
	};

	const isGoogleSSO = original
		? String((original as any).method ?? "").toLowerCase() === "google"
		: false;

	const startFlow = () => {
		setShowReset(true);
		setCode("");
		setNewPassword("");
		setConfirmPassword("");
		setLoading(false);
		setError("");
		setSuccess("");
		setCooldown(0);
		setCodeSent(false);
		const userEmail = profile?.email || "";
		setEmail(userEmail);
		if (!userEmail) {
			setError("No email found on your profile.");
			return;
		}
		setStep(1);
	};

	return {
		// States
		original,
		form,
		isDirty,
		isSubmitting,
		resetKey,
		profile,

		// Reset password states
		showReset,
		setShowReset,
		step,
		setStep,
		email,
		setEmail,
		code,
		setCode,
		newPassword,
		setNewPassword,
		confirmPassword,
		setConfirmPassword,
		loading,
		setLoading,
		error,
		setError,
		success,
		setSuccess,
		cooldown,
		setCooldown,
		codeSent,
		setCodeSent,
		cooldownTimerRef,

		// Modal states
		isEmailModalOpen,
		setIsEmailModalOpen,
		isPasswordModalOpen,
		setIsPasswordModalOpen,
		isDeleteOpen,
		setIsDeleteOpen,
		deleteConfirmText,
		setDeleteConfirmText,
		isDeleting,

		// Languages states
		userLanguages,
		originalLanguages,
		availableLanguages,
		newLanguageForms,
		editingLanguageId,

		// Avatar upload states
		avatarUploadProgress,

		// Handlers
		handleFormChange,
		handleReset,
		handleSave,
		handleChangeEmail,
		handleChangePassword,
		handleDeleteAccount,
		handleAddLanguage,
		handleRemoveNewLanguageForm,
		handleNewLanguageChange,
		handleEditLanguage,
		handleCancelEditLanguage,
		handleLanguageDraftChange,
		handleDeleteLanguage,
		getAvailableLanguages,
		getUsedOrderIndexes,
		getMaxOrderIndex,
		handleAvatarChange,
		isGoogleSSO,
		startFlow,
		handleCancelFloatingCard,
	};
};
