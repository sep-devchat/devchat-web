import React from "react";
import * as S from "./TransactionHistory.styled";

const TransactionHistory: React.FC = () => {
	// Placeholder states for future data wiring
	const isLoading = false;
	const hasError = false;
	const transactions: any[] = [];

	return (
		<S.PageContainer>
			<S.Panel>
				<S.HeaderRow>
					<S.TitleBlock>
						<S.Title>Transaction History</S.Title>
						<S.Subtitle>View and audit all payment transactions.</S.Subtitle>
					</S.TitleBlock>
				</S.HeaderRow>
			</S.Panel>

			<S.TableCard>
				<S.TableHeader>
					<S.TableTitle>Transactions</S.TableTitle>
					<S.TableSubtitle>
						{isLoading
							? "Loading transactions..."
							: "Monitor payments, refunds, and settlements."}
					</S.TableSubtitle>
				</S.TableHeader>

				{hasError ? (
					<S.ErrorState>Failed to load transactions.</S.ErrorState>
				) : isLoading ? (
					<S.LoadingState>Loading...</S.LoadingState>
				) : transactions.length === 0 ? (
					<S.EmptyState>No transactions to display yet.</S.EmptyState>
				) : (
					<S.EmptyState>Data grid coming soon.</S.EmptyState>
				)}
			</S.TableCard>
		</S.PageContainer>
	);
};

export default TransactionHistory;
