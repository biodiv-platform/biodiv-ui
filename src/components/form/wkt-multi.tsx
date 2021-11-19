import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/react";
import WKT, { WKTProps } from "@components/@core/WKT";
import GmapsWktLocationPicker from "@components/@core/WKT/gmaps-wkt";
import WKTDrawViewer from "@components/@core/WKT/wkt-draw-viewer";
import WKTList from "@components/@core/WKT/wkt-list";
import SITE_CONFIG from "@configs/site-config";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { useController } from "react-hook-form";

interface WKTInputProps extends Omit<WKTProps, "onSave"> {
  isMultiple?;
  canDraw?;
  gMapTab: boolean;
}

export default function WKTFieldMulti(props: WKTInputProps) {
  const { t } = useTranslation();
  const { field, fieldState } = useController({ name: props.name });
  const [value, setValue] = useState(field.value || []);
  const [isDisabled, setIsdisabled] = useState<boolean>(false);
  const Viewer = props.canDraw ? WKTDrawViewer : WKT;

  const handleOnSave = (o) => {
    setValue([...value, o]);
  };

  const handleOnDelete = (index) => {
    setValue(value.filter((_, i) => i !== index));
  };

  useEffect(() => {
    setIsdisabled(!props.isMultiple && value.length >= 1);
    field.onChange(value);
  }, [value]);

  return (
    <FormControl isInvalid={fieldState.invalid}>
      <Box mb={props.mb || 4}>
        <FormLabel>{props.label}</FormLabel>
        <Box border="1px" borderColor="gray.300" bg="white" borderRadius="md">
          <Tabs defaultIndex={SITE_CONFIG?.WKT?.DEFAULT_TAB} isLazy={true}>
            <TabList>
              <Tab>{t("form:gmaps")}</Tab>
              <Tab>{t("form:search_point")}</Tab>
            </TabList>
            <Box>
              {value.length > 0 && (
                <Box>
                  <Box px={4} pt={2} pb={2}>
                    {t("form:selected_places")}
                  </Box>
                  <WKTList list={value} onDelete={handleOnDelete} {...props} />
                </Box>
              )}
            </Box>
            <TabPanels>
              <TabPanel>
                <Viewer {...props} disabled={isDisabled} onSave={handleOnSave} />
              </TabPanel>
              <TabPanel>
                <GmapsWktLocationPicker
                  {...props}
                  label={t("form:coverage.place")}
                  disabled={isDisabled}
                  onSave={handleOnSave}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
      <FormErrorMessage children={JSON.stringify(fieldState?.error?.message)} />
    </FormControl>
  );
}
