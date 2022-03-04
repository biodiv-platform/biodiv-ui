import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react';
import debounce from 'debounce-promise';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { HsvColorPicker } from 'react-colorful';

import useSpeciesList from '../../../use-species-list';

export interface FilterHsvProps {
    filterKey;
    label?;
    translateKey?;
}

export default function HsvColorFilter(props: FilterHsvProps) {
    
    const { addFilter, removeFilter } = useSpeciesList();
    const { t } = useTranslation();
    const onQuery = debounce((val) => handleOnChange(val), 200);

    const handleOnChange = (val) => {
        if (val) {
            const { h, s, v } = val;
            addFilter(props.filterKey, `${h},${s},${v}`);
        } else {
            removeFilter(props.filterKey);
        }
    };

    return (
        <AccordionItem>
            {({ isExpanded }) => (
                <>
                    <AccordionButton>
                        <Box flex={1} textAlign="left">
                            {props.label || t(props.translateKey + "title")}
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>{isExpanded && <HsvColorPicker onChange={onQuery} />}</AccordionPanel>
                </>
            )}
        </AccordionItem>
    );
}
