import got, { Got, Options, Headers } from "got"
import { CookieJar } from "tough-cookie"
import YouTubeClientAgent from "./YouTubeClientAgent.js"
import YouTubeConfigExtractor from "../util/YouTubeConfigExtractor.js"
import { YouTubeConfig } from "../types/YouTubeConfig.js"
import YouTubeClient from "./YouTubeClient.js"


export default class YouTubeGotClient implements YouTubeClient {
	readonly got: Got
	readonly config: YouTubeConfig
	readonly headers: Headers

	private constructor(got: Got, config: YouTubeConfig, headers: Headers) {
		this.got = got
		this.config = config;
		this.headers = headers;
	}

	static async createClient(options?: Options): Promise<YouTubeClient> {
		const defaultOptions = new Options(options, {
			prefixUrl: "https://www.youtube.com/",
			http2: true,
			agent: {
				http2: new YouTubeClientAgent()
			},
			cookieJar: new CookieJar()
		})

		let client = got.extend(defaultOptions)

		const homepage = await client.get('');

		const ytcfg = YouTubeConfigExtractor.extract_ytcfg(homepage.body)
		const defaultHeaders = YouTubeGotClient.createDefaultHeaders(ytcfg)

		if (!ytcfg.INNERTUBE_CONTEXT?.client?.hl?.toLowerCase().includes("en")) {
			console.warn(`YouTube localization is set to '${ytcfg.INNERTUBE_CONTEXT?.client?.hl}' and not an english varient, some properties may be undefined.`)
		}

		// Override headers
		client = client.extend({
			headers: { ...defaultHeaders }
		})


		return new YouTubeGotClient(client, ytcfg, defaultHeaders);
	}

	private static createDefaultHeaders(ytcfg: YouTubeConfig): Headers {
		// Define header order and replace any user defined defaults
		return {
			"accept-encoding": "gzip, deflate, br",
			"accept-language": "en-US",
			"cache-control": "no-cache",
			"dnt": "1",
			"origin": "https://www.youtube.com",
			"pragma": "no-cache",
			"referer": "https://www.youtube.com/",
			"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
			"x-goog-visitor-id": ytcfg.INNERTUBE_CONTEXT?.client?.visitorData,
			"x-youtube-bootstrap-logged-in": ytcfg.LOGGED_IN?.toString(),
			"x-youtube-client-name": ytcfg.INNERTUBE_CONTEXT_CLIENT_NAME?.toString(),
			"x-youtube-client-version": ytcfg.INNERTUBE_CONTEXT_CLIENT_VERSION,
		}

	}

}
