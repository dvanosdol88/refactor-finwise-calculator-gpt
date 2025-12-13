import { createApp } from "../server/app";

// Vercel serverless function entry point
export default async (req: any, res: any) => {
  const { app } = await createApp();
  app(req, res);
};
