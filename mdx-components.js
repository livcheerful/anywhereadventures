import Comic from "./src/app/components/mdx/Comic";
import LOCItem from "./src/app/components/mdx/LOCItem";
import BigLink from "./src/app/components/mdx/BigLink";
import ComicSection from "./src/app/components/mdx/ComicSection";
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
    <h1 className="pb-1 px-2 text-xl font-bold ">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="pb-1 px-2 text-lg font-bold">{children}</h2>
  ),
  li: ({ children }) => <li className="list-disc">{children}</li>,
  ul: ({ children }) => <ul className="list-disc">{children}</ul>,
  p: ({ children }) => <div className="pb-3 px-2 font-medium ">{children}</div>,
  LOCItem: ({ image, assetLink, linkOut, caption, alt, children }) => {
    return (
      <LOCItem
        image={image}
        assetLink={assetLink}
        linkOut={linkOut}
        caption={caption}
        alt={alt}
      />
    );
  },
  BigLink: ({ link, thumbnail, title, children }) => {
    return <BigLink link={link} thumbnail={thumbnail} title={title} />;
  },
  ComicSection: ({ elements, children }) => {
    return <ComicSection elements={elements}></ComicSection>;
  },
  Comic: ({
    speechBubbles,
    image,
    position,
    overlap,
    alt,
    absoluteHeight,
    caption,
    size,
    children,
  }) => {
    return (
      <Comic
        overlap={overlap}
        speechBubbles={speechBubbles}
        image={image}
        alt={alt}
        position={position}
        absoluteHeight={absoluteHeight}
        caption={caption}
        size={size}
      ></Comic>
    );
  },
};
