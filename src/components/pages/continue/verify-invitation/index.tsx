import { axVerifyInvitation } from "@services/usergroup.service";
import React, { useEffect, useState } from "react";

import Processing from "../processing";

export default function VerifyInvitationComponent({ token }) {
  const [status, setStatus] = useState({ loading: true, success: false });

  useEffect(() => {
    axVerifyInvitation(token).then((res) => setStatus({ loading: false, ...res }));
  }, []);

  return <Processing {...status} />;
}
