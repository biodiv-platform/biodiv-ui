import GroupListPageComponent from "@components/pages/group/list";
import { GroupListFilterProvider } from "@components/pages/group/list/use-group-list";
import { axGetspeciesGroups } from "@services/observation.service";
import { axGroupListExpanded } from "@services/usergroup.service";
import { axGetAllHabitat } from "@services/utility.service";
import { getLanguageId } from "@utils/i18n";
import { parse, stringify } from "@utils/query-string";
import React from "react";

const GroupListPage = (props) => (
  <GroupListFilterProvider {...props}>
    <GroupListPageComponent />
  </GroupListFilterProvider>
);

export const getServerSideProps = async (ctx) => {
  const [groupListExpanded, speciesGroups, habitat] = await Promise.all([
    axGroupListExpanded(getLanguageId(ctx.locale)?.ID),
    axGetspeciesGroups(),
    axGetAllHabitat()
  ]);

  return {
    props: {
      filter: parse(stringify(ctx.query), ["speciesGroupIds", "habitatIds"]), // this to parse params as numeric array

      userGroupList: groupListExpanded.data,
      speciesGroups: speciesGroups.data,
      habitat: habitat.data
    }
  };
};

export default GroupListPage;
