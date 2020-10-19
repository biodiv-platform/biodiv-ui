export const cleanTags = (tags) => {
  return (
    tags?.map(({ label: name, value = 0, version }) => ({
      id: name !== value ? value : null,
      version,
      name
    })) || []
  );
};
