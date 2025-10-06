import { post } from "@/services/apiCaller";
import {
	UploadSignatureParams,
	UploadSignatureResponse,
	DeliverySignatureParams,
	DeliverySignatureResponse,
	UploadResult,
	DirectUploadResult,
	ProgressCallback,
} from "./upload.type";

function unwrap<T>(resp: any): T {
	const payload = resp?.data ?? resp;
	return payload as T;
}

export async function getUploadSignature(
	params: UploadSignatureParams,
): Promise<UploadSignatureResponse> {
	const resp = await post<UploadSignatureResponse>(
		"/api/upload/sign-upload",
		params,
	);
	const data = unwrap<UploadSignatureResponse>(resp);
	const required: (keyof UploadSignatureResponse)[] = [
		"cloudName",
		"apiKey",
		"timestamp",
		"signature",
	];
	for (const k of required) {
		if ((data as any)[k] == null) {
			throw new Error(`Upload signature missing field: ${k}`);
		}
	}
	return data;
}

export async function getDeliverySignature(
	params: DeliverySignatureParams,
): Promise<DeliverySignatureResponse> {
	// Normalize single transformation into array if provided
	const body: any = { ...params };
	if (params.transformation && !params.transformations) {
		body.transformations = [params.transformation];
		delete body.transformation;
	}
	const resp = await post<DeliverySignatureResponse>(
		"/api/upload/sign-delivery",
		body,
	);
	const data = unwrap<DeliverySignatureResponse>(resp);
	if (!data.url || !data.publicId)
		throw new Error("Delivery signature missing url or publicId");
	return data;
}

export interface DirectUploadOptions {
	file: File;
	signature: UploadSignatureResponse; // output of getUploadSignature
	onProgress?: ProgressCallback;
	generateDelivery?: boolean | DeliverySignatureParams; // if true, call getDeliverySignature with upload publicId
	deliveryTransform?: (
		base: DeliverySignatureParams,
	) => DeliverySignatureParams; // optional mutator
}

export async function directUploadWithSignature(
	options: DirectUploadOptions,
): Promise<DirectUploadResult> {
	const { file, signature, onProgress, generateDelivery, deliveryTransform } =
		options;
	const form = new FormData();
	form.append("file", file);
	form.append("api_key", signature.apiKey);
	form.append("timestamp", signature.timestamp.toString());
	form.append("signature", signature.signature);
	if (signature.folder) form.append("folder", signature.folder);
	if (signature.public_id) form.append("public_id", signature.public_id);
	if (signature.eager) form.append("eager", signature.eager);

	const endpoint = `https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`;
	const xhr = new XMLHttpRequest();
	const uploadPromise: Promise<UploadResult> = new Promise(
		(resolve, reject) => {
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status >= 200 && xhr.status < 300) {
						try {
							resolve(JSON.parse(xhr.responseText));
						} catch (e) {
							reject(e);
						}
					} else {
						reject(new Error(`Upload failed ${xhr.status}`));
					}
				}
			};
			xhr.onerror = () => reject(new Error("Network error during upload"));
			if (onProgress) {
				xhr.upload.onprogress = (ev) => {
					if (ev.lengthComputable) {
						onProgress({
							progress: Math.round((ev.loaded / ev.total) * 100),
							loaded: ev.loaded,
							total: ev.total,
						});
					}
				};
			}
			xhr.open("POST", endpoint);
			xhr.send(form);
		},
	);

	const upload = await uploadPromise;

	let delivery: DeliverySignatureResponse | undefined;
	if (generateDelivery) {
		let base: DeliverySignatureParams;
		if (generateDelivery === true) {
			base = { publicId: upload.public_id, transformations: [] };
		} else {
			base = { ...generateDelivery, publicId: upload.public_id };
		}
		if (deliveryTransform) base = deliveryTransform(base);
		delivery = await getDeliverySignature(base);
	}

	return { upload, delivery };
}
