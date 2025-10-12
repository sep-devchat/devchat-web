/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import Editor from "@monaco-editor/react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Spinner } from "@/components/ui/spinner";
import { useRef, useState } from "react";
import { editor } from "monaco-editor";
// import { Input } from "@/components/ui/input";
import { runCode } from "@/services/code/code.api";
import { ProgrammingLanguageEnum } from "@/utils/enum";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";

const languageSelectItems = [
	{
		label: "Java",
		value: ProgrammingLanguageEnum.JAVA,
	},
	{
		label: "JavaScript",
		value: ProgrammingLanguageEnum.JAVASCRIPT,
	},
];

export const Route = createFileRoute("/test/code")({
	component: RouteComponent,
});

function RouteComponent() {
	const [result, setResult] = useState<string>("");
	const [isRunning, setIsRunning] = useState<boolean>(false);
	// const monaco = useMonaco();
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const [language, setLanguage] = useState<ProgrammingLanguageEnum>(
		ProgrammingLanguageEnum.JAVASCRIPT,
	);

	// const handleSelectFile = async (e: ChangeEvent<HTMLInputElement>) => {
	// 	const files = e.target.files;
	// 	if (!monaco || !editorRef.current || !files || files.length === 0) return;
	// 	const file = files[0];
	// 	const text = await file.text();
	// 	const model = monaco.editor.createModel(
	// 		text,
	// 		language,
	// 		monaco.Uri.file(file.name),
	// 	);

	// 	editorRef.current.setModel(model);
	// };

	return (
		<div className="h-screen flex flex-col">
			<div className="p-3 flex flex-row gap-x-2 border-b">
				{/* <Input
					type="file"
					placeholder="Select a file"
					onChange={handleSelectFile}
				/> */}
				<Button
					onClick={async () => {
						if (editorRef.current && editorRef.current.getValue()) {
							setIsRunning(true);
							try {
								const res = await runCode({
									code: editorRef.current.getValue(),
									language: language,
								});
								setResult(res.data.output);
							} catch (err) {
								setResult("Error running code");
								console.error(err);
							}
							setIsRunning(false);
						}
					}}
					disabled={isRunning}
				>
					Run Code ({language}) {isRunning && <Spinner />}
				</Button>

				<Select
					value="language"
					onValueChange={(value) =>
						setLanguage(value as ProgrammingLanguageEnum)
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select a language" />
					</SelectTrigger>

					<SelectContent>
						{languageSelectItems.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<ResizablePanelGroup direction="horizontal" className="flex-1">
				<ResizablePanel defaultSize={50}>
					<Editor
						options={{
							scrollBeyondLastLine: false,
						}}
						width="100%"
						height="100%"
						onMount={(editor) => (editorRef.current = editor)}
						language={language}
					/>
				</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel>
					<pre className="h-full p-2 bg-accent rounded overflow-auto">
						{result}
					</pre>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
