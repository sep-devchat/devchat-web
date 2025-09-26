import {
	ElipBlue1,
	ElipBlue2,
	ElipYellow1,
	ElipYellow2,
	PageWrapper,
} from "./ConfirmBg.styled";

export default function ConfirmBg() {
	return (
		<PageWrapper>
			<ElipYellow1></ElipYellow1>
			<ElipBlue1></ElipBlue1>
			<ElipYellow2></ElipYellow2>
			<ElipBlue2></ElipBlue2>
		</PageWrapper>
	);
}
