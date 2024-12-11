export async function GET(req, { params }) {
  console.log("in path handler api whatever");
  const path = (await params).path;
  console.log(path);
  //   res.end(`path: ${path}`);
  const r = await fetch(`https://anywhereadventures.vercel.app/${path}`);
  const file = await r.text();
  console.log(file);
  return Response.json({ html: file });
}
