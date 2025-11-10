import React from "react";
import { Clock } from "lucide-react";
import SettingAppearance from "@/components/custom/SettingsItems/SettingAppearance";
import { SettingItemRadio } from "@/components/custom/SettingsItems/SettingItemRadio";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../Setting.styled";

type Props = {
	selectedTimeFormat: string;
	setSelectedTimeFormat: (v: string) => void;
	timeFormatOptions: { value: string; label: string }[];
};

export const AppearanceSettings: React.FC<Props> = ({
	selectedTimeFormat,
	setSelectedTimeFormat,
	timeFormatOptions,
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
