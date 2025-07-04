import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./authContext";
import type { UserRegister } from "@/types/global";
import { api } from "@/services/api";
import { useNavigate } from "react-router-dom";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

type FailedRequest = {
	resolve: (token: string) => void;
	reject: (error: unknown) => void;
};


export default function AuthProvider({ children }: { children: ReactNode }) {
	const navigate = useNavigate();
	const [user, setUser] = useState();
	const [token, setToken] = useState<string>();
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				console.log("Fetching user ...")
				const response = await api.get("/user/me");
				console.log("fetched user", response.data);
				setUser(response.data);
				setIsAuthenticated(true);
			} catch (error) {
				console.log(error);
				setUser(undefined);
				setIsAuthenticated(false);
			}
		}
		fetchUser();
	}, [token])

	useLayoutEffect(() => {
		const authInterceptor = api.interceptors.request.use((config) => {
			config.headers.Authorization =
				!config._retry && token
					? `Bearer ${token}`
					: config.headers.Authorization;
			return config;
		});

		return () => {
			api.interceptors.request.eject(authInterceptor);
		};
	}, [token]);

	let isRefreshing = false;
	let failedQueue: FailedRequest[] = [];

	const processQueue = (error: unknown, newToken: string | null = null) => {
		failedQueue.forEach((prom) => {
			if (error) {
				prom.reject(error);
			} else if (newToken) {
				prom.resolve(newToken);
			}
		});
		failedQueue = [];
	};

	// Response interceptor with refresh logic
	useLayoutEffect(() => {
		const refreshInterceptor = api.interceptors.response.use(
			(response: AxiosResponse) => response,
			async (error: AxiosError) => {
				const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

				if (
					error.response?.status === 401 &&
					!originalRequest._retry &&
					originalRequest.url !== '/user/refresh-token'
				) {
					if (isRefreshing) {
						return new Promise((resolve, reject) => {
							failedQueue.push({ resolve, reject });
						})
							.then((newToken) => {
								if (originalRequest.headers) {
									originalRequest.headers.Authorization = `Bearer ${newToken}`;
								}
								return api(originalRequest);
							})
							.catch((err) => Promise.reject(err));
					}

					originalRequest._retry = true;
					isRefreshing = true;
					console.log('🔄 Refreshing token...');

					try {
						const res = await api.post('/user/refresh-token', {}, { withCredentials: true });
						const newToken = res.data.accessToken;
						setToken(newToken);
						api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
						processQueue(null, newToken);

						if (originalRequest.headers) {
							originalRequest.headers.Authorization = `Bearer ${newToken}`;
						}

						return api(originalRequest);
					} catch (err) {
						console.error('❌ Token refresh failed:', err);
						processQueue(err, null);
						setToken(undefined);
						setUser(undefined);
						setIsAuthenticated(false);
						navigate('/login', { replace: true });
						return Promise.reject(err);
					} finally {
						isRefreshing = false;
					}
				}

				return Promise.reject(error);
			}
		);

		return () => {
			api.interceptors.response.eject(refreshInterceptor);
		};
	}, []);

	const login = async (email: string, password: string) => {
		try {
			const response = await api.post("/user/login", {
				email,
				password
			})
			setToken(response.data.accessToken);
			// setUser(response.data.user);
			// navigate("/");
		} catch (error) {
			console.error(error);
		}
	}

	const register = async (user: UserRegister) => {
		try {
			const response = await api.post("/user", {
				...user
			})
			navigate("/login", { state: { user: response.data.user } });
		} catch (error) {
			console.error(error);
		}
	}

	const logout = async () => {
		try {
			const response = await api.delete("/user/logout");
			console.log(response.data);
			setUser(undefined);
			setIsAuthenticated(false);
			navigate("/login");
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<AuthContext.Provider value={{
			user,
			token,
			setToken,
			isAuthenticated,
			login,
			logout,
			register
		}}>
			{children}
		</AuthContext.Provider>
	)
}