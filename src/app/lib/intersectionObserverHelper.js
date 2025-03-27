const ioConfiguration = {
  rootMargin: "0px 0px 95% 0px",
};

export const registerNewIO = (watched, root, cb, threshold = 1) => {
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      cb(entries);
    },
    { ...ioConfiguration, root: root, threshold: threshold }
  );

  for (let i = 0; i < watched.length; i++) {
    const c = watched[i];
    intersectionObserver.observe(c);
  }
  return intersectionObserver;
};
