import YouTubeClient from "../clients/YouTubeClient.js"
import YouTubeContext from "../clients/YouTubeContext.js"
import { Resource$Account } from "../resources/channel/account/Account.js"
import { YouTubeConfig } from "../types/YouTubeConfig.js"
import ResourceParseError from "../errors/ResourceParseError.js"
import { YouTubeClientScraperError } from "../errors/YouTubeClientScraperError.js"
import Endpoint$Browse from "./base-requests/Endpoint$Browse.js"

const tabParams = {
    videos: "EgZ2aWRlb3PyBgQKAjoA",
    live: "EgdzdHJlYW1z8gYECgJ6AA%3D%3D",
    about: "EgVhYm91dPIGBAoCEgA%3D"
}

export type SearchParams$Account = {
    browseId: string,
    tab: keyof typeof tabParams
}

export async function Request$Account(searchParams: SearchParams$Account, client: YouTubeClient, context: YouTubeContext) { 
    const body = JSON.stringify(new Body$Account(searchParams, client.config))
    const data = await Endpoint$Browse.post(body, client, context)
    try {
        return Resource$Account.parse(data, client, context);
    } catch (err: any) {
		if (err instanceof YouTubeClientScraperError) {
			throw err
		}
        throw new ResourceParseError(err.message, JSON.stringify(data), context)
    }
}

export class Body$Account  {
    context: YouTubeConfig['INNERTUBE_CONTEXT'];
    browseId: string;
    params: string;

    constructor(params: SearchParams$Account, config: YouTubeConfig) {
        this.context = config.INNERTUBE_CONTEXT;
        this.browseId = params.browseId;
        this.params =  tabParams[params.tab];
    }
}
