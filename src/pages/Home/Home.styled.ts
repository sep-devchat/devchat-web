import styled from "styled-components";

export const HomeWrapper = styled.div`
	max-width: 1400px;
	margin: 0 auto;
	padding: 3rem 1.5rem 5rem;
	display: flex;
	flex-direction: column;
	gap: 4rem;
	min-height: calc(100vh - 4rem);
	justify-content: center;

	.toolbar {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
	}

	.hero {
		width: 100%;
		display: grid;
		gap: 1.75rem;
		align-items: center;
		justify-items: center;
	}

	@media (min-width: 992px) {
		.hero {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.hero-content {
		background: linear-gradient(
			145deg,
			hsl(var(--card)) 0%,
			rgba(99, 102, 241, 0.15) 100%
		);
		border: 1px solid hsl(var(--border));
		border-radius: 24px;
		padding: 2rem;
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		width: fit-content;
		padding: 0.35rem 0.75rem;
		border-radius: 999px;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		background: rgba(99, 102, 241, 0.15);
		border: 1px solid rgba(99, 102, 241, 0.35);
	}

	.hero-visual {
		position: relative;
		border-radius: 32px;
		min-height: 460px;
		width: min(560px, 95vw);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem;
		overflow: hidden;
		animation: heroOrbit 18s ease-in-out infinite;
	}

	.hero-visual img {
		width: 120%;
		object-fit: contain;
		filter: drop-shadow(0 30px 45px rgba(15, 23, 42, 0.45));
		position: relative;
		z-index: 1;
		animation: heroFloat 7s ease-in-out infinite;
	}

	.visual-blob {
		position: absolute;
		width: 400px;
		height: 400px;
		filter: blur(18px);
		top: 12%;
		left: 4%;
		z-index: 0;
		background: radial-gradient(
			circle,
			rgba(59, 130, 246, 0.45),
			transparent 65%
		);
		animation: blobPulse 12s linear infinite;
	}

	@keyframes heroFloat {
		0% {
			transform: translateY(0) scale(1);
		}
		50% {
			transform: translateY(-18px) scale(1.05);
		}
		100% {
			transform: translateY(0) scale(1);
		}
	}

	@keyframes heroOrbit {
		0% {
			transform: rotate3d(0, 0, 1, 0deg) scale(1);
		}
		50% {
			transform: rotate3d(0, 1, 0, 3deg) scale(1.02);
		}
		100% {
			transform: rotate3d(0, 0, 1, 0deg) scale(1);
		}
	}

	@keyframes blobPulse {
		0% {
			transform: translate(0, 0) scale(0.95);
			opacity: 0.7;
		}
		50% {
			transform: translate(12px, -16px) scale(1.05);
			opacity: 0.4;
		}
		100% {
			transform: translate(0, 0) scale(0.95);
			opacity: 0.7;
		}
	}

	.footer-logo {
		font-size: 1.4rem;
		font-weight: 700;
		margin: 0;
	}

	.footer-tagline {
		margin: 0.25rem 0 0;
		color: hsl(var(--muted-foreground));
		max-width: 380px;
	}

	.footer-columns {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 1.5rem;
	}

	.footer-column {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.column-title {
		font-weight: 600;
		margin: 0 0 0.4rem;
		font-size: 0.8rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(148, 163, 184, 0.9);
	}

	.footer-column ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.footer-column a {
		align-self: flex-start;
		display: inline-flex;
		padding: 0.2rem 0.35rem;
		color: hsl(var(--foreground));
		font-size: 1rem;
		font-weight: 500;
		line-height: 1.4;
		border-radius: 10px;
		transition:
			color 0.2s ease,
			background-color 0.2s ease,
			transform 0.2s ease;
	}

	.footer-column a:hover {
		color: hsl(var(--primary));
		background: rgba(148, 163, 184, 0.12);
		transform: translateX(4px);
	}

	.footer-bottom {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding-top: 1rem;
		border-top: 1px solid rgba(148, 163, 184, 0.2);
	}

	@media (min-width: 640px) {
		.footer-bottom {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	}

	.footer-links {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}
`;
