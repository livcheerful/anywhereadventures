import PostList from "./client-page";
import { client } from "../../../tina/__generated__/client";

export default async function Page() {
  const { data } = await client.queries.postConnection();

  return (
    <>
      <h1>Posts</h1>
      <div>
        {data.postConnection.edges.map((post) => (
          <div key={post.node.id}>
            <a href={`/posts/${post.node._sys.filename}`}>
              {post.node._sys.filename}
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
