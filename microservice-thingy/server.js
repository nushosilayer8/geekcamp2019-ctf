import { serve } from "https://deno.land/std/http/server.ts";
const { readFileSync } = Deno;
const env = Deno.env();
const encoder = new TextEncoder();

// Templates

const indexPageContent = readFileSync("index.html");
const indexPage = () => indexPageContent;

// Server

const s = serve("0.0.0.0:8080");

const routes = {
	GET: [{
		path: "/",
		handle: async req => {
			return {
				status: 200,
				body: indexPage(),
			};
		},
	}],
}

async function main() {
	// Compile routes
	for (const method in routes) {
		routes[method] = routes[method].map(route => ({
			...route,
			path: new RegExp(`^${route.path}$`),
		}));
	}

	// Process requests
	for await (const req of s) {
		(async () => {
			// Match route
			const methodRoutes = routes[req.method];
			for (const route of methodRoutes) {
				if (req.url.match(route.path)) {
					const response = await route.handle(req);
					req.respond(response);
					return;
				}
			}
			req.respond({
				status: 404,
				body: encoder.encode("Not Found"),
			});
		})();
	}
}

main();
