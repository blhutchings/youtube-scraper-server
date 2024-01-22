import { YouTubeClientScraperError } from "./YouTubeClientScraperError.js";

export class ResourceNotFoundError extends YouTubeClientScraperError {
	statusCode = 404;
};