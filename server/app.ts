import "@babel/polyfill";
import Koa from "koa";
import Router from "koa-router";
import dotenv from "dotenv";
import passport from "koa-passport";
import session from "koa-session";
import redisStore from "koa-redis";
import bodyParser from "koa-bodyparser";
import { SessionStore } from "koa-generic-session";
import jwtStrategy from "passport-jwt";

dotenv.config();

const app: Koa = new Koa();
const router: Router = new Router();

console.info(".env [TEST_VAR]=", process.env.TEST_VAR);
console.info(".env [SERVER_PORT]=", process.env.SERVER_PORT);

const globalRequestHandler: Koa.Middleware = (ctx,
  next: () => Promise<any>): void => {
  console.info("requested, ", ctx.request.URL.pathname, "[route for SPA]");
  ctx.body = `Node.js server is running on ${process.env.SERVER_PORT}`;
};

const storeOption: redisStore.RedisOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};
const store: SessionStore = redisStore(storeOption);

passport.use(new jwtStrategy.Strategy({
  jwtFromRequest: jwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'the_secret',
}, (payload, done) => {
  return done(null, payload, {});
}));

passport.serializeUser((user, done) => {
  console.info("serializeUser,", user);
  return done(null, user);
});

passport.deserializeUser((id, done) => {
  console.info("deserializeUser,", id);
  return done(null, id);
});

router.use();
router.use(passport.initialize());
router.use(passport.session());
router.get("/*", session({
  store,
}, app), globalRequestHandler);

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(process.env.SERVER_PORT);
