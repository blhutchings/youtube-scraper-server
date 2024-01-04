import YouTubeClient from "../../../clients/YouTubeClient.js";
import YouTubeContext from "../../../clients/YouTubeContext.js";
import { Body$Continuation } from "../../../requests/Continuation.js";
import Endpoint$Browse from "../../../requests/base-requests/Endpoint$Browse.js";
import Resource$RichItemRenderer, { Schema$RichItemRenderer } from "../../common/RichItemRenderer.js";
import { Map$Gaming } from "./Gaming.js";
import { Schema$GamingLive } from "./GamingLive.js";

export interface Schema$GamingTrending {
	results?: Schema$RichItemRenderer[];
	continuation?: string
}

export class Resource$GamingTrending {
	static parse(data: Map$Gaming): Schema$GamingLive {
		let GamingTrending: Schema$GamingTrending = {};

		GamingTrending['results'] = data.live?.flatMap((item: any) => {
			if (item.gridVideoRenderer) {
				return Resource$RichItemRenderer.parse(item.gridVideoRenderer, 'video')
			} else {
				return []
			}
		})

		const continuation = data.live?.findLast((item: any) => item?.continuationItemRenderer)?.pop()
		const token = continuation?.continuationItemRenderer.continuationEndpoint.continuationCommand.token
		if (token) {
			GamingTrending['continuation'] = token;
		}
		return GamingTrending;
	}
}