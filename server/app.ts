import "@babel/polyfill";
import * as Koa from "koa";
import * as Router from "koa-router";
import * as dotenv from "dotenv";

dotenv.config();

const app: Koa = new Koa();
const router: Router = new Router();


console.info(".env [TEST_VAR]=", process.env.TEST_VAR);
console.info(".env [SERVER_PORT]=", process.env.SERVER_PORT);

const globalRequestHandler: Koa.Middleware = async (ctx: Koa.Context,
  next: () => Promise<any>): Promise<void> => {
    console.info("requested, ", ctx.request.URL.pathname, "[route for SPA]");
  ctx.body = `Node.js server is running on ${process.env.SERVER_PORT}`;
};

router.get('/*', globalRequestHandler);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(process.env.SERVER_PORT);