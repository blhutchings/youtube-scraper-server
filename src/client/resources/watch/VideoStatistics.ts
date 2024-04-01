import { getNumber } from "../../util/ParserUtils.js";
import { Map$Video } from "./Video.js";

export interface Schema$VideoStatistics {
  viewCount?: number;
  likeCount?: number;
  commentCountText?: string;
}

export interface Map$VideoStatistics {
  viewCount?: any;
  likeButton?: any;
  commentCount?: any;
}

export default class Resource$VideoStatistics {
  static parse(data: Map$Video): Schema$VideoStatistics {
    const map = Resource$VideoStatistics.map(data);

    let VideoStatistics: Schema$VideoStatistics = {};
    VideoStatistics["viewCount"] = getNumber(map.viewCount);
    VideoStatistics["likeCount"] = getNumber(
      map.likeButton?.likeButtonViewModel.likeButtonViewModel
        .toggleButtonViewModel.toggleButtonViewModel.defaultButtonViewModel
        .buttonViewModel.title
    );
    VideoStatistics["commentCountText"] = map.commentCount?.simpleText;

    return VideoStatistics;
  }

  private static map(data: Map$Video): Map$VideoStatistics {
    const like =
      data.videoPrimaryInfoRenderer?.videoActions?.menuRenderer?.topLevelButtons?.find(
        (p: any) => Boolean(p?.segmentedLikeDislikeButtonViewModel)
      )?.segmentedLikeDislikeButtonViewModel;
    return {
      viewCount: data.videoDetails?.viewCount,
      likeButton:
        data.videoPrimaryInfoRenderer?.videoActions?.menuRenderer?.topLevelButtons?.find(
          (p: any) => Boolean(p?.segmentedLikeDislikeButtonViewModel)
        )?.segmentedLikeDislikeButtonViewModel,
      commentCount: data.commentsEntryPoint?.find(
        (p: any) => p?.commentsEntryPointHeaderRenderer
      )?.commentsEntryPointHeaderRenderer?.commentCount,
    };
  }
}
