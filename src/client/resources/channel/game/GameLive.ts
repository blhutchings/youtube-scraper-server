import YouTubeClient from "../../../clients/YouTubeClient.js";
import YouTubeContext from "../../../clients/YouTubeContext.js";
import { Body$Continuation } from "../../../requests/Continuation.js";
import Endpoint$Browse from "../../../requests/base-requests/Endpoint$Browse.js";
import Resource$RichItemRenderer, { Schema$RichItemRenderer } from "../../common/RichItemRenderer.js";
import { Map$Game } from "./Game.js";

export interface Schema$GameLive {
    results?: Schema$RichItemRenderer[];
    continuation?: string;
}

export class Resource$GameLive {
    static parse(data: Map$Game, client: YouTubeClient, context: YouTubeContext): Schema$GameLive {
        let GameLive: Schema$GameLive = {};

        GameLive['results'] = data?.live?.flatMap((item: any) => {
            if (item?.gridVideoRenderer) {
                return Resource$RichItemRenderer.parse(item.gridVideoRenderer, 'live')
            } else {
                return []
            }
        })

        const token = data.live?.findLast((item: any) => item?.continuationItemRenderer)?.continuationItemRenderer.continuationEndpoint.continuationCommand.token
		if (token) {
			GameLive['results']?.pop();
			GameLive['continuation'] = token;
		}
        return GameLive;
    }
}
