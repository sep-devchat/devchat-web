import React from "react";
import { Clock } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../Setting.styled";
import SettingAppearance from "@/components/custom/SettingsItems/SettingAppearance";
import { SettingItemRadio } from "@/components/custom/SettingsItems/SettingItemRadio";
import { timeFormatOptions } from "../options";

interface Props {
	selectedTimeFormat: string;
	setSelectedTimeFormat: (v: string) => void;
}

const AppearanceSettings: React.FC<Props> = ({
	selectedTimeFormat,
	setSelectedTimeFormat,
}) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Appearance</CardTitle>
				<CardDescription>
					Customize interface, theme, and layout.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<SettingAppearance />
				<SettingItemRadio
					icon={<Clock size={20} />}
					title="Time format"
					description="Choose the time display format"
					selectedValue={selectedTimeFormat}
					options={timeFormatOptions}
					onChange={setSelectedTimeFormat}
					name="timeFormat"
				/>
			</CardContent>
		</Card>
	);
};

export default AppearanceSettings;
