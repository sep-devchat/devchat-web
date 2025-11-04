import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import MarkdownPreview from "@/components/custom/MarkdownPreview/MarkdownPreview";
import "highlight.js/styles/github.css";

export const Route = createFileRoute("/test/markdown")({
	component: RouteComponent,
});

function RouteComponent() {
	const [content, setContent] = useState<string>("");

	return (
		<div className="p-4 md:p-6 max-w-[1200px] mx-auto h-[calc(100vh-80px)] flex flex-col gap-4">
			<h1 className="text-xl font-semibold">Markdown playground</h1>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
				<div className="flex flex-col min-h-0">
					<label className="text-sm font-medium mb-2">Editor</label>
					<textarea
						className="flex-1 min-h-[260px] resize-none rounded-md border bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-primary/40"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Write markdown here..."
					/>
				</div>
				<div className="flex flex-col min-h-0">
					<label className="text-sm font-medium mb-2">Preview</label>
					<div className="rounded-md border bg-background p-3 overflow-auto flex-1 min-h-[260px]">
						<MarkdownPreview content={content} />
					</div>
				</div>
			</div>
		</div>
	);
}
