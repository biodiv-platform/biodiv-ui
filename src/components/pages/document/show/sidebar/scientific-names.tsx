import React from "react";
import useScientificNames from "./use-scientific-names";
import ScientificNamesTable from "./table-scientific-names";



export default function ScientificNames ({documentId,authorId})  {
  const scientficNamesData=useScientificNames(documentId);
 /* eslint no-console: ["error", { allow: ["warn", "error","log"] }] */
  console.log(scientficNamesData.namesData.data);

  return (
   <><ScientificNamesTable
      data={scientficNamesData.namesData.data}
      title={"Scientific names"}
      loadMoreNames={scientficNamesData.namesData.loadMore}
      authorId={authorId}
      nameData={scientficNamesData.namesData.data}
      />
      <div>Hello there</div>
      </>
  );
};

