import { axVerifyTaxonPermission } from "@services/taxonomy.service";
import { axVerifyRequest } from "@services/usergroup.service";
import React, { useEffect, useState } from "react";

import Processing from "../processing";

export default function VerifyRequestComponent({ token, type }) {
  const [status, setStatus] = useState({ loading: true, success: false });

  useEffect(() => {
    switch (type) {
      case "taxon-request":
        axVerifyTaxonPermission(token).then((res) => setStatus({ loading: false, ...res }));
        break;

      default:
        axVerifyRequest(token).then((res) => setStatus({ loading: false, ...res }));
        break;
    }
  }, []);

  return <Processing {...status} />;
}
