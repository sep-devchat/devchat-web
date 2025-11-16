import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import {
	getUploadSignature,
	getDeliverySignature,
	directUploadWithSignature,
	saveDirectUpload,
} from "@/services/upload/upload.api";
import type {
	UploadSignatureResponse,
	DeliverySignatureResponse,
	UploadResult,
} from "@/services/upload/upload.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/test/upload-file")({
	component: RouteComponent,
});

// Types imported from upload.type

function RouteComponent() {
	// Inputs
	const [publicId, setPublicId] = React.useState("");
	const [width, setWidth] = React.useState<number | "">(256);
	const [height, setHeight] = React.useState<number | "">(256);
	const [format, setFormat] = React.useState("webp");
	const [extraEffect, setExtraEffect] = React.useState("sharpen");

	// File handling
	const [file, setFile] = React.useState<File | null>(null);
	const [preview, setPreview] = React.useState<string | null>(null);

	// States
	const [uploading, setUploading] = React.useState(false);
	const [progress, setProgress] = React.useState(0);
	const [result, setResult] = React.useState<UploadResult | null>(null);
	const [signedUrl, setSignedUrl] = React.useState<string | null>(null);
	const [loadingDelivery, setLoadingDelivery] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [stage, setStage] = React.useState<
		"idle" | "staged" | "uploading" | "uploaded"
	>("idle");
	const [persisting, setPersisting] = React.useState(false);
	const [persisted, setPersisted] = React.useState<null | boolean>(null);

	React.useEffect(() => {
		if (!file) {
			setPreview(null);
			return;
		}
		const url = URL.createObjectURL(file);
		setPreview(url);
		return () => URL.revokeObjectURL(url);
	}, [file]);

	const handleSelect: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const f = e.target.files?.[0];
		if (f) {
			setFile(f);
			setResult(null);
			setSignedUrl(null);
			setError(null);
			setProgress(0);
			setStage("staged");
			if (!publicId) {
				// generate a simple tentative publicId (optional)
				const base = f.name.replace(/\.[^.]+$/, "");
				setPublicId(`${base}_${Date.now()}`);
			}
			// Auto-detect format from filename or MIME type
			try {
				const nameExt = f.name.split(".").pop()?.toLowerCase() || "";
				let detected: string | undefined;
				if (nameExt) {
					// Normalize common extensions
					if (["jpeg", "jfif", "pjpeg"].includes(nameExt)) detected = "jpg";
					else if (nameExt === "svg") detected = "svg";
					else if (nameExt === "tif") detected = "tiff";
					else if (["mpg"].includes(nameExt)) detected = "mpeg";
					else detected = nameExt;
				} else if (f.type) {
					const mimePart = f.type.split("/")[1]?.toLowerCase();
					if (mimePart) {
						if (mimePart.startsWith("jpeg")) detected = "jpg";
						else if (mimePart.includes("svg")) detected = "svg";
						else if (mimePart === "quicktime") detected = "mov";
						else detected = mimePart;
					}
				}
				// Only set if we recognized something and it's different
				if (detected && detected.length <= 10 && detected !== format) {
					setFormat(detected);
				}
			} catch {
				// ignore detection errors silently
			}
		}
	};

	async function fetchUploadSignature(): Promise<UploadSignatureResponse> {
		return getUploadSignature({
			folder: "devchat/demo",
			publicId: publicId || undefined,
		});
	}

	async function fetchDeliverySignature(
		targetPublicId: string,
	): Promise<DeliverySignatureResponse> {
		const transformations = [
			{
				width: width || undefined,
				height: height || undefined,
				crop: "fill",
				gravity: "auto",
			},
		] as any[];
		if (extraEffect.trim())
			transformations.push({ effect: extraEffect.trim() });
		return getDeliverySignature({
			publicId: targetPublicId,
			transformations,
			format: format || undefined,
		});
	}

	async function handleConfirmUpload() {
		if (!file || stage !== "staged") return;
		setError(null);
		setSignedUrl(null);
		setUploading(true);
		setStage("uploading");
		setResult(null);
		try {
			const sig = await fetchUploadSignature();
			const { upload: uploadRes, delivery } = await directUploadWithSignature({
				file,
				signature: sig,
				onProgress: ({ progress }) => setProgress(progress),
				generateDelivery: true,
				deliveryTransform: (base) => {
					const transformations = [
						{
							width: width || undefined,
							height: height || undefined,
							crop: "fill",
							gravity: "auto",
						},
					] as any[];
					if (extraEffect.trim())
						transformations.push({ effect: extraEffect.trim() });
					return { ...base, transformations, format: format || undefined };
				},
			});
			setResult(uploadRes);
			setPublicId(uploadRes.public_id);
			setStage("uploaded");
			if (delivery) setSignedUrl(delivery.url);
			// Persist metadata
			setPersisting(true);
			const ok = !!(await saveDirectUpload(uploadRes));
			setPersisted(ok);
			setPersisting(false);
		} catch (e: any) {
			console.error("Upload error", e);
			setError(e?.message || "Unknown error during upload");
			setStage("staged");
		} finally {
			setUploading(false);
		}
	}

	// Removed existing-asset manual sign form per request

	function simulateStyle(): React.CSSProperties | undefined {
		if (!preview) return undefined;
		const filters: string[] = [];
		if (/^grayscale$/i.test(extraEffect.trim())) filters.push("grayscale(1)");
		const blurMatch = extraEffect.match(/^blur:(\d{1,4})$/);
		if (blurMatch) {
			const px = Math.min(Number(blurMatch[1]) / 15, 40); // scale down large cloudinary blur to reasonable CSS blur
			filters.push(`blur(${px.toFixed(1)}px)`); // approximate
		}
		// sharpen not simulated; other effects ignored
		const style: React.CSSProperties = {
			objectFit: "cover",
			maxHeight: "13rem",
			...(width ? { width: width + "px" } : {}),
			...(height ? { height: height + "px" } : {}),
			...(filters.length ? { filter: filters.join(" ") } : {}),
		};
		return style;
	}

	function canConfirm() {
		return stage === "staged" && !!file && !uploading;
	}

	async function refreshSignedUrl() {
		if (!publicId || stage !== "uploaded") return;
		setLoadingDelivery(true);
		setError(null);
		try {
			const delivery = await fetchDeliverySignature(publicId);
			setSignedUrl(delivery.url);
		} catch (e: any) {
			setError(e.message || "Unknown error");
		} finally {
			setLoadingDelivery(false);
		}
	}

	return (
		<div className="mx-auto max-w-3xl p-6 flex flex-col gap-8">
			<h1 className="text-2xl font-semibold">
				Cloudinary Upload + Signed Delivery URL Generator
			</h1>

			<section className="grid gap-8">
				{/* Stage & Confirm Upload */}
				<Card className="bg-white/40 backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="text-base">
							1. Stage Asset (No Upload Yet)
						</CardTitle>
						<CardDescription className="text-[11px] leading-relaxed">
							Select a file and tweak transformations locally. Preview is
							simulated (not Cloudinary-accurate for all effects). Click{" "}
							<strong>Confirm Upload & Sign</strong> to perform the signed
							upload and generate a real delivery URL.
						</CardDescription>
						{persisting && (
							<p className="text-[10px] text-gray-500">Persisting metadata…</p>
						)}
						{persisted === true && !persisting && (
							<p className="text-[10px] text-emerald-600">
								Metadata saved to server ✔
							</p>
						)}
						{persisted === false && !persisting && (
							<p className="text-[10px] text-amber-600">
								Metadata not saved (offline/server issue).
							</p>
						)}
					</CardHeader>
					<CardContent className="space-y-5">
						<div>
							<Label htmlFor="file" className="text-xs font-medium">
								File
							</Label>
							<Input
								id="file"
								type="file"
								accept="image/*,video/*"
								disabled={uploading}
								onChange={handleSelect}
								className="mt-1 cursor-pointer"
							/>
						</div>
						{preview && (
							<div className="flex flex-col gap-2">
								<p className="text-xs text-gray-500 flex items-center gap-2">
									Simulated Preview{" "}
									{extraEffect && (
										<span className="italic text-[10px] text-gray-400">
											[{extraEffect} (approx)]
										</span>
									)}{" "}
									{stage === "uploaded" && (
										<span className="text-emerald-600 font-medium">
											• Uploaded
										</span>
									)}
								</p>
								{file?.type.startsWith("video/") ? (
									<video
										src={preview}
										className="max-h-52 rounded border"
										controls
									/>
								) : (
									<div
										className="relative border rounded bg-white/40 p-2 flex items-center justify-center"
										style={{
											width: width ? width : undefined,
											height: height ? height : undefined,
										}}
									>
										<img
											src={preview}
											alt="preview"
											className="rounded object-cover"
											style={simulateStyle()}
										/>
									</div>
								)}
							</div>
						)}
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-1">
								<Label htmlFor="width">Width</Label>
								<Input
									id="width"
									type="number"
									value={width}
									onChange={(e) =>
										setWidth(e.target.value ? Number(e.target.value) : "")
									}
									placeholder="auto"
									min={1}
								/>
							</div>
							<div className="flex flex-col gap-1">
								<Label htmlFor="height">Height</Label>
								<Input
									id="height"
									type="number"
									value={height}
									onChange={(e) =>
										setHeight(e.target.value ? Number(e.target.value) : "")
									}
									placeholder="auto"
									min={1}
								/>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-1">
								<Label htmlFor="format">Format</Label>
								<Input
									id="format"
									value={format}
									onChange={(e) => setFormat(e.target.value)}
									placeholder="webp/jpg/png"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<Label htmlFor="effect">Effect</Label>
								<Input
									id="effect"
									value={extraEffect}
									onChange={(e) => setExtraEffect(e.target.value)}
									placeholder="sharpen / blur:300 / grayscale"
								/>
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<Label htmlFor="publicId">(Optional) Desired Public ID</Label>
							<Input
								id="publicId"
								value={publicId}
								onChange={(e) => setPublicId(e.target.value)}
								placeholder="devchat/demo/my_asset"
							/>
						</div>
						<div className="flex flex-wrap gap-3 items-center">
							<Button onClick={handleConfirmUpload} disabled={!canConfirm()}>
								{uploading
									? "Uploading…"
									: stage === "uploaded"
										? "Re-upload"
										: "Confirm Upload & Sign"}
							</Button>
							{stage === "uploaded" && (
								<Button
									variant="secondary"
									size="sm"
									onClick={refreshSignedUrl}
									disabled={loadingDelivery}
								>
									Refresh Signed URL
								</Button>
							)}
							{stage === "staged" && (
								<span className="text-[11px] text-gray-500">
									Ready to upload
								</span>
							)}
							{stage === "uploading" && (
								<span className="text-[11px] text-blue-600">Uploading…</span>
							)}
						</div>
						{uploading && (
							<div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
								<div
									className="h-full bg-blue-500 transition-all"
									style={{ width: `${progress}%` }}
								/>
							</div>
						)}
						{result && (
							<div className="text-xs space-y-1">
								<p className="font-medium">Upload Complete</p>
								<p>Public ID: {result.public_id}</p>
								<p>
									Original URL:{" "}
									<a
										href={result.secure_url}
										className="text-blue-600 underline"
										target="_blank"
										rel="noreferrer"
									>
										open
									</a>
								</p>
								<p>
									{(result.bytes / 1024).toFixed(1)} KB • {result.width}x
									{result.height} • {result.format}
								</p>
							</div>
						)}
					</CardContent>
					<CardFooter className="pt-0" />
				</Card>
			</section>

			{/* Signed URL Preview */}
			{(loadingDelivery || signedUrl) && (
				<Card className="bg-white/50 backdrop-blur-sm">
					<CardHeader className="py-4">
						<CardTitle className="text-sm">Signed Delivery Result</CardTitle>
						{loadingDelivery && (
							<CardDescription className="text-[11px]">
								Generating signed URL…
							</CardDescription>
						)}
					</CardHeader>
					{signedUrl && (
						<CardContent className="pt-0 text-xs space-y-2">
							<p className="break-all">
								<span className="font-medium">URL:</span>{" "}
								<a
									href={signedUrl}
									target="_blank"
									rel="noreferrer"
									className="text-blue-600 underline"
								>
									{signedUrl}
								</a>
							</p>
							{signedUrl.match(/image\/upload/) && (
								<img
									src={signedUrl}
									alt="signed transformation"
									className="max-h-72 rounded border object-contain bg-white/60 p-2"
								/>
							)}
						</CardContent>
					)}
				</Card>
			)}

			{error && <p className="text-sm text-red-600">{error}</p>}
			{/* Guide / Workflow Explanation */}
			<Card className="text-xs text-gray-600 leading-relaxed space-y-3 bg-white/40">
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-semibold text-gray-700">
						Deferred Workflow Cheat‑Sheet
					</CardTitle>
				</CardHeader>
				<CardContent className="pt-0 space-y-3">
					<ol className="list-decimal list-inside space-y-1">
						<li>
							<span className="font-medium">Stage</span>: Pick a file. Temporary
							object URL; adjust width/height/effect locally (no network). State
							→ <code>staged</code>.
						</li>
						<li>
							<span className="font-medium">Sign + Upload</span>:{" "}
							<em>Confirm Upload & Sign</em> → backend{" "}
							<code>/upload/cloudinary/sign-upload</code> → direct XHR upload.
						</li>
						<li>
							<span className="font-medium">Auto Delivery Sign</span>:
							Immediately call <code>/upload/cloudinary/sign-delivery</code>.
							State → <code>uploaded</code>.
						</li>
						<li>
							<span className="font-medium">Iterate</span>: Adjust transforms &{" "}
							<em>Refresh Signed URL</em> (no re-upload unless file changes).
						</li>
					</ol>
					<div className="space-y-1">
						<p className="font-medium">State Machine:</p>
						<p>
							<code>idle → staged → uploading → uploaded</code> (selecting a new
							file after upload returns to <code>staged</code>).
						</p>
					</div>
					<div className="space-y-1">
						<p className="font-medium">Network Calls:</p>
						<ul className="list-disc list-inside space-y-0.5">
							<li>No calls while staging.</li>
							<li>
								<code>sign-upload</code> just before XHR.
							</li>
							<li>XHR emits progress events → progress bar.</li>
							<li>
								<code>sign-delivery</code> auto + on each refresh.
							</li>
						</ul>
					</div>
					<div className="space-y-1">
						<p className="font-medium">Transforms:</p>
						<ul className="list-disc list-inside space-y-0.5">
							<li>Blank width/height omitted → Cloudinary decides.</li>
							<li>
								Effects: <code>sharpen</code>, <code>grayscale</code>,{" "}
								<code>blur:300</code>. (Only grayscale/blur partially
								simulated.)
							</li>
							<li>
								Format: <code>webp</code>, <code>png</code>, <code>jpg</code>,
								etc — omit to keep original.
							</li>
						</ul>
					</div>
					<div className="space-y-1">
						<p className="font-medium">Simulation Limits:</p>
						<p>
							Local preview approximates crop + simple effects. Real delivery
							may vary (esp. sharpen / complex chains).
						</p>
					</div>
					<div className="space-y-1">
						<p className="font-medium">Re-upload vs Refresh:</p>
						<ul className="list-disc list-inside space-y-0.5">
							<li>
								<em>Re-upload</em>: new signature + new file upload.
							</li>
							<li>
								<em>Refresh</em>: only delivery re-sign (no file transfer).
							</li>
						</ul>
					</div>
					<p className="text-[11px] text-gray-500">
						Tip: Changing Public ID pre-upload changes final Cloudinary path;
						after upload we lock to returned <code>public_id</code>.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
