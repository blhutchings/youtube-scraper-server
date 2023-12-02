import { Got, Headers } from "got"
import { YouTubeConfig } from "../types/YouTubeConfig.js"

export default interface YouTubeClient {
    readonly got: Got
    readonly config: YouTubeConfig
	readonly headers: Headers
}