import { useState, useEffect, useLayoutEffect } from 'react';
import { useForm, type FormState } from 'react-hook-form';
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
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/providers/authContext';

type RegisterFormType = {
	email: string,
	name: string,
	password: string,
	passwordConfirm: string,
}

export default function Register() {
	const navigate = useNavigate();
	const { isAuthenticated, register } = useAuthContext();

	useLayoutEffect(() => {
		if (isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated]);

	const form = useForm({
		defaultValues: {
			email: '',
			name: '',
			password: '',
			passwordConfirm: '',
			role: 'user',
		},
	});
	const password = form.watch('password');

	const [loading, setLoading] = useState(false);

	const onSubmit = async (data: RegisterFormType) => {
		setLoading(true);
		try {
			await register(data);
			navigate("/login");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<Card className="w-full max-w-md p-6 pt-10 pb-10 rounded-lg shadow-md">
				<CardHeader className="flex flex-col items-center space-y-1 mb-4">
					<p className="text-sm text-muted-foreground">
						Please enter your details
					</p>
					<div className="flex space-x-2 items-center self-center">
						<CardTitle className="text-3xl font-bold">Welcome</CardTitle>
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
								name="name"
								rules={{ required: 'Name is required' }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter your name"
												type="name"
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

							<FormField
								control={form.control}
								name="passwordConfirm"
								rules={{
									required: 'Password is required',
									validate: (value) =>
										value === password || 'Passwords do not match',
								}}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
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

							<Button type="submit" className="w-full" disabled={loading}>
								{loading ? 'signing in...' : 'Sign up'}
							</Button>

							<p className="text-center text-sm text-muted-foreground">
								Already have an account?{' '}
								<Link to="/login" className="text-blue-600 hover:underline">
									Sign in
								</Link>
							</p>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}