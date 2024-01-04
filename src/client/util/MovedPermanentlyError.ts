import { YouTubeClientScraperError } from "./YouTubeClientScraperError.js";

export class ChannelRedirectError extends YouTubeClientScraperError {
	statusCode = 301;
	message = "Moved Permanently";
	channelId: string
	constructor(channelId: string) {
		super();
		this.channelId = channelId;
	}
};