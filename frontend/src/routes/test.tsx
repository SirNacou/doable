import { env } from "#/env";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data, refetch } = useQuery({
		queryKey: ["weather"],
		queryFn: async () => {
			const response = await fetch(
				`${window.location.origin}${env.VITE_API_PATH}/weatherforecast`,
				{ method: "GET" },
			);
			return response.json();
		},
	});

	return (
		<div>
			Hello "/test"!
			<button
				type="button"
				className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				onClick={() => {
					refetch();
				}}
			>
				Get Weather
			</button>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
}
