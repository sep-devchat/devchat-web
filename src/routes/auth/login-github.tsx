import { useAuth } from "@/hooks";
import { login, loginPkce } from "@/services/authAPI";
import cookieUtils from "@/services/cookieUtils";
import { useMutation } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-adapter";
import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	Github,
	Loader2,
	CheckCircle,
	XCircle,
	ArrowRight,
	RefreshCw,
} from "lucide-react";
import z from "zod";

const loginGitHubSearchParamsSchema = z.object({
	code: z.string(),
});

export const Route = createFileRoute("/auth/login-github")({
	component: RouteComponent,
	validateSearch: zodValidator(loginGitHubSearchParamsSchema),
});

function RouteComponent() {
	const { code } = Route.useSearch();
	const [countdown, setCountdown] = useState(5);
	const navigate = useNavigate();
	const { refetchProfile } = useAuth();

	const loginMutation = useMutation({
		mutationFn: login,
		onSuccess: async (data) => {
			console.log("GitHub login successful:", data);
			cookieUtils.setToken(data.data.accessToken);
			await refetchProfile();
			navigate({
				to: "/user/channels",
			});
		},
		onError: (error) => {
			console.error("GitHub login failed:", error);
		},
	});

	const loginPkceMutation = useMutation({
		mutationFn: loginPkce,
		onSuccess: (response) => {
			const responseData = response.data;
			window.location.href = `devchat://?code=${responseData.authCode}`;
		},
		onError: (error) => {
			console.error("GitHub PKCE login failed:", error);
		},
	});

	const isLoading = loginMutation.isPending || loginPkceMutation.isPending;
	const isError = loginMutation.isError || loginPkceMutation.isError;
	const isSuccess = loginMutation.isSuccess || loginPkceMutation.isSuccess;

	useEffect(() => {
		const codeChallenge = localStorage.getItem("codeChallenge");
		const codeChallengeMethod = localStorage.getItem("codeChallengeMethod");

		if (codeChallenge && codeChallengeMethod) {
			loginPkceMutation.mutate({
				method: "github",
				code,
				codeChallenge,
				codeChallengeMethod,
			});
			localStorage.removeItem("codeChallenge");
			localStorage.removeItem("codeChallengeMethod");
		} else {
			loginMutation.mutate({ method: "github", code });
		}
	}, []);

	useEffect(() => {
		if (isSuccess && countdown > 0) {
			const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [isSuccess, countdown]);

	const handleRetry = () => {
		const codeChallenge = localStorage.getItem("codeChallenge");
		const codeChallengeMethod = localStorage.getItem("codeChallengeMethod");

		if (codeChallenge && codeChallengeMethod) {
			loginPkceMutation.mutate({
				method: "github",
				code,
				codeChallenge,
				codeChallengeMethod,
			});
		} else {
			loginMutation.mutate({ method: "github", code });
		}
	};

	const getErrorMessage = () => {
		const error = loginMutation.error || loginPkceMutation.error;
		if (error?.message) {
			return error.message;
		}
		return "Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại sau.";
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{isLoading && (
					<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 shadow-2xl">
						<div className="mb-4">
							<div className="relative inline-block">
								<Github className="w-16 h-16 text-white mx-auto mb-4" />
								<Loader2 className="w-6 h-6 text-blue-400 animate-spin absolute top-18 right-5" />
							</div>
						</div>
						<h2 className="text-2xl font-bold text-white mb-4">
							Đang đăng nhập...
						</h2>
						<p className="text-gray-300 mb-6">
							Vui lòng chờ trong khi chúng tôi xác thực tài khoản GitHub của bạn
						</p>
						<div className="flex justify-center">
							<div className="flex space-x-1">
								{[0, 1, 2].map((i) => (
									<div
										key={i}
										className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
										style={{ animationDelay: `${i * 0.2}s` }}
									/>
								))}
							</div>
						</div>
					</div>
				)}

				{isSuccess && (
					<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-green-500/30 shadow-2xl">
						<div className="mb-6">
							<CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 animate-bounce" />
						</div>
						<h2 className="text-2xl font-bold text-white mb-4">
							Đăng nhập thành công!
						</h2>
						<p className="text-gray-300 mb-6">
							Chào mừng bạn! Tài khoản GitHub của bạn đã được xác thực thành
							công.
						</p>
						<div className="bg-green-500/20 rounded-xl p-4 mb-6 border border-green-500/30">
							<div className="flex items-center justify-center space-x-2 text-green-300">
								<ArrowRight className="w-5 h-5" />
								<span>Chuyển hướng trong {countdown} giây...</span>
							</div>
						</div>
						<div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
							<div
								className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
								style={{ width: `${((5 - countdown) / 5) * 100}%` }}
							/>
						</div>
					</div>
				)}

				{isError && (
					<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-red-500/30 shadow-2xl">
						<div className="mb-6">
							<XCircle className="w-16 h-16 text-red-400 mx-auto mb-4 animate-pulse" />
						</div>
						<h2 className="text-2xl font-bold text-white mb-4">
							Đăng nhập thất bại
						</h2>
						<div className="bg-red-500/20 rounded-xl p-4 mb-6 border border-red-500/30">
							<p className="text-red-300 text-sm">{getErrorMessage()}</p>
						</div>
						<div className="space-y-3">
							<button
								onClick={handleRetry}
								className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
							>
								<RefreshCw className="w-5 h-5" />
								<span>Thử lại</span>
							</button>
							<button
								onClick={() => (window.location.href = "/auth/login")}
								className="w-full bg-gray-600/50 hover:bg-gray-600/70 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-gray-500/30"
							>
								Quay lại trang đăng nhập
							</button>
						</div>
					</div>
				)}

				{!isLoading && !isSuccess && !isError && (
					<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 shadow-2xl">
						<div className="mb-6">
							<Github className="w-16 h-16 text-white mx-auto mb-4" />
						</div>
						<h2 className="text-2xl font-bold text-white mb-4">
							Đang chuyển hướng...
						</h2>
						<p className="text-gray-300 mb-6">
							Đang chuyển hướng đến GitHub để xác thực tài khoản
						</p>
						<div className="flex justify-center">
							<div className="flex space-x-1">
								{[0, 1, 2].map((i) => (
									<div
										key={i}
										className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
										style={{ animationDelay: `${i * 0.2}s` }}
									/>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
