import { useState } from "react";
import reactLogo from "@/assets/react.svg";
import viteLogo from "/vite.svg";
import { HomeWrapper } from "./Home.styled";
import { useDocumentTitle, useTheme } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/lang/LanguageProvider";

const Home = () => {
	useDocumentTitle("Name title document here!");
	const { theme, toggleTheme } = useTheme();
	const { t, locale, switchLanguage } = useTranslation();
	const [count, setCount] = useState(0);
	return (
		<>
			<HomeWrapper>
				<div className="toolbar">
					<Select
						value={locale}
						onValueChange={(val) => switchLanguage(val as "en" | "vi")}
					>
						<SelectTrigger className="w-[120px]">
							<SelectValue placeholder="Language" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="en">English</SelectItem>
							<SelectItem value="vi">Tiếng Việt</SelectItem>
						</SelectContent>
					</Select>
					<Button
						variant="outline"
						size="sm"
						onClick={toggleTheme}
						aria-label="Toggle theme"
					>
						{theme === "dark" ? (
							<Sun className="h-4 w-4" />
						) : (
							<Moon className="h-4 w-4" />
						)}
						<span style={{ fontSize: 12 }}>
							{theme === "dark" ? "Light" : "Dark"}
						</span>
					</Button>
				</div>
				<div className="logo-container">
					<a href="https://vite.dev" target="_blank">
						<img src={viteLogo} className="logo" alt="Vite logo" />
					</a>
					<a href="https://react.dev" target="_blank">
						<img src={reactLogo} className="logo react" alt="React logo" />
					</a>
				</div>
				<h1 style={{ margin: "8px 0", opacity: 0.9 }}>{t("appName")}</h1>
				<div className="card">
					{/* Shadcn UI button example */}
					<Button onClick={() => setCount((prev) => prev + 1)}>
						count is {count}
					</Button>
					<p>
						Edit <code>src/pages/Home</code> and save to test HMR
					</p>
				</div>
				<p className="read-the-docs">
					Click on the Vite and React logos to learn more
				</p>

				<div className="guide">
					<div className="guide-card">
						<div className="guide-title">
							<span className="icon">⚡</span>
							<h2>Project quick start</h2>
							<span className="pill">important</span>
						</div>
						<ul>
							<li>
								Install deps: <code>yarn</code>
							</li>
							<li>
								Run dev: <code>yarn dev</code>
							</li>
							<li>
								Build: <code>yarn build</code>
							</li>
						</ul>
					</div>

					<div className="guide-card">
						<div className="guide-title">
							<span className="icon">📁</span>
							<h2>Where things live</h2>
						</div>
						<div className="grid-2">
							<ul>
								<li>
									<code>src/routes/index.ts</code>: TanStack Router route tree
								</li>
								<li>
									<code>src/providers.tsx</code>: App providers (Router + React
									Query)
								</li>
								<li>
									<code>src/components/ui</code>: Shadcn UI components
								</li>
							</ul>
							<ul>
								<li>
									<code>src/services</code>: API callers (axios)
								</li>
								<li>
									<code>src/pages</code>: Page components (one folder per page)
								</li>
								<li>
									<code>docs/TEAM_GUIDE.md</code>: Team conventions
								</li>
							</ul>
						</div>
					</div>

					<div className="guide-card">
						<div className="guide-title">
							<span className="icon">🔍</span>
							<h2>Fetch data with React Query</h2>
						</div>
						<pre>{`import { useQuery } from '@tanstack/react-query'
import { getSample } from '@/services/sampleAPI'
const { data, isLoading } = useQuery({
    queryKey: ['sample', id],
    queryFn: () => getSample(id).then(r => r.data),
})`}</pre>
					</div>

					<div className="guide-card">
						<div className="guide-title">
							<span className="icon">🎨</span>
							<h2>Use Shadcn UI</h2>
						</div>
						<pre>{`import { Button } from '@/components/ui/button'
<Button variant="secondary">Click me</Button>`}</pre>
					</div>

					<div className="callout">
						<span className="icon">💡</span>
						<p>
							Tip: Prefer React Query for server-side data fetching and caching.
							Use Redux only for client-side UI state. Check{" "}
							<code>README.md</code> and <code>docs/TEAM_GUIDE.md</code> for
							details.
						</p>
					</div>
				</div>
			</HomeWrapper>
		</>
	);
};

export default Home;
