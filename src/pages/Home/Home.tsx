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
							Built for Developers
						</span>
						<h1 className="uppercase font-bold">
							Chat application for developers
						</h1>
						<p>
							DevChat is the collaboration hub where PMs, engineers, and AI work
							in lockstep. Keep customer threads, code experiments, and
							deployment updates in one secure canvas.
						</p>
						<div className="cta-group flex gap-4">
							<Button size="lg" onClick={redirectToApp}>
								Open DevChat in browser
							</Button>
							<Button size="lg" variant="outline" onClick={downloadDesktopApp}>
								Download desktop app
							</Button>
						</div>
					</div>
					<div className="hero-visual" aria-hidden="true">
						<div className="visual-blob" />
						<img src={heroVisual} alt="DevChat laptop preview" />
					</div>
				</section>
			</HomeWrapper>
		</>
	);
};

export default Home;
