// import express from "express";
// import compression from "compression";
// import { rateLimit } from "express-rate-limit";
// import cors from "cors";
// import helmet from "helmet";
// import whitelistedIPs from "./constants/whitelistedIPs.json";
// @ts-ignore
import dotenv from "dotenv";
// import jobRoutes from "./job-routes/jobRoutes.js";
// import swaggerUi from "swagger-ui-express";
// import swaggerSpec from "./swagger.js";
// @ts-ignore
import runScripts from "./automation-utils/jobRunner";
// @ts-ignore
import { initKnexConfig } from "./result/db/knex.config";
// @ts-ignore
import { configGen } from "./cli/resultdb";
// import { startTokenRefresh } from "./utils/azure-utils/token-refresher.js";

dotenv.config();

const knex = initKnexConfig();
// @ts-ignore
let schema: string = process.env.RESULT_DB_SCHEMA || "infoqa";

// if (process.env.EXECUTOR_TYPE === "JOB") {
//   const runUUID = process.env.TEST_RUN_UUID;
//   try {
//     runScripts().then((result) => {
//       console.log(result.message);
//       // After all scripts are executed, we can safely exit the process
//       process.exit(0);
//     });
//   } catch (err) {
//     console.error("Job script failed:", err);
//     if (runUUID) {
//       knex
//         .withSchema(schema)
//         .update({ TEST_RUN_STATUS: "Failed" })
//         .table("TEST_RUN")
//         .where({ TEST_RUN_UUID: runUUID });
//     }
//     process.exit(1); // Exit with error status
//   }
// }
// else {
//   const expressApp = express();
//   expressApp.set("trust proxy", 1);

//   const allowedOrigins = process.env.allowedOrigins
//     ? process.env.allowedOrigins.split(", ")
//     : [process.env.INFOQA_URL_HOST];

//   const corsOptions = {
//     origin: (origin: any, callback: any) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   };

//   const limiter = rateLimit({
//     windowMs: 10 * 1000, // 10 seconds
//     max: 1000, // limit each IP to 1 request per windowMs
//     message: "Too many requests from this IP, please try again later.",
//     skip: (req: any) => {
//       return whitelistedIPs.whitelistedIPs.includes(req.ip);
//     },
//   });

//   expressApp.use(compression());
//   expressApp.use(helmet());
//   expressApp.use(helmet.noSniff());
//   expressApp.use(helmet.frameguard({ action: "sameorigin" }));
//   expressApp.use(
//     helmet.contentSecurityPolicy({
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'"],
//         styleSrc: ["'self'"],
//         imgSrc: ["'self'"],
//         connectSrc: ["'self'"],
//         fontSrc: ["'self'"],
//         frameAncestors: ["'self'"],
//         objectSrc: ["'none'"],
//         upgradeInsecureRequests: [],
//       },
//     })
//   );

//   expressApp.use(limiter);
//   expressApp.use(cors(corsOptions));
//   expressApp.use(express.json({ limit: "50mb" }));
//   expressApp.use(
//     express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
//   );

//   expressApp.use((err: any, req: any, res: any, next: any) => {
//     console.error("Unhandled Error in services:", err);
//     res.status(500).send({ message: "An unexpected error occurred." });
//   });

//   expressApp.use(
//     "/infoqa-agent/api-docs",
//     swaggerUi.serve,
//     swaggerUi.setup(swaggerSpec)
//   );
//   expressApp.use("/infoqa-agent", jobRoutes);

//   expressApp.listen(process.env.PORT || 3000, async () => {
//     if (process.env.RESULT_DB_TYPE==="mssql") {
//       await startTokenRefresh();
//     }
//     console.log(
//       `🚀 Job controller running on port ${process.env.PORT || 3000}`
//     );
//   });

//   process.on("uncaughtException", (error) => {
//     console.error("uncaughtException error:", error);
//     process.exit(1);
//   });

//   process.on("unhandledRejection", (reason) => {
//     console.error("Unhandled rejection:", reason);
//     process.exit(1);
//   });
// }

configGen({
  appid: '2e850899-ca81-11ee-89d8-0a8d0133dbd7',
  testexecutedby: '622e9c89-cb3a-4012-9e95-67095f3bb694',
  testexecutionsourcetype: 'Manual', // or 'automated'
  testautomationtype: 'WebApp', // or 'unit', etc.
  suiteid: 'cca39660-bbac-4ac3-924f-692bf5aa9421',
  organizationid: '2e850899-ca81-11ee-89d8-0a8d0133dbd7',
  runAutomationSourceId: 'cca39660-bbac-4ac3-924f-692bf5aa9421',
  runAutomationSourceType: 'TEST_SUITE',
  username: 'dummy-user'
}
)