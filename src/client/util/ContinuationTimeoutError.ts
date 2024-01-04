import { YouTubeClientScraperError } from "./YouTubeClientScraperError.js";

export class ContinuationTimeoutError extends YouTubeClientScraperError {
	statusCode = 400;
	message = "Continuation Token Expired";
};