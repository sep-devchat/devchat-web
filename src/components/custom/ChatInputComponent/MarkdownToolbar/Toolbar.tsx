export type ToolbarAction =
	| "bold"
	| "italic"
	| "underline"
	| "strike"
	| "code"
	| "codeblock"
	| "h1"
	| "h2"
	| "ul"
	| "ol"
	| "quote"
	| "link"
	| "image";

type Props = {
	visible: boolean;
	pos: { top: number; left: number };
	onAction: (action: ToolbarAction) => void;
};

export default function Toolbar({ visible, pos, onAction }: Props) {
	if (!visible) return null;
	const Btn = ({
		title,
		label,
		action,
	}: {
		title: string;
		label: React.ReactNode;
		action: ToolbarAction;
	}) => (
		<button
			type="button"
			onMouseDown={(e) => {
				e.preventDefault();
				onAction(action);
			}}
			title={title}
			style={{ color: "#fff" }}
			className="bg-transparent border-0 text-white cursor-pointer focus:outline-none h-8 w-8 inline-flex items-center justify-center rounded-md text-sm"
		>
			{label}
		</button>
	);

	return (
		<div
			className="chat-toolbar absolute z-[100] bg-gray-900 text-white px-2 py-1.5 rounded-lg flex gap-2 shadow-lg"
			style={{ top: pos.top, left: pos.left }}
		>
			<Btn title="Bold" label={<strong>B</strong>} action="bold" />
			<Btn title="Italic" label={<em>I</em>} action="italic" />
			<Btn title="Underline" label={<u>U</u>} action="underline" />
			<Btn title="Strikethrough" label={<s>S</s>} action="strike" />
			<span className="w-px bg-gray-700 mx-1" />
			<Btn title="Inline code" label={<code>`</code>} action="code" />
			<Btn title="Code block" label={<span>{"{ }"}</span>} action="codeblock" />
			<span className="w-px bg-gray-700 mx-1" />
			<Btn title="Heading" label={<span>H1</span>} action="h1" />
			<Btn title="Subheading" label={<span>H2</span>} action="h2" />
			<Btn title="Bulleted list" label={<span>•</span>} action="ul" />
			<Btn title="Numbered list" label={<span>1.</span>} action="ol" />
			<Btn title="Quote" label={<span>“”</span>} action="quote" />
			<span className="w-px bg-gray-700 mx-1" />
			<Btn title="Link" label={<span>🔗</span>} action="link" />
			<Btn title="Image" label={<span>🖼️</span>} action="image" />
		</div>
	);
}
