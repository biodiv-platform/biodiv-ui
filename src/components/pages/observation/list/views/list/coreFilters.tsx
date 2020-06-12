import React from 'react'
import { Grid, Text, Heading, Box } from '@chakra-ui/core'
import { observationFilterList } from '@static/observationFiltersList'


export default function CoreFilterList() {

    return (
        <Box bg="gray.100" p={[0, 15]}>
            <Heading as="h3" size="md">
                Core Fields
           </Heading>
            <Grid mt={[5]} templateColumns="repeat(4,0.4fr)" gap={3}>
                {observationFilterList.core.map((item, index) => (
                    <Text key={index}>{item.name}</Text>
                ))}
            </Grid>
        </Box>
    )
}