// import external

import 'babel-polyfill'; // generator functions
import http from 'http';
import koa from 'koa';
import koaStatic from 'koa-static';
import koaSession from 'koa-generic-session';
import MongooseStore from 'koa-session-mongoose';
import mongoose from 'mongoose';

// import internal

import config from './config';
import './domains';
import router from './routes';

// mongoose

mongoose.connect(config.mongo.url);

// koa

const app = koa();
const server = http.Server(app.callback());

// cookies and session

app.keys = config.session.keys;

app.use(koaSession({
	store: new MongooseStore({
		collection: 'sessions',
		expires: config.session.duration,
		model: 'session'
	})
}));

// routes

app
	.use(koaStatic('build/client'))
	.use(router.routes())
	.use(router.allowedMethods())
;

// start server

server.listen(config.port, config.listenAddress);

server.on('listening', function () {
	console.log(`listening on http://${config.listenAddress}:${config.port}`)
});