import YouTubeClient from "../../../clients/YouTubeClient.js";
import YouTubeContext from "../../../clients/YouTubeContext.js";
import { Schema$GamingLive, Resource$GamingLive } from "./GamingLive.js";
import { Schema$GamingTrending, Resource$GamingTrending } from "./GamingTrending.js";

export interface Schema$Gaming {
    live?: Schema$GamingLive
    trending?: Schema$GamingTrending;
}

export interface Map$Gaming {
    live?: Record<string, any>[];
    trending?: Record<string, any>[];
}


export class Resource$Gaming {
    static parse(data: Record<string, any>, continuation?: boolean): Schema$Gaming {
        const map: Map$Gaming = Resource$Gaming.map(data);
        let Gaming: Schema$Gaming = {};

        Gaming['live'] = map.live ? Resource$GamingLive.parse(map) : undefined;
        //Gaming['trending'] = map.trending ? Resource$GamingTrending.parse(map, client, context) : undefined;
        
        return Gaming;
    }

    private static map(data: Record<string, any>): Map$Gaming {
         let Map: Map$Gaming = {};

        data?.contents?.twoColumnBrowseResultsRenderer?.tabs?.forEach((tab: any) => {
            if (tab?.tabRenderer?.selected === true) {
                const shelfRenderer = tab?.tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].shelfRenderer
                const gridRenderer = shelfRenderer.content.gridRenderer;
                if (gridRenderer.targetId === "browse-feedUCOpNcN46UbXVtpKMrmU4Abgtrending580") {
                    Map['trending'] = shelfRenderer.content.gridRenderer.items
                } else if (gridRenderer.targetId === "browse-feedUCOpNcN46UbXVtpKMrmU4Abggames235") {
                    Map['live'] = shelfRenderer.content.gridRenderer.items
                } else {
                    throw new Error("Unidentified shelfTitle", {cause: data})
                }
            }
        });
        return Map;
    }
}