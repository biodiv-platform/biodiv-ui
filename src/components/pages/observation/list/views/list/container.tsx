import { Box, Flex, Spinner, Tabs } from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import styled from "@emotion/styled";
import { ObservationData } from "@interfaces/custom";
import { actionTabs } from "@static/observation-list";
import { Mq } from "mq-styled-components";
import useTranslation from "next-translate/useTranslation";
import React, { Suspense, useState } from "react";

import ImageBoxComponent from "./image";
import InfoTab from "./tabs/info";

const CommentsTab = React.lazy(() => import("./tabs/comments"));
const CustomFieldsTab = React.lazy(() => import("./tabs/custom-fields"));
const GroupsTab = React.lazy(() => import("./tabs/groups"));
const RecoSuggestionTab = React.lazy(() => import("./tabs/reco-suggestion"));
const TraitsTab = React.lazy(() => import("./tabs/traits"));

export const VerticalTabs = styled.div`
  flex-grow: 1;

  .tabs {
    display: flex;

    > .tab-content {
      flex-grow: 1;

      > [role="tabpanel"] {
        padding: 0;
        height: 100%;
        max-height: 18rem;
        overflow-y: auto;
        position: relative;
      }
    }

    > [role="tablist"] {
      flex-direction: column;

      flex-shrink: 0;

      > [role="tab"] {
        display: block;

        width: 100%;
        min-width: 10rem;
        height: 3rem;

        text-align: left;
        white-space: nowrap;

        color: var(--chakra-colors-gray-600);
        border-bottom: 1px solid var(--chakra-colors-gray-300);
        border-left: 1px solid var(--chakra-colors-gray-300);
        background: var(--chakra-colors-gray-50);
        filter: grayscale(1);
      }

      > [role="tab"]:last-child {
        border-bottom: 0;
      }

      > [role="tab"][aria-selected="true"] {
        white-space: nowrap;

        color: inherit;
        border-left-color: transparent;
        background: white;

        filter: none;
      }
    }
  }

  ${Mq.max.sm} {
    .tabs {
      display: flex;
      flex-direction: column-reverse;

      > [role="tablist"] {
        overflow-x: scroll;
        flex-direction: row;

        width: 100%;
      }
    }
  }

  ${Mq.min.md + " and (max-width: 1024px)"} {
    [role="tab"] span {
      display: none;
    }
  }
`;

export default function Container({ o }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState("common:information");

  const { setObservationData, getCheckboxProps } = useObservationFilter();

  const recoUpdated = (payload) => {
    setObservationData((_draft: ObservationData) => {
      const i = _draft.l.findIndex((ob) => o.observationId === ob.observationId);
      _draft.l[i].recoShow = payload;
    });
  };

  return (
    <Flex
      className="white-box fade view_list"
      direction={["column", "column", "row", "row"]}
      justify="space-between"
      mb={4}
      overflow="hidden"
    >
      <ImageBoxComponent o={o} getCheckboxProps={getCheckboxProps} />
      <VerticalTabs>
        <Tabs.Root variant="plain" className="tabs" lazyMount value={tab}>
          <Tabs.ContentGroup className="tab-content" position="relative">
            <Tabs.Content value="common:information">
              <InfoTab o={o} recoUpdated={recoUpdated} setTab={setTab} />
            </Tabs.Content>

            <Tabs.Content value="observation:id.title">
              <Suspense fallback={<Spinner />}>
                <RecoSuggestionTab o={o} recoUpdated={recoUpdated} />
              </Suspense>
            </Tabs.Content>

            <Tabs.Content value="common:usergroups">
              <Suspense fallback={<Spinner />}>
                <GroupsTab o={o} />
              </Suspense>
            </Tabs.Content>

            <Tabs.Content value="observation:traits">
              <Suspense fallback={<Spinner />}>
                <TraitsTab o={o} />
              </Suspense>
            </Tabs.Content>

            <Tabs.Content value="observation:custom_fields">
              <Suspense fallback={<Spinner />}>
                <CustomFieldsTab o={o} />
              </Suspense>
            </Tabs.Content>

            <Tabs.Content value="form:comments.title">
              <Suspense fallback={<Spinner />}>
                <CommentsTab observationId={o.observationId} />
              </Suspense>
            </Tabs.Content>
          </Tabs.ContentGroup>

          <Tabs.List>
            {actionTabs.map(({ name, icon, active = true }) => (
              <Tabs.Trigger
                value={name}
                key={name}
                data-hidden={!active}
                onClick={() => setTab(name)}
              >
                <Tooltip title={t(name)}>
                  <div>
                    {icon} <span>{t(name)}</span>
                  </div>
                </Tooltip>
              </Tabs.Trigger>
            ))}
            <Box borderLeft="1px" borderColor="gray.300" flexGrow={1} />
          </Tabs.List>
        </Tabs.Root>
      </VerticalTabs>
    </Flex>
  );
}
