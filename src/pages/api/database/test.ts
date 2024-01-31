// import type { NextApiRequest, NextApiResponse } from "next";
// import { getXataClient } from "@/xata";
//
// type ResponseData = {
//   message: string;
// };
//
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ResponseData>,
// ) {
//   const xata = getXataClient();
//   const record = await xata.db.users.read("rec_xyz");
//
//   console.log(record);
//
//   res.status(200).json({ message: "Hello from Next.js!" });
// }
