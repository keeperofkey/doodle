import { list } from '@vercel/blob';
 
export const config = {
  runtime: 'edge',
};
 
export default async function blobs(request: Request) {
  const { blobs } = await list();
  return Response.json(blobs);
}
