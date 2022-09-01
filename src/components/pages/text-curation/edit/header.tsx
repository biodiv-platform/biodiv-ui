import { Button, Flex, Select, Text } from "@chakra-ui/react";
import SimpleActionButton from "@components/@core/action-buttons/simple";
import { PageHeading } from "@components/@core/layout";
import { useLocalRouter } from "@components/@core/local-link";
import DownloadIcon from "@icons/download";
import EditIcon from "@icons/edit";
import { axDownloadCsv } from "@services/curate.service";
import { axGetUsersByID } from "@services/user.service";
import { sendFileFromResponse } from "@utils/download";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

import Contributors from "./contributors";
import { CURATED_STATUS } from "./table/data";
import useCurateEdit from "./use-curate-edit";

const Actions = () => {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const { rows, isShow, canEdit, datasetId } = useCurateEdit();

  const handleOnChange = (e) => rows.updateFilter("curatedStatus", e.target.value);

  const handleOnEdit = () => router.push(`/text-curation/edit/${datasetId}`);

  const handleOnDownload = async (id, curatedStatus) => {
    const { data } = await axDownloadCsv(id, curatedStatus);
    sendFileFromResponse(data, "DataSheet" + datasetId + "Download" + ".csv");
  };

  return (
    <Flex gap={4} alignItems="center">
      {canEdit && (
        <Button
          p={5}
          variant="outline"
          colorScheme="blue"
          leftIcon={<DownloadIcon />}
          onClick={() => handleOnDownload(datasetId, rows.filter.curatedStatus)}
        >
          {t("text-curation:download")}
        </Button>
      )}
      <Select onChange={handleOnChange} size="sm">
        <option value="">ALL</option>
        {Object.keys(CURATED_STATUS).map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </Select>

      {isShow && canEdit && (
        <SimpleActionButton
          icon={<EditIcon />}
          title={t("common:edit")}
          onClick={handleOnEdit}
          colorScheme="teal"
        />
      )}
    </Flex>
  );
};

export default function TextCurationHeader() {
  const { initialData, isAdmin } = useCurateEdit();
  const [curators, setCurators] = useState<any[]>();
  const [validators, setValidators] = useState<any[]>();

  const fetchIbpUsers = async (userIds, setter) => {
    const users = await axGetUsersByID(userIds);
    if (users.length > 0) {
      setter(users);
    }
  };

  useEffect(() => {
    fetchIbpUsers(initialData?.contributors?.join(","), setCurators);
    fetchIbpUsers(initialData?.validators?.join(","), setValidators);
  }, []);

  return (
    <>
      <PageHeading actions={<Actions />} mb={2} className="fadeInUp">
        {initialData.title}
      </PageHeading>
      <Text mb={6}>{initialData.description}</Text>

      <Contributors
        type="Curators"
        ibpUsers={curators}
        dataSheetId={initialData.id}
        isAdmin={isAdmin}
      />
      <Contributors
        type="Validators"
        ibpUsers={validators}
        dataSheetId={initialData.id}
        isAdmin={isAdmin}
      />
    </>
  );
}
