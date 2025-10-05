import React, { useState } from "react";
import * as S from "./HeaderContent.styled";
import { getTabTheme } from "./headerTheme.config";

interface HeaderContentProps {
	title: string;
	actions?: React.ReactNode;
	showCheckbox?: boolean;
	onSelectAll?: (checked: boolean) => void;
	themeId?: string | null;
}

export const HeaderContent: React.FC<HeaderContentProps> = ({
	title,
	actions,
	showCheckbox,
	onSelectAll,
	themeId,
}) => {
	const [isChecked, setIsChecked] = useState(false);
	const theme = getTabTheme(themeId);

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsChecked(e.target.checked);
		onSelectAll?.(e.target.checked);
	};

	return (
		<S.HeaderContainer $backgroundColor={theme.backgroundColor}>
			<S.LeftSection>
				<S.Title $titleColor={theme.titleColor}>{title}</S.Title>
			</S.LeftSection>

			<S.RightSection>
				{showCheckbox && (
					<S.CheckboxWrapper>
						<S.Checkbox
							type="checkbox"
							checked={isChecked}
							onChange={handleCheckboxChange}
						/>
						Select All
					</S.CheckboxWrapper>
				)}
				{actions && <S.ActionsSection>{actions}</S.ActionsSection>}
			</S.RightSection>
		</S.HeaderContainer>
	);
};
