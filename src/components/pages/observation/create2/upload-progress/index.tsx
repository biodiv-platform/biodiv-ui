import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, Link, SimpleGrid, Text } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { AssetStatus } from "@interfaces/custom";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

import ProgressCard from "./progress-card";

export default function UploadProgress({ payload, data }) {
  const { t } = useTranslation();

  const [list, count] = useMemo(() => {
    const _list = payload.map((oPayload) => {
      const thumbPath = oPayload?.resources?.[0]?.path;
      let status = AssetStatus.InProgress;
      const r = data.find((oData) => oData.observation?.resources?.[0]?.path === thumbPath);

      if (r?.data) {
        status = AssetStatus.Uploaded;
      } else if (r?.observation) {
        status = AssetStatus.Failed;
      }

      return {
        status,
        observationId: r?.data?.observation?.id,
        resource: oPayload?.resources?.[0],
        commonName: oPayload?.taxonCommonName,
        scientificName: oPayload?.taxonScientificName
      };
    });

    const _count = {
      total: payload.length,
      uploaded: _list.filter((o) => o.status == AssetStatus.Uploaded).length,
      failed: _list.filter((o) => o.status == AssetStatus.Failed).length
    };

    return [
      _list,
      {
        ..._count,
        done: _count.uploaded + _count.failed
      }
    ];
  }, [payload, data]);

  const UploadContinue = () => (
    <Button
      as={Link}
      href="/observation/create2"
      colorScheme="blue"
      isDisabled={count.done !== count.total}
      rightIcon={<ArrowForwardIcon />}
    >
      {t("observation:continue")}
    </Button>
  );

  return (
    <div className="container mt">
      <PageHeading actions={<UploadContinue />}>
        {count.done === count.total
          ? count.failed > 0
            ? t("observation:saved")
            : t("observation:success")
          : t("common:processing")}
      </PageHeading>

      <Text mb={6}>
        {t("observation:creating")} [{count.done}/{count.total}]
      </Text>

      <SimpleGrid columns={{ base: 1, sm: 1, md: 4, lg: 5 }} spacing={4}>
        {list.map((item, index) => (
          <ProgressCard item={item} key={index} />
        ))}
      </SimpleGrid>
    </div>
  );
}
