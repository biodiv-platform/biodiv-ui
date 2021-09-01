import { Box, Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";
import styled from "@emotion/styled";
import { actionTabs } from "@static/documnet-list";
import { Mq } from "mq-styled-components";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import CommentsTab from "./tabs/comments";
import GroupTab from "./tabs/group";
import InfoTab from "./tabs/infotab";
import TagsTab from "./tabs/tags";

const VerticalTabs = styled.div`
  flex-grow: 1;

  .tabs {
    display: flex;

    > .tab-content {
      flex-grow: 1;

      > [role="tabpanel"] {
        padding: 0;
        height: 100%;
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
  const [tabIndex, setTabIndex] = useState(0);
  const [filterTabs] = useState(actionTabs.filter((item) => item.active === true));

  return (
    <Flex
      className="white-box fade view_list"
      direction={["column", "column", "row", "row"]}
      justify="space-between"
      mb={4}
      overflow="hidden"
    >
      <VerticalTabs>
        <Tabs
          variant="unstyled"
          className="tabs"
          index={tabIndex}
          onChange={setTabIndex}
          isLazy={true}
        >
          <TabPanels height={["fit-content"]} className="tab-content" position="relative">
            <TabPanel>
              <InfoTab
                habitatIds={o.habitatIds}
                specieIds={o.speciesGroupIds}
                document={o.document}
                user={o.userIbp}
                flags={o.flag[0] ? o.flag.map((item) => ({ flag: item, user: o.userIbp })) : null}
              />
            </TabPanel>
            <TabPanel>
              <GroupTab o={o} />
            </TabPanel>
            <TabPanel>
              <TagsTab documentId={o.document.id} tags={o.tags} />
            </TabPanel>
            <TabPanel>
              <CommentsTab documentId={o.document.id} />
            </TabPanel>
          </TabPanels>
          <TabList>
            {filterTabs.map(({ name, icon }) => (
              <Tab key={name}>
                <Tooltip title={t(name)}>
                  <div>
                    {icon} <span>{t(name)}</span>
                  </div>
                </Tooltip>
              </Tab>
            ))}
            <Box borderLeft="1px" borderColor="gray.300" flexGrow={1} />
          </TabList>
        </Tabs>
      </VerticalTabs>
    </Flex>
  );
}
