import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";
import styled from "@emotion/styled";
import useTranslation from "@hooks/use-translation";
import { actionTabs } from "@static/documnet-list";
import { Mq } from "mq-styled-components";
import React, { useState } from "react";

import CommentsTab from "./tabs/comments";
import GroupTab from "./tabs/group";
import InfoTab from "./tabs/infotab";

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

        color: var(--gray-600);
        border-bottom: 1px solid var(--gray-300);
        border-left: 1px solid var(--gray-300);
        background: var(--gray-50);
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
        <Tabs variant="unstyled" className="tabs" index={tabIndex} onChange={setTabIndex}>
          <TabPanels height={["fit-content", "15rem"]} className="tab-content" position="relative">
            <TabPanel>
              <InfoTab
                habitatIds={o.habitatIds}
                specieIds={o.speciesGroupIds}
                document={o.document}
                user={o.userIbp}
                flags={o.flag.map((item) => ({ flag: item, user: o.userIbp }))}
              />
            </TabPanel>
            {actionTabs[1].active && (
              <TabPanel>
                <GroupTab o={o} tabIndex={tabIndex} tabLength={filterTabs.length - 2} />
              </TabPanel>
            )}
            <TabPanel>
              <CommentsTab
                tabIndex={tabIndex}
                tabLength={filterTabs.length - 1}
                documentId={o.document.id}
              />
            </TabPanel>
          </TabPanels>
          <TabList>
            {filterTabs.map(({ name, icon }) => {
              return (
                <Tab key={name}>
                  <Tooltip title={t(name)}>
                    <div>
                      {icon} <span>{t(name)}</span>
                    </div>
                  </Tooltip>
                </Tab>
              );
            })}
          </TabList>
        </Tabs>
      </VerticalTabs>
    </Flex>
  );
}
