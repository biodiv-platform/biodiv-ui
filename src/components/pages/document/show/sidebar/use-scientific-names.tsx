import { axGetDocumentScientificNames } from "@services/document.service";
import { is } from "immer/dist/internal";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";

const LIMIT = 10;

export default function useScientificNames(documentId) {
  const [names, setNames] = useImmer({
    list: [],
    offset: 0,
    isLoading: true,
    toDeleteName:false
  });

  const loadMore = async (getter, setter, reset) => {
    setter((_draft) => {
      _draft.isLoading = true;
    });

    const { success, data } = await axGetDocumentScientificNames(documentId,
     /* eslint no-console: ["error", { allow: ["warn", "error","log"] }] */
      {offset:reset?0:getter.offset}
    );
    /* eslint no-console: ["error", { allow: ["warn", "error","log"] }] */
    console.log("reset value is ",reset);
    setter((_draft) => {
      if (success) {
        /* eslint no-console: ["error", { allow: ["warn", "error","log"] }] */
        console.log("here is the data")
        console.log(data);
        if (reset) {
          _draft.list = data;
          _draft.offset = LIMIT;
        } else {
          if (data) {
            _draft.list.push(...data);
            _draft.offset = _draft.offset + LIMIT;
          }
        }
      }
      _draft.isLoading = false;
    });
  };

  const loadMoreNames = () => loadMore(names, setNames, false);

   useEffect(() => {
     loadMore(names, setNames, true);
   },[names.toDeleteName]);

  return {
    namesData: { data: names, loadMore: loadMoreNames }
  };
}
