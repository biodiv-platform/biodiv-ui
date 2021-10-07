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
import WKTSearch from "@components/@core/WKT/search";
import WKTDrawViewer from "@components/@core/WKT/wkt-draw-viewer";
import WKTList from "@components/@core/WKT/wkt-list";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { useController } from "react-hook-form";

interface WKTInputProps extends Omit<WKTProps, "onSave"> {
  isMultiple?;
  canDraw?;
}

export default function WKTFieldMulti(props: WKTInputProps) {
  const { t } = useTranslation();
  const { field, fieldState } = useController({ name: props.name });
  const [value, setValue] = useState(field.value || []);
  const [isDisabled, setIsdisabled] = useState<boolean>(false);

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
          <Tabs isLazy={true}>
            <TabList>
              <Tab>{t("form:geoentities")}</Tab>
              <Tab>{t("form:wkt")}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <WKTSearch {...props} isDisabled={isDisabled} onSave={handleOnSave} />
              </TabPanel>
              <TabPanel>
                {props.canDraw ? (
                  <WKTDrawViewer {...props} disabled={isDisabled} onSave={handleOnSave} />
                ) : (
                  <WKT {...props} disabled={isDisabled} onSave={handleOnSave} />
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Box>
            <Box px={4} pb={2}>
              {t("form:selected_places")}
            </Box>
            <WKTList list={value} onDelete={handleOnDelete} {...props} />
          </Box>
        </Box>
      </Box>
      <FormErrorMessage children={JSON.stringify(fieldState?.error?.message)} />
    </FormControl>
  );
}
