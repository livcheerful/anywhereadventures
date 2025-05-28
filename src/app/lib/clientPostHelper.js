// Fetch MDX for all locations
export async function getMdx(locations, cb) {
  const ca = [];
  for (const l of locations) {
    const file = await fetch(`/content/generated/${l}.json`);
    const f = await file.json();
    ca.push(f);
  }
  cb(ca);
}
