import Comic from "./src/app/components/mdx/Comic";
export function useMDXComponents(components) {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => (
      <h1 style={{ color: "red", fontSize: "48px" }}>{children}</h1>
    ),
    h2: ({ children }) => <h2 className="">{children}VVIVIVNNSN</h2>,
    ...components,
  };
}

export const MyMDXComponents = {
  h1: ({ children }) => <h1 className="p-2 text-4xl font-bold">{children}</h1>,
  h2: ({ children }) => <h2 className="p-2 text-2xl font-bold">{children}</h2>,
  p: ({ children }) => <div className="p-2">{children}</div>,
  Comic: ({ speechBubbles, image, children }) => {
    console.log("in making comic mdx");
    console.log(speechBubbles);
    return (
      <Comic speechBubbles={speechBubbles} image={image}>
        This will be a comic{children}
      </Comic>
    );
  },
};
