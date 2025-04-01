import BigLink from "./mdx/BigLink";
import Comic from "./mdx/Comic";

export default function MoreResearchPage() {
  return (
    <div className="pl-16 pt-4 overflow-x-hidden">
      <div>
        <Comic
          position="right"
          image="/comics/Vivian.png"
          speechBubbles={[
            {
              text: "If you want to find cool items in the Library of Congress yourself, you can try out these research guides!",
            },
          ]}
        />
      </div>
      <div className="flex flex-row flex-wrap gap-2">
        <BigLink
          link="https://guides.loc.gov/architecture-design-engineering-collections"
          thumbnail="/placeholderThumbnail.png"
          title="Architecture, Design and Engineering Collections"
        />
        <BigLink
          link="https://guides.loc.gov/illinois-state-guide"
          thumbnail="/placeholderThumbnail.png"
          title="Illinois State Research Guide"
        />
        <BigLink
          link="https://guides.loc.gov/washington-state-guide"
          thumbnail="/placeholderThumbnail.png"
          title="Washington State Research Guide"
        />
        <BigLink
          link="https://guides.loc.gov/wyoming-state-guide"
          thumbnail="/placeholderThumbnail.png"
          title="Wyoming State Research Guide"
        />
      </div>
      <div>
        <Comic
          position="right"
          image="/comics/Vivian.png"
          speechBubbles={[
            {
              text: "These were made by Library of Congress staff, and are a great starting point.",
            },
          ]}
        />
      </div>
    </div>
  );
}
