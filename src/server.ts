import express, { Express, Request, Response } from 'express';
import YouTube from './client/clients/YouTube.js';
import YouTubeGotClient from './client/clients/YouTubeGotClient.js';
import { SearchParams$Video } from './client/requests/Request$Video.js';
import { SearchParams$Game } from './client/requests/Request$Game.js';

async function main() {
	console.log("Creating HTTP Client...")
	const httpClient = await YouTubeGotClient.createClient()
	console.log("Http Client Created")
	console.log("Http Client Default Header - ")
	console.log(JSON.stringify(httpClient.headers, null, 2))
	
	var client = new YouTube(httpClient)

	const app: Express = express()
	app.use(express.json());
	const port = 3000


	app.post('/video', async (req: Request, res: Response) => {
		const body: SearchParams$Video = req.body
		try {
			res.status(200).send(await client.video(body))
			console.log(`POST - /video [200] - ${body.videoId}`)
		} catch (err) {
			res.status(500).send(err)
			console.log(`POST - /video [500] - ${body.videoId}`)
		}

	});

	app.post('/game', async (req: Request, res: Response) => {
		const body: SearchParams$Game = req.body
		try {
			res.status(200).send(await client.game(body))
			console.log(`POST - /game [200] - ${body.browseId} - ${body.tab}`)
		} catch (err) {
			res.status(500).send(err)
			console.log(`POST - /game [500] - ${body.browseId} - ${body.tab}`)
		}

	});

	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`)
	})

}
main();

