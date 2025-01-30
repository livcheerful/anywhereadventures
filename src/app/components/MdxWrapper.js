import React from "react";
import CodeBlock from "../codeBlock";
import { MDXProvider } from "@mdx-js/react";

const components = {
  code: CodeBlock,
};

export default ({ children }) => {
  return (
    <MDXProvider components={components}>
      <div className="section-wrapper">
        <div className="container-fluid section-title">{children}</div>
      </div>
    </MDXProvider>
  );
};
