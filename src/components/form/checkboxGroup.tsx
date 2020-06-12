import { Checkbox, FormControl, FormErrorMessage, FormHelperText, Heading, CheckboxGroup } from "@chakra-ui/core";
import React, { useEffect } from "react";
import { FormContextValues } from "react-hook-form";

interface Options {
    name: string,
    value?: string
}
interface ITextBoxProps {
    name: string;
    label: string;
    mt?: number;
    mb?: number;
    disabled?: boolean;
    list: Options[];
    defaultValue?: any[];
    hint?: string;
    form: FormContextValues<any>;
}

const CheckboxField = ({
    name,
    label,
    form,
    mb = 4,
    list,
    defaultValue = [],
    hint,
    ...props
}: ITextBoxProps) => {
    const handeClick = (item) => {
        form.setValue(label, item)
    }

    useEffect(() => {
        form.register({ name: label })
    }, [form.register])


    return (
        <FormControl mt={[5]} isInvalid={form.errors[name] && true} mb={mb} {...props}>
            <Heading as="h3" mb={[8]} size="md">{label}</Heading>
            <CheckboxGroup
                defaultValue={defaultValue}
                onChange={(v) => handeClick(v)}
                display="grid"
                className="custom-checkbox-group"
                gridGap={5}
                gridTemplateColumns="repeat(3, 0.3fr)"
            >
                {list.map((item, index) => (
                    <Checkbox key={index} value={item.value || item.name}>
                        {item.name}
                    </Checkbox>
                ))}
            </CheckboxGroup>
            <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
            {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
        </FormControl>
    )
}

export default CheckboxField;
