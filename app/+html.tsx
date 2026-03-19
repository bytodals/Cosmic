import { ScrollViewStyleReset } from "expo-router/html";

export default function Root({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" style={{ height: "100%" }}>
			<head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no"
				/>
				<ScrollViewStyleReset />
			</head>
			<body style={{ margin: 0, minHeight: "100%" }}>
				{children}
			</body>
		</html>
	);
}
