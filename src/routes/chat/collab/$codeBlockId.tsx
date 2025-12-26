import { Button } from "@/components/ui/button";
import CodeCollab from "@/pages/CodeCollab";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import styled from "styled-components";

const collabSearchSchema = z
	.object({
		mode: z.enum(["channel", "direct"]),
		groupId: z.string().optional(),
		channelId: z.string().optional(),
		directUserId: z.string().optional(),
		title: z.string().optional(),
		subtitle: z.string().optional(),
	})
	.superRefine((value, ctx) => {
		if (value.mode === "channel") {
			if (!value.groupId) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "groupId is required for channel collaboration",
					path: ["groupId"],
				});
			}
			if (!value.channelId) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "channelId is required for channel collaboration",
					path: ["channelId"],
				});
			}
		}

		if (value.mode === "direct" && !value.directUserId) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "directUserId is required for direct collaboration",
				path: ["directUserId"],
			});
		}
	});

export const Route = createFileRoute("/chat/collab/$codeBlockId")({
	component: CollabPage,
	validateSearch: collabSearchSchema,
});

function CollabPage() {
	const { codeBlockId } = Route.useParams();
	const search = Route.useSearch();
	const navigate = useNavigate();

	const isChannelContext = search.mode === "channel";
	const isDirectContext = search.mode === "direct";
	const missingChannelContext =
		isChannelContext && !(search.groupId && search.channelId);
	const missingDirectContext = isDirectContext && !search.directUserId;

	const handleBack = () => {
		if (isChannelContext && search.groupId) {
			navigate({
				to: "/chat/group/$groupId",
				params: { groupId: search.groupId },
				search: (prev: any) => ({
					...(prev ?? {}),
					channel: search.channelId,
				}),
			});
			return;
		}

		if (isDirectContext && search.directUserId) {
			navigate({
				to: "/chat/user/$userId",
				params: { userId: search.directUserId },
			});
			return;
		}

		navigate({ to: "/chat" });
	};

	if (missingChannelContext || missingDirectContext) {
		return (
			<PageShell>
				<Header>
					<div>
						<Title>Code Collaboration</Title>
						<Subtitle>Missing conversation context</Subtitle>
					</div>
					<StyledButton variant="outline" size="sm" onClick={handleBack}>
						Go back
					</StyledButton>
				</Header>
				<Body>
					<MissingState>
						Unable to determine which conversation this code block belongs to.
					</MissingState>
				</Body>
			</PageShell>
		);
	}

	return (
		<PageShell>
			<Header>
				<div>
					<Title>{search.title || "Code Collaboration"}</Title>
					<Subtitle>Code Block ID: {codeBlockId}</Subtitle>
					{search.subtitle && <Subtitle>{search.subtitle}</Subtitle>}
				</div>
				<StyledButton variant="ghost" size="sm" onClick={handleBack}>
					<ArrowLeft className="h-4 w-4 mr-1" /> Back to chat
				</StyledButton>
			</Header>
			<Body>
				{isChannelContext ? (
					<CodeCollab
						codeBlockId={codeBlockId}
						groupId={search.groupId!}
						channelId={search.channelId!}
					/>
				) : (
					<CodeCollab
						codeBlockId={codeBlockId}
						directUserId={search.directUserId!}
					/>
				)}
			</Body>
		</PageShell>
	);
}

const PageShell = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	background: #f8fbff;
	border-radius: 16px;
	box-shadow: 0 12px 30px rgba(148, 163, 184, 0.2);
	border: 1px solid #dbeafe;
	overflow: hidden;

	@media (max-width: 1220px) {
		border-radius: calc(16px * 0.7);
	}

	@media (min-width: 1440px) {
		border-radius: calc(16px * 0.8);
	}

	@media (min-width: 1920px) {
		border-radius: calc(16px * 1.1);
	}
`;

const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 1.25rem 1.5rem;
	background: linear-gradient(135deg, #eef2ff, #dbeafe);
	border-bottom: 1px solid rgba(148, 163, 184, 0.3);

	@media (max-width: 1220px) {
		padding: calc(1.25rem * 0.7) calc(1.5rem * 0.7);
	}

	@media (min-width: 1440px) {
		padding: calc(1.25rem * 0.8) calc(1.5rem * 0.8);
	}

	@media (min-width: 1920px) {
		padding: calc(1.25rem * 1.1) calc(1.5rem * 1.1);
	}
`;

const Title = styled.h1`
	font-size: 1.25rem;
	font-weight: 600;
	color: #0f172a;
	margin: 0;

	@media (max-width: 1220px) {
		font-size: 14px;
	}

	@media (min-width: 1440px) {
		font-size: 15px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
	}
`;

const Subtitle = styled.p`
	font-size: 0.9rem;
	color: #475569;
	margin: 0.35rem 0 0;

	@media (max-width: 1220px) {
		font-size: 12px;
	}

	@media (min-width: 1440px) {
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
`;

const Body = styled.div`
	flex: 1;
	min-height: 0;
	background: radial-gradient(circle at top, #fff, #eff6ff);
	padding: 1rem;
	display: flex;
	flex-direction: column;
	& > * {
		flex: 1;
		min-height: 0;
	}

	@media (max-width: 1220px) {
		padding: calc(1rem * 0.7);
	}

	@media (min-width: 1440px) {
		padding: calc(1rem * 0.8);
	}

	@media (min-width: 1920px) {
		padding: calc(1rem * 1.1);
	}
`;

const MissingState = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	color: #475569;
	font-size: 0.95rem;

	@media (max-width: 1220px) {
		font-size: 11px;
	}

	@media (min-width: 1440px) {
		font-size: 12px;
	}

	@media (min-width: 1920px) {
		font-size: 14px;
	}
`;

const StyledButton = styled(Button)`
	font-size: 14px;

	@media (max-width: 1220px) {
		font-size: 12.5px;
	}

	@media (min-width: 1440px) {
		font-size: 13.5px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
`;
