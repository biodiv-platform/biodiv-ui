import autoToC from "auto-toc";

export const generateToC = (contentSelector, tocSelector) => {
  const content = document.querySelector(contentSelector);
  const headings = content.querySelectorAll("h1, h2, h3, h4, h5, h6, h7");
  const headingMap = {};

  Array.prototype.forEach.call(headings, function (heading) {
    const id = heading.id
      ? heading.id
      : heading.textContent
          .trim()
          .toLowerCase()
          .split(" ")
          .join("-")
          .replace(/[!@#$%^&*():]/gi, "")
          .replace(/\//gi, "-");
    headingMap[id] = !isNaN(headingMap[id]) ? ++headingMap[id] : 0;
    if (headingMap[id]) {
      heading.id = id + "-" + headingMap[id];
    } else {
      heading.id = id;
    }
  });
  autoToC(contentSelector, tocSelector);
};

export const getPagesMenu = (children) => {
  return children.map((l) => {
    const link = { name: l.title, to: `/page/${l.id}` };
    if (l.children.length > 0) {
      return { ...link, rows: getPagesMenu(l.children) };
    }
    return link;
  });
};

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
export const getLinkCard = ({ href, image, title, description }: any, id) => {
  const emptyImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";

  return `
        <a href="${href}" rel="noopener noreferrer" class="epc" id="${id}">
          <img alt="${title}" src="${image || emptyImage}"/>
          <div>
            <div class="label" title="${title}">${title || href}</div>
            <p title="${description}">${description || ""}</p>
          </div>
        </a>`;
};

export const addCustomStyle = (content) => {
  let customStyle = "";

  if (content.includes("img-wrap-left")) {
    customStyle += "<style> .img-wrap-left { float: left; margin-right: 40px;} </style>";
  }

  if (content.includes("img-wrap-right")) {
    customStyle += "<style> .img-wrap-right { float: right; margin-left: 40px; } </style>";
  }

  return content + customStyle;
};

export const preProcessContent = (content) => {
  let c1 = content;

  [...c1.matchAll(/<a.+preview-card.+<\/a>/gm)].forEach(([v], index) => {
    const href = /<a[\s\S]*?href=["']([^"]+)["'][\s\S]*?>/g.exec(v)?.[1];
    const previewTag = getLinkCard({ href }, `epc-${index}`);
    c1 = c1.replace(v, previewTag);
  });

  c1 = addCustomStyle(c1);

  return c1
    .replace(/\<table/g, '<div class="table-responsive"><table')
    .replace(/\<\/table\>/g, "</table></div>");
};

/**
 * This removes wrapper `<p/>` elements from card type links to prevent stacking layout issues
 *
 * @param {*} html
 * @return {*}
 */
export const removeCardWrapperParagraphs = (html) => {
  try {
    const parser = new DOMParser();

    const _dom = parser.parseFromString(html, "text/html");

    _dom.querySelectorAll("p > .preview-card").forEach((e: any) => {
      if (e.parentElement.tagName === "P") {
        e.parentElement.replaceWith(...e.parentElement.childNodes);
      }
    });

    return _dom.body.innerHTML.split("</a>").join("</a>\n");
  } catch (e) {
    console.error(e);
    return html;
  }
};

export const convertToMenuFormat = (data, basePath = "/page/", prefixGroup = true) => {
  const convertNode = (node) => {
    const menuNode = {
      name: node.title,
      to: basePath + node.id,
      rows: [],
      prefixGroup: prefixGroup
    };

    return menuNode;
  };

  return data.map((node) => convertNode(node));
};
