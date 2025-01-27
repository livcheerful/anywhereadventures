import client from "../../../tina/__generated__/client";

export const fetchPostBySlug = async (slug) => {
  console.log("in fetchpostbyslug");
  const post = await client.queries.postConnection({
    filter: { slug: { eq: slug } },
  });
  return post.data.postConnection.edges;
};

export const fetchPostsByLocation = async (location) => {
  console.log("in fetchByLocation");
  const post = await client.queries.postConnection({
    filter: { location: { eq: location } },
  });
  return post.data.postConnection.edges;
};
