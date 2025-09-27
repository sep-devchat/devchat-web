import styled from "styled-components";

export const HomeWrapper = styled.div`
	max-width: 1280px;
	margin: 0 auto;
	padding: 2rem;
	text-align: center;

	& .logo {
		height: 6em;
		padding: 1.5em;
		will-change: filter;
		transition: filter 300ms;
	}
	& .logo:hover {
		filter: drop-shadow(0 0 2em #646cffaa);
	}
	& .logo.react:hover {
		filter: drop-shadow(0 0 2em #61dafbaa);
	}

	@keyframes logo-spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		a:nth-of-type(2) .logo {
			animation: logo-spin infinite 20s linear;
		}
	}

	& .logo-container {
		display: flex;
		justify-content: center;
	}

	& .toolbar {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 8px;
		gap: 8px;
	}

	& .card {
		padding: 2em;
		display: flex;
		flex-direction: column;
		gap: 16px;

		& button {
			color: #fff;
		}
	}

	& .read-the-docs {
		color: #888;
	}

	/* Intro guide styles */
	& .guide {
		max-width: 900px;
		margin: 32px auto 0;
		text-align: left;
		display: grid;
		gap: 16px;
	}
	& .guide .guide-card {
		/* Solid background instead of gradient */
		background: hsl(var(--card));
		border: 1px solid hsl(var(--border));
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
		border-radius: 12px;
		padding: 16px 18px;
	}
	& .guide .guide-title {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 10px;
	}
	& .guide .guide-title .icon {
		width: 18px;
		height: 18px;
		color: #93c5fd;
	}
	& .guide .guide-title h2 {
		margin: 0;
		/* Solid text color instead of gradient text */
		color: #e5e7eb;
		font-size: 1.1rem;
		font-weight: 700;
	}
	& .guide .pill {
		margin-left: auto;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		background: rgba(99, 102, 241, 0.18);
		border: 1px solid rgba(99, 102, 241, 0.35);
		color: #c7d2fe;
		padding: 2px 8px;
		border-radius: 999px;
	}
	& .guide .callout {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		background: rgba(251, 146, 60, 0.08);
		border: 1px solid rgba(251, 146, 60, 0.35);
		border-left: 4px solid #fb923c;
		border-radius: 10px;
		padding: 12px 14px;
	}
	& .guide .callout .icon {
		width: 18px;
		height: 18px;
		color: #fb923c;
		margin-top: 2px;
	}
	& .guide .grid-2 {
		display: grid;
		grid-template-columns: 1fr;
		gap: 8px 16px;
	}
	@media (min-width: 768px) {
		& .guide .grid-2 {
			grid-template-columns: 1fr 1fr;
		}
	}
	& .guide h2 {
		font-size: 1.25rem;
		line-height: 1.75rem;
		font-weight: 600;
		margin: 8px 0;
	}
	& .guide p {
		color: #e2e8f0;
	}
	& .guide ul {
		list-style: disc;
		padding-left: 1.25rem;
		display: grid;
		gap: 6px;
	}
	& .guide code {
		background: rgba(148, 163, 184, 0.15);
		border: 1px solid rgba(148, 163, 184, 0.25);
		padding: 2px 6px;
		border-radius: 6px;
		font-family:
			ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
			"Courier New", monospace;
		font-size: 0.9em;
	}
	& .guide pre {
		background: #0b1020;
		color: #e5e7eb;
		border: 1px solid rgba(148, 163, 184, 0.25);
		padding: 12px;
		border-radius: 8px;
		overflow-x: auto;
		white-space: pre;
	}
	& .guide a {
		color: #60a5fa;
		text-decoration: underline;
	}
`;
