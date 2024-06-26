export interface Schema$GameCard {
    title?: string;
    channelId?: string;
    boxArt?: string;
    liveViewersText?: string;
    isOfficialBoxArt?: boolean;
}

/**
 * Resource$GameCard is a Video Game Display Card
 */
export class Resource$GameCard {
    static parse(gameDetailsRenderer: any) {
        let GamingGameCard: Schema$GameCard = {};

        GamingGameCard['title'] = gameDetailsRenderer.title.simpleText;
        GamingGameCard['channelId'] = gameDetailsRenderer.endpoint.browseEndpoint.browseId;
        GamingGameCard['boxArt'] = gameDetailsRenderer.boxArt.thumbnails[0].url;
        GamingGameCard['liveViewersText'] = gameDetailsRenderer.liveViewersText?.runs[0].text || "0";
        GamingGameCard['isOfficialBoxArt'] = gameDetailsRenderer.isOfficialBoxArt;
		if (GamingGameCard['boxArt'] && GamingGameCard['boxArt'].startsWith("//")) {
			GamingGameCard['boxArt'] = "https:" + GamingGameCard['boxArt'];
		}
        return GamingGameCard;
    }
}