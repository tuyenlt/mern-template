import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/providers/authContext';


type loginType = {
	email: string,
	password: string,
}

const API_URL = import.meta.env.VITE_API_URL

export default function Login() {
	const navigate = useNavigate();
	const { isAuthenticated, login } = useAuthContext();

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated]);

	const form = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
	});
	const [loading, setLoading] = useState(false);


	const onSubmit = async (data: loginType) => {
		setLoading(true);
		try {
			await login(data.email, data.password);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleOAuthLogin = () => {
		window.location.href = `${API_URL}/user/oauth/google`;
	}

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<Card className="w-full max-w-md p-6 pt-10 pb-10 rounded-lg shadow-md">
				<CardHeader className="flex flex-col items-center space-y-1 mb-4">
					<p className="text-sm text-muted-foreground">
						Please enter your details
					</p>
					<div className="flex space-x-2 items-center self-center">
						<CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
					</div>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="email"
								rules={{ required: 'Email is required' }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email address</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter your email"
												type="email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								rules={{ required: 'Password is required' }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter your password"
												type="password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<Checkbox id="remember" />
									<Label
										htmlFor="remember"
										className="text-sm text-muted-foreground"
									>
										Remember for 30 days
									</Label>
								</div>
								<Link
									to="#"
									className="text-sm text-blue-600 hover:underline"
								>
									Forgot password?
								</Link>
							</div>

							<Button type="submit" className="w-full" disabled={loading}>
								{loading ? 'Logging in...' : 'Login'}
							</Button>

							<p className="text-center text-sm text-muted-foreground">
								Don't have an account?{' '}
								<Link to="/register" className="text-blue-600 hover:underline">
									Register
								</Link>
							</p>

							<Button variant="outline" className='w-full h-12' onClick={handleOAuthLogin} type='button'>
								<img src='./icons/google.svg' className='w-6 h-6' /> Login with Google
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}