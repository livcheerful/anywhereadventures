export const tagsByCity = {
  seattle: ["infrastructure", "bridges", "downtown", "university"],
};

// multiiple pages to view places by
export const journeyCollections = {
  seattle: [
    { title: "neighborhood", tagsIncluded: ["downtown", "capitol hill"] },
    { title: "theme", tagsIncluded: ["mayors", "bridges"] },
    // default always add a "browse all locations"
  ],
  sewy: [],
  chicago: [],
};

export const categoryInfo = {
  bridges: { pinColor: "#f29100", description: "Seattle is a city of hills." },
  infrastructure: {
    pinColor: "#f29100",
    description: "Roads, bridges, sidewalks, and the in betweens",
  },
};
