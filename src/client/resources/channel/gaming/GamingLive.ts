import { Map$Gaming } from "./Gaming.js";
import { Schema$GameCard, Resource$GameCard } from "../../common/GameCard.js";

export interface Schema$GamingLive {
    results?: Schema$GameCard[];
    continuation?: string
}

export class Resource$GamingLive {
    static parse(data: Map$Gaming): Schema$GamingLive {
        let GamingLive: Schema$GamingLive = {};

        GamingLive['results'] = data.live?.flatMap((item: any) => {
            if (item.gameCardRenderer?.game.gameDetailsRenderer) {
                return Resource$GameCard.parse(item.gameCardRenderer.game.gameDetailsRenderer)
            } else {
                return []
            }
        })

        const continuation = data.live?.findLast((item: any) => item?.continuationItemRenderer);
		const token = continuation?.continuationItemRenderer.continuationEndpoint.continuationCommand.token
		if (token) {
			GamingLive['results']?.pop();
			GamingLive['continuation'] = token;
			/*
            GamingLive['continuation'] = async () => {
                const continuationContext = {
                    ...context,
                    referer: `https://www.youtube.com/${context.currentUrl}`
                }
    
                const continuationBody = JSON.stringify(new Body$Continuation({ continuation: token }, client.config));
                const continuationResponse = await Endpoint$Browse.post(continuationBody, client, continuationContext);
                const items = continuationResponse.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems
                return Resource$GamingLive.parse({ live: items }, client, context)
            }
			*/
        }
        return GamingLive;
    }
}


