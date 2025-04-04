import Comic from "./src/app/components/mdx/Comic";
import LOCItem from "./src/app/components/mdx/LOCItem";
import BigLink from "./src/app/components/mdx/BigLink";
export function useMDXComponents(components) {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => (
      <h1 style={{ color: "red", fontSize: "48px" }}>{children}</h1>
    ),
    h2: ({ children }) => <h2 className="">{children}</h2>,
    ...components,
  };
}

export const MyMDXComponents = {
  h1: ({ children }) => (
    <h1 className="pb-1 px-2 text-xl font-bold">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="pb-1 px-2 text-lg font-bold">{children}</h2>
  ),
  p: ({ children }) => <div className="pb-3 px-2 font-medium ">{children}</div>,
  LOCItem: ({ image, assetLink, linkOut, caption, children }) => {
    return (
      <LOCItem
        image={image}
        assetLink={assetLink}
        linkOut={linkOut}
        caption={caption}
      />
    );
  },
  BigLink: ({ link, thumbnail, title, children }) => {
    return <BigLink link={link} thumbnail={thumbnail} title={title} />;
  },
  Comic: ({
    speechBubbles,
    image,
    position,
    overlap,
    absoluteHeight,
    caption,
    children,
  }) => {
    return (
      <Comic
        overlap={overlap}
        speechBubbles={speechBubbles}
        image={image}
        position={position}
        absoluteHeight={absoluteHeight}
        caption={caption}
      ></Comic>
    );
  },
};
