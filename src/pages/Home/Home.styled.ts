import styled from "styled-components";

export const HomeWrapper = styled.div`
	max-width: 1400px;
	margin: 0 auto;
	padding: 3rem 1.5rem 5rem;
	display: flex;
	flex-direction: column;
	gap: 4rem;

	.toolbar {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
	}

	.hero {
		display: grid;
		gap: 1.75rem;
		align-items: stretch;
	}

	@media (min-width: 992px) {
		.hero {
			grid-template-columns: 3fr 2fr;
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

	.badge-icon {
		width: 14px;
		height: 14px;
	}

	.hero h1 {
		font-size: clamp(2rem, 4vw, 3.2rem);
		line-height: 1.15;
		margin: 0;
	}

	.hero p {
		font-size: 1.05rem;
		color: hsl(var(--muted-foreground));
	}

	.cta-group {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.hero-metrics {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.metric {
		border: 1px solid hsl(var(--border));
		border-radius: 16px;
		padding: 1rem;
		text-align: left;
		background: hsl(var(--background));
	}

	.metric-value {
		display: block;
		font-size: 1.75rem;
		font-weight: 700;
	}

	.metric-label {
		color: hsl(var(--muted-foreground));
		font-size: 0.9rem;
	}

	.hero-visual {
		position: relative;
		border-radius: 32px;
		min-height: 380px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		overflow: hidden;
	}

	.hero-visual img {
		max-width: 100%;
		object-fit: contain;
		filter: drop-shadow(0 20px 35px rgba(0, 0, 0, 0.35));
		position: relative;
		z-index: 1;
	}

	.visual-blob {
		position: absolute;
		width: 320px;
		height: 320px;
		filter: blur(5px);
		top: 20%;
		left: 10%;
		z-index: 0;
	}

	.feature-grid {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		text-align: left;
	}

	.feature-grid header h2 {
		margin: 0;
		font-size: 2rem;
		font-weight: 600;
	}

	.feature-grid header p {
		color: hsl(var(--muted-foreground));
	}

	.feature-grid .grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1.25rem;
	}

	.feature-card {
		position: relative;
		border-radius: 24px;
		padding: 1.75rem 1.5rem;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.25);
		box-shadow: 0 30px 50px rgba(15, 23, 42, 0.35);
		backdrop-filter: blur(18px);
		-webkit-backdrop-filter: blur(18px);
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow: hidden;
	}

	.feature-card::before {
		content: "";
		position: absolute;
		height: 220px;
		width: 220px;
		background: radial-gradient(
			circle,
			rgba(99, 102, 241, 0.35),
			transparent 65%
		);
		filter: blur(10px);
		bottom: -60px;
		right: -50px;
		pointer-events: none;
	}

	.feature-card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}

	.feature-badge {
		font-size: 0.7rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(248, 250, 252, 0.85);
		background: rgba(59, 130, 246, 0.3);
		padding: 0.2rem 0.65rem;
		border-radius: 999px;
		border: 1px solid rgba(96, 165, 250, 0.6);
	}

	.feature-index {
		font-size: 0.75rem;
		color: rgba(226, 232, 240, 0.8);
		letter-spacing: 0.12em;
	}

	.feature-icon-ring {
		width: 64px;
		height: 64px;
		border-radius: 20px;
		background: rgba(15, 23, 42, 0.45);
		border: 1px solid rgba(255, 255, 255, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: inset 0 0 20px rgba(99, 102, 241, 0.45);
	}

	.feature-icon {
		width: 26px;
		height: 26px;
		color: #c7d2fe;
	}

	.feature-card-body {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.feature-card-body h3 {
		margin: 0;
		font-size: 1.4rem;
		color: #0f172a;
	}

	.feature-card-body p {
		margin: 0;
		color: rgba(30, 41, 59, 0.8);
	}

	.workflow-header p {
		color: hsl(var(--muted-foreground));
	}

	.workflow {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.workflow-steps {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
	}

	.workflow-step {
		border-radius: 20px;
		padding: 1.5rem;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(148, 163, 184, 0.3);
		box-shadow: 0 20px 45px rgba(15, 23, 42, 0.28);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}

	.workflow-step-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.workflow-header h2 {
		margin: 0;
		font-size: 2rem;
		font-weight: 600;
	}

	.step-index {
		font-size: 0.85rem;
		color: rgba(30, 64, 175, 0.85);
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.step-label {
		font-size: 0.75rem;
		color: rgba(30, 64, 175, 0.65);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.workflow-step-body h3 {
		margin: 0;
		font-size: 1.25rem;
		color: #0f172a;
	}

	.workflow-step-body p {
		margin: 0;
		color: rgba(30, 41, 59, 0.8);
	}

	.integration-strip {
		border: 1px solid hsl(var(--border));
		border-radius: 999px;
		padding: 0.75rem 1.5rem;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
		background: hsl(var(--card));
	}

	.strip-label {
		font-weight: 500;
	}

	.strip-items {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.strip-items span {
		padding: 0.35rem 0.85rem;
		border-radius: 999px;
		border: 1px solid hsl(var(--border));
		font-size: 0.85rem;
	}

	.cta-panel {
		border-radius: 24px;
		padding: 2rem;
		background: linear-gradient(
			120deg,
			rgba(59, 130, 246, 0.3),
			rgba(14, 165, 233, 0.25)
		);
		border: 1px solid rgba(59, 130, 246, 0.4);
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	@media (min-width: 768px) {
		.cta-panel {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	}

	.cta-panel h2 {
		margin: 0 0 0.5rem;
		font-size: 1.9rem;
	}

	.cta-panel p {
		margin: 0;
		color: hsl(var(--muted-foreground));
	}

	.cta-panel-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: flex-start;
	}

	.site-footer {
		border-top: 1px solid rgba(148, 163, 184, 0.25);
		padding-top: 3rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.footer-brand {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: space-between;
	}

	@media (min-width: 768px) {
		.footer-brand {
			flex-direction: row;
			align-items: center;
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
