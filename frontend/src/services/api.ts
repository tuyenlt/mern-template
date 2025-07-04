import axios from 'axios';

declare module 'axios' {
	export interface AxiosRequestConfig {
	  _retry?: boolean;
	}
}

const API_URL = import.meta.env.VITE_API_URL

export const api = axios.create({
	baseURL: API_URL,
	headers: {
	  'Content-Type': 'application/json',
	},
	withCredentials: true,
});