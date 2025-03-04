import Comic from "./src/app/components/mdx/Comic";
import LOCItem from "./src/app/components/mdx/LOCItem";
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
  h1: ({ children }) => <h1 className="p-2 text-2xl font-bold">{children}</h1>,
  h2: ({ children }) => <h2 className="p-2 text-xl font-bold">{children}</h2>,
  p: ({ children }) => <div className="p-2 py-4 font-medium ">{children}</div>,
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
  Comic: ({
    speechBubbles,
    image,
    position,
    overlap,
    absoluteHeight,
    children,
  }) => {
    return (
      <Comic
        overlap={overlap}
        speechBubbles={speechBubbles}
        image={image}
        position={position}
        absoluteHeight={absoluteHeight}
      ></Comic>
    );
  },
};
