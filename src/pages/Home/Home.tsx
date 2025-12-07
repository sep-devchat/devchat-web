import { HomeWrapper } from "./Home.styled";
import { useDocumentTitle } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageSquare, Bot, ShieldCheck, Code2 } from "lucide-react";
import MainBg from "@/components/custom/MainBackground/MainBg";
import heroVisual from "@/assets/image/laptop-chat-3d-icon-png-download.png";
import { useNavigate } from "@tanstack/react-router";

const featureHighlights = [
	{
		title: "Conversation-first coding",
		description:
			"Spin up threaded discussions for every task. Decisions, snippets, and timelines stay linked to the exact conversation they came from.",
		icon: MessageSquare,
		badge: "Teams",
	},
	{
		title: "Multi-engine AI copilots",
		description:
			"Blend OpenAI, Azure OpenAI, and self-hosted models in one workspace. Route prompts automatically to the right engine.",
		icon: Bot,
		badge: "AI",
	},
	{
		title: "Secure code execution",
		description:
			"Run code blocks in ephemeral sandboxes, capture logs, and turn one-off fixes into reusable runbooks in seconds.",
		icon: Code2,
		badge: "DevOps",
	},
	{
		title: "Enterprise guardrails",
		description:
			"Role-based spaces, message retention controls, and audit-ready exports help you keep AI collaboration compliant.",
		icon: ShieldCheck,
		badge: "Security",
	},
];

const workflowSteps = [
	{
		title: "Capture context",
		description:
			"Record requirements, attach designs, and pin related repos so teammates land inside the full story, not an empty chat box.",
	},
	{
		title: "Co-build with AI",
		description:
			"Mention @AI for research, quick diffs, or test plans. DevChat stores every prompt, output, and code block for instant reuse.",
	},
	{
		title: "Ship with confidence",
		description:
			"Hand off verified snippets to IDE extensions, merge via your existing CI, and keep leadership briefed with automatic digests.",
	},
];

const heroMetrics = [
	{ value: "38%", label: "Faster code reviews" },
	{ value: "12k", label: "Engineers online weekly" },
	{ value: "4.9/5", label: "Developer satisfaction" },
];
const desktopDownloadUrl =
	"https://github.com/sep-devchat/devchat-web-electron/releases/download/v1.0.1/DevChat-1.0.1.Setup.exe";
const footerNav = [
	{
		title: "Product",
		items: ["Why DevChat", "Security", "Templates", "Pricing"],
	},
	{
		title: "Resources",
		items: ["Docs", "API", "Community", "Support"],
	},
	{
		title: "Company",
		items: ["About", "Careers", "Blog", "Contact"],
	},
];

const Home = () => {
	useDocumentTitle("DevChat — AI workspace for product engineers");

	const navigate = useNavigate();
	const currentYear = new Date().getFullYear();

	const redirectToApp = () => {
		navigate({ to: "/chat/friend" });
	};

	const downloadDesktopApp = () => {
		window.open(desktopDownloadUrl, "_blank");
	};

	return (
		<>
			<MainBg />

			<HomeWrapper>
				<section className="hero">
					<div className="hero-content">
						<span className="hero-badge">
							<Sparkles className="badge-icon" />
							Multi-engine AI workspace
						</span>
						<h1>Ship AI-native features without leaving the conversation.</h1>
						<p>
							DevChat is the collaboration hub where PMs, engineers, and AI work
							in lockstep. Keep customer threads, code experiments, and
							deployment updates in one secure canvas.
						</p>
						<div className="cta-group">
							<Button size="lg" onClick={redirectToApp}>
								Open DevChat in browser
							</Button>
							<Button size="lg" variant="outline" onClick={downloadDesktopApp}>
								Download desktop app
							</Button>
						</div>
						<div className="hero-metrics">
							{heroMetrics.map((metric) => (
								<div className="metric" key={metric.label}>
									<span className="metric-value">{metric.value}</span>
									<span className="metric-label">{metric.label}</span>
								</div>
							))}
						</div>
					</div>
					<div className="hero-visual" aria-hidden="true">
						<div className="visual-blob" />
						<img src={heroVisual} alt="DevChat laptop preview" />
					</div>
				</section>

				<section className="feature-grid">
					<header>
						<h2>Made for multi-disciplinary product teams</h2>
						<p>
							Whether you are coaching an AI agent, triaging bugs, or preparing
							a release brief, DevChat keeps every stakeholder aligned.
						</p>
					</header>
					<div className="grid">
						{featureHighlights.map((feature, index) => {
							const Icon = feature.icon;
							return (
								<article className="feature-card" key={feature.title}>
									<div className="feature-card-header">
										<span className="feature-badge">{feature.badge}</span>
										<span className="feature-index">0{index + 1}</span>
									</div>
									<div className="feature-icon-ring">
										<Icon className="feature-icon" />
									</div>
									<div className="feature-card-body">
										<h3>{feature.title}</h3>
										<p>{feature.description}</p>
									</div>
								</article>
							);
						})}
					</div>
				</section>

				<section className="workflow">
					<div className="workflow-header">
						<h2>Bring clarity to every launch</h2>
						<p>
							DevChat keeps the full lifecycle together: context, AI prompts,
							runnable code, and executive updates.
						</p>
					</div>
					<div className="workflow-steps">
						{workflowSteps.map((step, index) => (
							<article className="workflow-step" key={step.title}>
								<div className="workflow-step-header">
									<span className="step-index">0{index + 1}</span>
									<span className="step-label">Stage</span>
								</div>
								<div className="workflow-step-body">
									<h3 className="font-medium">{step.title}</h3>
									<p>{step.description}</p>
								</div>
							</article>
						))}
					</div>
				</section>

				<section className="cta-panel">
					<div>
						<h2>Ready to build a smarter team room?</h2>
						<p>
							Launch DevChat in your browser to explore templates, or invite the
							team to a shared workspace in minutes.
						</p>
					</div>
					<div className="cta-panel-actions">
						<Button size="lg">Start free workspace</Button>
					</div>
				</section>
				<footer className="site-footer">
					<div className="footer-brand">
						<div>
							<p className="footer-logo">DevChat</p>
							<p className="footer-tagline">
								Conversational AI workspace for modern product teams.
							</p>
						</div>
						<Button size="sm" variant="outline">
							Join beta waitlist
						</Button>
					</div>
					<div className="footer-columns">
						{footerNav.map((column) => (
							<div key={column.title} className="footer-column">
								<p className="column-title">{column.title}</p>
								<ul>
									{column.items.map((item) => (
										<li key={item}>
											<a href="#">{item}</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
					<div className="footer-bottom">
						<p>© {currentYear} DevChat. All rights reserved.</p>
						<div className="footer-links">
							<a href="#">Status</a>
							<a href="#">Privacy</a>
							<a href="#">Terms</a>
						</div>
					</div>
				</footer>
			</HomeWrapper>
		</>
	);
};

export default Home;
