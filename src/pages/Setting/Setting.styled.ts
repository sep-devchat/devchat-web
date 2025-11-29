import styled from "styled-components";

export const Card = styled.div<{ isDirty?: boolean }>`
	background: rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(10px);
	overflow: hidden;
	min-height: 100vh;
	padding-bottom: ${(props) => (props.isDirty ? "4.375rem" : "0rem")};

	@media (min-width: 1440px) {
		padding-bottom: ${(props) => (props.isDirty ? "3.5rem" : "0rem")};
	}

	@media (max-width: 1220px) {
		padding-bottom: ${(props) => (props.isDirty ? "3.0625rem" : "0rem")};
	}

	@media (min-width: 1920px) {
		padding-bottom: ${(props) => (props.isDirty ? "4.375rem" : "0rem")};
	}
`;

export const CardHeader = styled.div`
	padding: 1.5rem;
	border-bottom: 1px solid #f3f4f6;

	@media (min-width: 1440px) {
		padding: 1.2rem;
	}

	@media (min-width: 1920px) {
		padding: 1.5rem;
	}

	@media (max-width: 1220px) {
		padding: 1.05rem;
	}
`;

export const CardTitle = styled.h2`
	font-size: 1.25rem;
	font-weight: 600;
	color: #1a1a1a;
	margin-bottom: 0.5rem;

	@media (max-width: 1220px) {
		font-size: 14.5px;
		margin-bottom: 5px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 15.5px;
		margin-bottom: 8px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
		margin-bottom: 10px;
	}
`;

export const CardDescription = styled.p`
	color: #666666;
	font-size: 1rem;

	@media (max-width: 1220px) {
		font-size: 12.5px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13.5px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
`;

export const CardContent = styled.div`
	padding: 1.5rem;

	@media (min-width: 1440px) {
		padding: 1.2rem;
	}

	@media (max-width: 1220px) {
		padding: 1.05rem;
	}
`;

export const AvatarImg = styled.img`
	width: 4rem;
	height: 4rem;
	border-radius: 50%;
	object-fit: cover;
	display: block;

	@media (min-width: 1440px) {
		width: 3.2rem;
		height: 3.2rem;
	}

	@media (max-width: 1220px) {
		width: 2.8rem;
		height: 2.8rem;
	}
`;

export const NoAvatar = styled.div`
	text-align: center;
	color: var(--muted-foreground, #6b7280);
`;
