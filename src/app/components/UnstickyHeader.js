import { categoryInfo } from "../content/meta";

export default function UnstickyHeader({ post }) {
  return (
    <div className="pb-4 pt-2">
      <h1 className=" font-bold text-2xl px-2 text-black">{post?.title}</h1>
      {post.tags.length > 0 && (
        <div className="p-2 font-mono text-gray-500 text-xs  flex flex-row gap-2 ">
          <div className="shrink-0 ">Part of</div>
          <div className="w-full flex-grow flex flex-row gap-2">
            {post.tags.map((tag, i) => {
              const category = categoryInfo[tag];
              return (
                <div
                  key={i}
                  className="p-1 px-2 text-xs  w-fit rounded-full "
                  style={{ borderWidth: 1, borderColor: category?.pinColor }}
                >
                  {category?.title}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
