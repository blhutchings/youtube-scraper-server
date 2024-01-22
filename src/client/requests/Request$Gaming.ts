import YouTubeClient from "../clients/YouTubeClient.js";
import YouTubeContext from "../clients/YouTubeContext.js";
import { Resource$Gaming } from "../resources/channel/gaming/Gaming.js";
import { Resource$GamingLive } from "../resources/channel/gaming/GamingLive.js";
import { Resource$GamingTrending } from "../resources/channel/gaming/GamingTrending.js";
import { YouTubeConfig } from "../types/YouTubeConfig.js";
import { ContinuationTimeoutError } from "../errors/ContinuationTimeoutError.js";
import ResourceParseError from "../errors/ResourceParseError.js";
import { YouTubeClientScraperError } from "../errors/YouTubeClientScraperError.js";
import { Body$Continuation } from "./Continuation.js";
import Endpoint$Browse from "./base-requests/Endpoint$Browse.js";

const tabParams = {
	live: 'EgVnYW1lcw%3D%3D',
	trending: 'Egh0cmVuZGluZw%3D%3D',
}

const urlMap = {
	live: 'gaming/games',
	trending: 'gaming/trending'
}

export type SearchParams$Gaming = {
	tab: keyof typeof tabParams
	continuation?: string
}

export async function Request$Gaming(searchParams: SearchParams$Gaming, client: YouTubeClient, context: YouTubeContext) {
	context.currentUrl = urlMap[searchParams.tab]
	const continuation = searchParams.continuation;
	let data: any;
	try {
		if (continuation !== undefined) {
			const continuationBody = JSON.stringify(new Body$Continuation({ continuation: continuation}, client.config));
			data = await Endpoint$Browse.post(continuationBody, client, context);
			if(!data.onResponseReceivedActions) {
				throw new ContinuationTimeoutError();
			}
		} else {
			const body = JSON.stringify(new Body$Gaming(searchParams, client.config))
			data = await Endpoint$Browse.post(body, client, context)
		}

		return Resource$Gaming.parse(data, Boolean(continuation));
	} catch (err: any) {
		if (err instanceof YouTubeClientScraperError) {
			throw err
		}
		throw new ResourceParseError(err.message, JSON.stringify(data), context)
	}
}

export class Body$Gaming {
	context: YouTubeConfig['INNERTUBE_CONTEXT'];
	browseId = "UCOpNcN46UbXVtpKMrmU4Abg";
	params: string;

	constructor(params: SearchParams$Gaming, config: YouTubeConfig) {
		this.context = config.INNERTUBE_CONTEXT;
		this.params = tabParams[params.tab];
	}
}
