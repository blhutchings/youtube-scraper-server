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
        }
        return GamingLive;
    }
}


