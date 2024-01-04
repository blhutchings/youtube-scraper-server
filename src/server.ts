import express, { Express, Request, Response } from 'express';
import YouTube from './client/clients/YouTube.js';
import YouTubeGotClient from './client/clients/YouTubeGotClient.js';
import { SearchParams$Video } from './client/requests/Request$Video.js';
import { SearchParams$Game } from './client/requests/Request$Game.js';
import { HTTPError } from 'got';
import { ChannelRedirectError } from './client/util/MovedPermanentlyError.js';
import { SearchParams$Gaming } from './client/requests/Request$Gaming.js';
import { ContinuationTimeoutError } from './client/util/ContinuationTimeoutError.js';

async function main() {
	console.log("Creating HTTP Client...")
	const httpClient = await YouTubeGotClient.createClient()
	console.log("Http Client Created")
	console.log("Http Client Default Header - ")
	console.log(JSON.stringify(httpClient.headers, null, 2))

	var client = new YouTube(httpClient)

	const app: Express = express()
	app.use(express.json());
	const port = 5000
	if (port === 5000) {
		console.warn("Set to 3000 before docker")
	}


	app.post('/video', async (req: Request, res: Response) => {
		const body: SearchParams$Video = req.body
		try {
			console.log(`POST - /video [200] - ${body.videoId}`)
			return res.status(200).send(await client.video(body))
		} catch (err) {
			switch (true) {
				case err instanceof HTTPError:
					console.log(`POST - /game [${err.code}] - ${body.videoId} - ${err}`)
					return res.status(Number(err.code)).send(err)
				default:
					console.log(`POST - /video [500] - ${body.videoId}`)
					return res.status(500).send(err)

			}
		}

	});

	app.post('/game', async (req: Request, res: Response) => {
		const body: SearchParams$Game = req.body
		try {
			console.log(`POST - /game [200] - ${body.browseId} - ${body.tab}`)
			return res.status(200).send(await client.game(body))
		} catch (err) {
			switch (true) {
				case err instanceof HTTPError:
					console.log(`POST - /game [${err.code}] - ${body.browseId} - ${body.tab} - ${err}`)
					return res.status(Number(err.code)).send(err);
				case err instanceof ChannelRedirectError:
					console.log(`POST - /game [${err.statusCode}] - ${body.browseId} -> ${err.channelId}`)
					return res.status(err.statusCode).send(err)
				default:
					console.log(`POST - /game [500] - ${body.browseId} - ${body.tab} - ${err}`)
					return res.status(500).send(err)
			}
		}

	});

	app.post('/gaming', async (req: Request, res: Response) => {
		const body: SearchParams$Gaming = req.body
		try {
			console.log(`POST - /gaming [200] - ${body.tab}`)
			return res.status(200).send(await client.gaming(body))
		} catch (err) {
			switch (true) {
				case err instanceof HTTPError:
					console.log(`POST - /gaming [${err.code}] - ${body.tab} - ${err}`);
					return res.status(Number(err.code)).send(err);
				case err instanceof ContinuationTimeoutError:
					console.log(`POST - /gaming [${err.statusCode}] - ${body.tab} - ${err}`);
					return res.status(Number(err.statusCode)).send(err);
				default:
					console.log(`POST - /gaming [500] - ${body.tab} - ${err}`)
					return res.status(500).send(err)
			}
		}
	});

	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`)
	})

}
main();

