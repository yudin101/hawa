import app from "../src/app";
import { initializeSchema } from "../src/config/db";

initializeSchema().catch(console.error);

export default app;
