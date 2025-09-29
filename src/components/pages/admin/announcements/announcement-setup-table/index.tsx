import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import AddIcon from "@icons/add";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { LuCheck, LuDelete, LuPencil, LuX } from "react-icons/lu";

import { axRemoveAnnouncement } from "@/services/utility.service";
import { getInjectableHTML } from "@/utils/text";

const AnnouncementSetupTable = ({
  announcementList,
  setAnnouncementList,
  setIsCreate,
  setIsEdit,
  setEditAnnouncementData,
  setEditIndex
}) => {
  const { t } = useTranslation();
  const { languageId } = useGlobalState();

  const onDelete = async (index) => {
    const { success } = await axRemoveAnnouncement(announcementList[index].announcementId);
    if (success) {
      setAnnouncementList(announcementList.filter((_, idx) => idx !== index));
    }
  };

  const onEdit = async (index) => {
    setIsEdit(true);
    setEditAnnouncementData(announcementList[index]);
    setEditIndex(index)
  };

  return (
    <>
      <table style={{ minWidth: "750px" }} className="table table-bordered">
        <thead>
          <tr>
            <th>{"Description"}</th>
            <th>{"Color"}</th>
            <th>{"Bg Color"}</th>
            <th>{"Enabled"}</th>
            <th>{"Actions"}</th>
          </tr>
        </thead>
        {announcementList.map((item, index) => (
          <tr>
            <td width={"450px"}>
              <Box
                dangerouslySetInnerHTML={{
                  __html: getInjectableHTML(item.translations[languageId]||item.translations[SITE_CONFIG.LANG.DEFAULT_ID])
                }}
              ></Box>
            </td>
            <td>
              <Box
                height={8}
                bg={item.color}
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
              />
            </td>
            <td>
              <Box
                height={8}
                bg={item.bgColor}
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
              />
            </td>
            <td>
              {/* ml={2} */}
              {item.enabled ? <LuCheck color={"blue"} /> : <LuX color={"red"} />}
            </td>
            <td>
              <Button onClick={() => onDelete(index)} colorPalette="red" ml={2}>
                <LuDelete />
                {t("common:delete")}
              </Button>
            </td>
            {
              <td>
                <Button onClick={() => onEdit(index)} colorPalette="blue" ml={2}>
                  <LuPencil />
                  {t("common:edit")}
                </Button>
              </td>
            }
          </tr>
        ))}
        <tbody></tbody>
      </table>
      <ButtonGroup gap={4} mt={4}>
        <Button colorPalette="blue" onClick={() => setIsCreate(true)}>
          <AddIcon />
          {"Create Announcement"}
        </Button>
      </ButtonGroup>
    </>
  );
};

export default AnnouncementSetupTable;
