import ProgrammingLanguages from "@/pages/ProgrammingLanguages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/programming-languages")({
	component: ProgrammingLanguages,
});
