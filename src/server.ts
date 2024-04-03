import express, { Express, Request, Response } from 'express';
import YouTube from './client/clients/YouTube.js';
import YouTubeGotClient from './client/clients/YouTubeGotClient.js';
import { SearchParams$Video } from './client/requests/Request$Video.js';
import { SearchParams$Game } from './client/requests/Request$Game.js';
import { HTTPError } from 'got';
import { ChannelRedirectError } from './client/errors/MovedPermanentlyError.js';
import { SearchParams$Gaming } from './client/requests/Request$Gaming.js';
import { ContinuationTimeoutError } from './client/errors/ContinuationTimeoutError.js';
import { ResourceNotFoundError } from './client/errors/ResourceNotFoundError.js';
import Logger from './Logger.js';

async function main() {
    Logger.info('Creating HTTP Client...');
    const httpClient = await YouTubeGotClient.createClient();
    Logger.info('Client Create');
    Logger.info('Client Default Headers ' + JSON.stringify(httpClient.headers, null, 2));

    var client = new YouTube(httpClient);

    const app: Express = express();
    app.use(express.json());
    let port = 3000;
    if (process.env.NODE_ENV === 'production') {
        port = 3000;
    }

    app.post('/video', async (req: Request, res: Response) => {
        const body: SearchParams$Video = req.body;
        try {
            Logger.info(`POST - /video [200] - ${body.videoId}`);
            return res.status(200).send(await client.video(body));
        } catch (err) {
            switch (true) {
                case err instanceof HTTPError:
                    const code = Number(err.response.statusCode);
                    Logger.info(
                        `POST - /video [${code}] - ${body.videoId} - ${err}`
                    );
                    return res.status(code).send(err);
                default:
                    Logger.error(`POST - /video [500] - ${body.videoId}`);
                    return res.status(500).send(err);
            }
        }
    });

    app.post('/game', async (req: Request, res: Response) => {
        const body: SearchParams$Game = req.body;
        try {
            Logger.info(
                `POST - /game [200] - ${body.browseId} - ${body.tab} ${
                    body.continuation ? ' - continuation' : ''
                }`
            );
            return res.status(200).send(await client.game(body));
        } catch (err) {
            switch (true) {
                case err instanceof HTTPError:
                    const code = Number(err.response.statusCode);
                    Logger.info(
                        `POST - /game [${code}] - ${body.browseId} - ${body.tab} - ${err}`
                    );
                    return res.status(code).send(err);
                case err instanceof ChannelRedirectError:
                    Logger.info(
                        `POST - /game [${err.statusCode}] - ${body.browseId} -> ${err.channelId}`
                    );
                    return res.status(err.statusCode).send(err);
                case err instanceof ResourceNotFoundError:
                    Logger.info(
                        `POST - /game [${err.statusCode}] - ${body.browseId}`
                    );
                    return res.status(err.statusCode).send(err);
                default:
                    Logger.error(
                        `POST - /game [500] - ${body.browseId} - ${body.tab} - ${err}`
                    );
                    return res.status(500).send(err);
            }
        }
    });

    app.post('/gaming', async (req: Request, res: Response) => {
        const body: SearchParams$Gaming = req.body;
        try {
            Logger.info(`POST - /gaming [200] - ${body.tab}`);
            return res.status(200).send(await client.gaming(body));
        } catch (err) {
            switch (true) {
                case err instanceof HTTPError:
                    const code = Number(err.response.statusCode);
                    Logger.info(
                        `POST - /gaming [${code}] - ${body.tab} - ${err}`
                    );
                    return res.status(code).send(err);
                case err instanceof ContinuationTimeoutError:
                    Logger.info(
                        `POST - /gaming [${err.statusCode}] - ${body.tab} - ${err}`
                    );
                    return res.status(Number(err.statusCode)).send(err);
                default:
                    Logger.error(`POST - /gaming [500] - ${body.tab} - ${err}`);
                    return res.status(500).send(err);
            }
        }
    });

    app.listen(port, () => {
        Logger.info(`Scraping server listening on port ${port}`);
    });
}
main();
