import { Outlet } from "react-router-dom";


export default function AuthLayout() {
	return (
		<div className="grid grid-cols-1 h-screen w-full">
			{/* <div className="col-span-1 p-[calc(10%)]">
				<img src="/images/hero-banner.jpg" className="h-full rounded-2xl" />
			</div> */}
			<div className="col-span-1">
				<Outlet />
			</div>
		</div>
	)
}