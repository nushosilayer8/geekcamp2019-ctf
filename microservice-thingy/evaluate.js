import { Server } from "https://deno.land/std/http/server.ts";
const { readFileSync, listen } = Deno;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Templates

const indexpageContent = readFileSync("index.html");
const indexpage = () => indexpageContent;
const sourcepageContent = readFileSync("evaluate.js");
const sourcepage = () => sourcepageContent;
const flagpageContent = readFileSync("flag.txt");
const flagpage = () => flagpageContent;

// Stuff

const E2C_ENDPOINT = "https://e2c.mst.ctf.makerforce.io/"; // Check this out! Very cool microservice

// Server

const listener = listen({ hostname: 'localhost6', port: 4035 });
const s = new Server(listener);

const routes = {
	GET: [{
		path: "/",
		handle: async req => {
			return {
				status: 200,
				body: indexpage(),
			};
		},
	}, {
		path: "/source",
		handle: async req => {
			return {
				status: 200,
				headers: { 'Content-Type': 'text/plain' },
				body: sourcepage(),
			};
		},
	}],
	POST: [{
		path: "/evaluate",
		handle: async req => {
			const body = await req.body();
			const { equation, substitutions } = JSON.parse(decoder.decode(body));
			
			const data = await fetch(E2C_ENDPOINT + "equation_to_code", {
				method: 'POST',
				body: `e=${encodeURIComponent(equation.toString())}`, // Ensure it is a string
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			}).then(res => res.text());

			// Perform substitutions
			let substituted = data.split(' ');
			for (const key in substitutions) {
				const value = substitutions[key];
				if (!key.match(/^[a-z]+$/)) {
					throw new Error('Bad substitution');
				}
				if (!value.toString().match(/^[a-z0-9.]+$/)) {
					throw new Error('Bad substitution');
				}
				for (const i in substituted) {
					// We split and then join because we want to only perform substitutions of numbers
					if (substituted[i] === key) {
						substituted[i] = value;
					}
				}
			}

			// Perform evaluation
			console.log(substituted);
			const result = {
				result: eval(substituted.join(' ')).toString(),
			};

			return {
				status: 200,
				headers: { 'Content-Type': 'text/plain' },
				body: encoder.encode(JSON.stringify(result)),
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
					try {
						const response = await route.handle(req);
						const headers = new Headers();
						for (const key in response.headers) {
							headers.set(key, response.headers[key]);
						}
						req.respond({
							...response,
							headers,
						});
						return;
					} catch (e) {
						console.log(e);
						const headers = new Headers();
						headers.set('Content-Type', 'text/plain');
						req.respond({
							status: 500,
							headers,
							body: encoder.encode("Internal Error"), // Don't give users the error
						});
						return;
					}
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
