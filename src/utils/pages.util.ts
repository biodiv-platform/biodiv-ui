export const treeToFlat = (children: any[]) =>
  children.reduce(
    (acc, cv, idx) => [
      {
        id: cv.id,
        parentId: cv.parentId,
        pageIndex: idx
      },
      ...(cv.children.length ? treeToFlat(cv.children) : []),
      ...acc
    ],
    []
  );

export const preProcessContent = (content) =>
  content
    .replace(/\<table/g, '<div class="table-responsive"><table')
    .replace(/\<\/table\>/g, "</table></div>");
