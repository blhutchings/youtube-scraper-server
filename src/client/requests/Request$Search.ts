import YouTubeClient from "../clients/YouTubeClient.js"
import YouTubeContext from "../clients/YouTubeContext.js"
import { Resource$Search } from "../resources/search/Search.js"
import { YouTubeConfig } from "../types/YouTubeConfig.js"
import ResourceParseError from "../errors/ResourceParseError.js"
import { YouTubeClientScraperError } from "../errors/YouTubeClientScraperError.js"
import Endpoint$Search from "./base-requests/Endpoint$Search.js"

const urlMap = (query: string) => {
    return `results?search_query=${query}`
}

export type SearchParams$Search = {
    query: string
}

export async function Request$Search(searchParams: SearchParams$Search, client: YouTubeClient, context: YouTubeContext) { 
    context.currentUrl = urlMap(searchParams.query)
    const body = JSON.stringify(new Body$Search(searchParams, client.config))
    const data = await Endpoint$Search.post(body, client, context)

    try {
        return Resource$Search.parse(data, client, context);
    } catch (err: any) {
		if (err instanceof YouTubeClientScraperError) {
			throw err
		}
        throw new ResourceParseError(err.message, JSON.stringify(data), context)
    }
}

export class Body$Search  {
    context: YouTubeConfig['INNERTUBE_CONTEXT'];
    query: string;

    constructor(params: SearchParams$Search, config: YouTubeConfig) {
        this.context = config.INNERTUBE_CONTEXT;
        this.query = params.query;
    }
}
