import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, LinkOverlay, SimpleGrid, Text } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import LocalLink from "@components/@core/local-link";
import ListIcon from "@icons/list";
import { AssetStatus } from "@interfaces/custom";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

import ProgressCard from "./progress-card";

export default function UploadProgress({ payload, data }) {
  const { t } = useTranslation();
  const router = useRouter();

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
        observationId: r?.data,
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

  return (
    <div className="container mt">
      <PageHeading
        actions={
          <ButtonGroup spacing={4}>
            <LocalLink prefixGroup={true} href="/observation/list">
              <Button
                as={LinkOverlay}
                colorScheme="blue"
                variant="outline"
                leftIcon={<ListIcon />}
                isDisabled={count.done !== count.total}
              >
                {t("header:menu_secondary.observation.all_observations")}
              </Button>
            </LocalLink>
            <Button
              colorScheme="blue"
              variant="outline"
              rightIcon={<ArrowForwardIcon />}
              isDisabled={count.done !== count.total}
              onClick={router.reload}
            >
              {t("observation:continue")}
            </Button>
          </ButtonGroup>
        }
      >
        {count.done === count.total
          ? count.failed > 0
            ? t("observation:saved")
            : t("observation:success")
          : t("common:processing")}
      </PageHeading>

      <Text mb={6}>
        {t("observation:creating")} [{count.done}/{count.total}]
      </Text>

      <SimpleGrid columns={{ base: 1, sm: 1, md: 4, lg: 5 }} spacing={4} mb={6}>
        {list.map((item, index) => (
          <ProgressCard item={item} key={index} />
        ))}
      </SimpleGrid>
    </div>
  );
}
