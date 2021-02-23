import { Box, FormLabel, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import WKT, { WKTProps } from "@components/@core/WKT";
import WKTSearch from "@components/@core/WKT/search";
import WKTList from "@components/@core/WKT/wkt-list";
import useTranslation from "@hooks/use-translation";
import React, { useEffect, useState } from "react";
import { UseFormMethods } from "react-hook-form";

interface WKTInputProps extends Omit<WKTProps, "onSave"> {
  form: UseFormMethods<Record<string, any>>;
}

export default function WKTFieldMulti(props: WKTInputProps) {
  const { t } = useTranslation();
  const initialValue = props.form.control.defaultValuesRef.current[props.name];
  const [value, setValue] = useState(initialValue || []);

  const handleOnSave = (o) => {
    setValue([...value, o]);
  };

  const handleOnDelete = (index) => {
    setValue(value.filter((_, i) => i !== index));
  };

  useEffect(() => {
    props.form.register({ name: props.name });
  }, []);

  useEffect(() => {
    props.form.setValue(props.name, value);
  }, [value]);

  return (
    <Box mb={props.mb || 4}>
      <FormLabel>{props.label}</FormLabel>
      <Box border="1px" borderColor="gray.300" bg="white" borderRadius="md">
        <Tabs isLazy={true}>
          <TabList>
            <Tab>{t("DOCUMENT.GEOENTITIES")}</Tab>
            <Tab>{t("DOCUMENT.WKT")}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <WKTSearch {...props} onSave={handleOnSave} />
            </TabPanel>
            <TabPanel>
              <WKT {...props} onSave={handleOnSave} />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Box>
          <Box px={4} pb={2}>
            {t("DOCUMENT.SELECTED_PLACES")}
          </Box>
          <WKTList list={value} onDelete={handleOnDelete} {...props} />
        </Box>
      </Box>
    </Box>
  );
}
