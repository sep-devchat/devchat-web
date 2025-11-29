import { useSearch } from "@tanstack/react-router";

import { AnalyticsContainer } from "./Analytics.styled";
import AnalyticsUserTab from "./AnalyticsUserTab";
import AnalyticsReportTab from "./AnalyticsReportTab";

export default function Analytics() {
	const search = useSearch({ from: "/admin/dashboard" });
	const activeTab = search.tab || "user";

	return (
		<AnalyticsContainer>
			{activeTab === "report" ? <AnalyticsReportTab /> : <AnalyticsUserTab />}
		</AnalyticsContainer>
	);
}
