import { HomeWrapper } from "./Home.styled";
import { useDocumentTitle } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import MainBg from "@/components/custom/MainBackground/MainBg";
import heroVisual from "@/assets/image/laptop-chat-3d-icon-png-download.png";
import { useNavigate } from "@tanstack/react-router";

const desktopDownloadUrl =
	"https://github.com/sep-devchat/devchat-web-electron/releases/download/v1.0.1/DevChat-1.0.1.Setup.exe";

const Home = () => {
	useDocumentTitle("DevChat — AI workspace for product engineers");
	const navigate = useNavigate();

	const downloadDesktopApp = () => {
		window.open(desktopDownloadUrl, "_blank");
	};

	const contactEmail = "devchat.online@gmail.com";

	return (
		<>
			<MainBg />
			<HomeWrapper>
				<div className="hero">
					<div className="hero-content">
						<div className="hero-badge">
							<Sparkles size={16} />
							<span>Built for Developers</span>
						</div>

						<h1>Chat application for developers</h1>

						<p>
							DevChat is the collaboration hub where PMs, engineers, and AI work
							in lockstep. Keep customer threads, code experiments, and
							deployment updates in one secure canvas.
						</p>

						<div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
							<Button size="lg" onClick={() => navigate({ to: "/auth/login" })}>
								Open DevChat in browser
							</Button>
							<Button size="lg" variant="outline" onClick={downloadDesktopApp}>
								Download desktop app
							</Button>
						</div>

						{/* Contact Email - Clean version */}
						<p
							style={{
								marginTop: "1.5rem",
								fontSize: "0.875rem",
								color: "hsl(var(--muted-foreground))",
								opacity: 0.8,
							}}
						>
							Need help or have feedback?{" "}
							<a
								href={`mailto:${contactEmail}`}
								style={{
									color: "hsl(var(--primary))",
									textDecoration: "none",
									fontWeight: 600,
								}}
							>
								{contactEmail}
							</a>
						</p>
					</div>

					<div className="hero-visual">
						<div className="visual-blob"></div>
						<img src={heroVisual} alt="DevChat Interface" />
					</div>
				</div>
			</HomeWrapper>
		</>
	);
};

export default Home;
