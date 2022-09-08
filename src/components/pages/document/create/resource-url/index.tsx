import { TextBoxField } from "@components/form/text";
import useTranslation from "next-translate/useTranslation";
import React from "react";



export default function ExternalUrl() {
    const { t } = useTranslation();

    return (
        <TextBoxField name="externalUrl" label={t("document:upload.url")} isRequired={true} />
    );
}
