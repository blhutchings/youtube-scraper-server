import YouTubeClient from "../clients/YouTubeClient.js";
import YouTubeContext from "../clients/YouTubeContext.js";
import { Resource$Game } from "../resources/channel/game/Game.js";
import { YouTubeConfig } from "../types/YouTubeConfig.js";
import { ChannelRedirectError } from "../errors/MovedPermanentlyError.js";
import ResourceParseError from "../errors/ResourceParseError.js";
import { YouTubeClientScraperError } from "../errors/YouTubeClientScraperError.js";
import Endpoint$Browse from "./base-requests/Endpoint$Browse.js";
import { Body$Continuation } from "./Continuation.js";
import { ContinuationTimeoutError } from "../errors/ContinuationTimeoutError.js";

const tabParams = {
  home: "EgRob21l",
  live: "EgRsaXZl",
  recent: "EgZyZWNlbnQ%3D",
  official: "EghvZmZpY2lhbA%3D%3D",
  about: "EgVhYm91dA%3D%3D",
};

const urlMap = {
  home: (browseId: string) => `channel/${browseId}/home`,
  live: (browseId: string) => `channel/${browseId}/live`,
  recent: (browseId: string) => `channel/${browseId}/recent`,
  official: (browseId: string) => `channel/${browseId}/official`,
  about: (browseId: string) => `channel/${browseId}/about`,
};

export type SearchParams$Game = {
  browseId: string;
  tab: keyof typeof tabParams;
  continuation?: string;
};

export async function Request$Game(
  searchParams: SearchParams$Game,
  client: YouTubeClient,
  context: YouTubeContext
) {
  context.currentUrl = urlMap[searchParams.tab](searchParams.browseId);

  const continuation = searchParams.continuation;
  let data: any;
  try {
    if (continuation) {
      const continuationBody = JSON.stringify(
        new Body$Continuation({ continuation: continuation }, client.config)
      );
      data = await Endpoint$Browse.post(continuationBody, client, context);
      if (!data.onResponseReceivedActions) {
        throw new ContinuationTimeoutError();
      }
    } else {
      const body = JSON.stringify(new Body$Game(searchParams, client.config));
      data = await Endpoint$Browse.post(body, client, context);
    }

    return Resource$Game.parse(data, client, context, Boolean(continuation));
  } catch (err: any) {
    if (err instanceof YouTubeClientScraperError) throw err;

    throw new ResourceParseError(err.message, data, context);
  }
}

export class Body$Game {
  context: YouTubeConfig["INNERTUBE_CONTEXT"];
  browseId: string;
  params: string;

  constructor(params: SearchParams$Game, config: YouTubeConfig) {
    this.context = config.INNERTUBE_CONTEXT;
    this.browseId = params.browseId;
    this.params = tabParams[params.tab];
  }
}
