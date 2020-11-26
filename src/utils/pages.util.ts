export const treeToFlat = (children: any[], parentId = 0) =>
  children.reduce(
    (acc, cv, pageIndex) => [
      {
        id: cv.id,
        parentId,
        pageIndex
      },
      ...(cv.children.length ? treeToFlat(cv.children, cv.id) : []),
      ...acc
    ],
    []
  );

export const preProcessContent = (content) =>
  content
    .replace(/\<table/g, '<div class="table-responsive"><table')
    .replace(/\<\/table\>/g, "</table></div>");
