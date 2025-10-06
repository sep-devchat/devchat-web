export interface UploadSignatureParams {
	folder?: string;
	publicId?: string;
	eager?: string[];
	invalidate?: boolean;
}

export interface UploadSignatureResponse {
	cloudName: string;
	apiKey: string;
	timestamp: number;
	signature: string;
	folder?: string;
	public_id?: string;
	eager?: string;
}
/**
 * Cloudinary transformation options
 * Read more: https://cloudinary.com/documentation/image_transformations#available_image_transformations
 */
export interface TransformationObject {
	width?: number;
	height?: number;
	crop?: string;
	gravity?: string;
	effect?: string;
	[k: string]: any;
}

export interface DeliverySignatureParams {
	publicId: string;
	transformation?: TransformationObject;
	transformations?: TransformationObject[];
	format?: string;
}

export interface DeliverySignatureResponse {
	url: string;
	publicId: string;
}

export interface UploadResult {
	secure_url: string;
	public_id: string;
	bytes: number;
	width: number;
	height: number;
	format: string;
	resource_type: string;
	[k: string]: any;
}

export interface DirectUploadResult {
	upload: UploadResult;
	delivery?: DeliverySignatureResponse;
}

export interface ProgressCallbackPayload {
	progress: number; // 0-100
	loaded: number;
	total: number;
}

export type ProgressCallback = (data: ProgressCallbackPayload) => void;
