import { Heading, Image, Link, SimpleGrid } from "@chakra-ui/react";
import React from "react";

const Supporters = ({ title, list, imagePrefix }) => (
  <>
    <Heading as="h2" mb={6} fontSize="2rem">
      {title}
    </Heading>
    <SimpleGrid className="fade" columns={[2, 2, 4, 7]} spacing={6} mb={10}>
      {list.map(({ image, name, link }) => (
        <Link target="_blank" rel="noopener" href={link} title={name} key={link}>
          <Image
            w="100%"
            h="5rem"
            borderRadius="md"
            bg="white"
            overflow="hidden"
            border="2px solid"
            borderColor="gray.200"
            alt={name}
            loading="lazy"
            src={imagePrefix + image}
          />
        </Link>
      ))}
    </SimpleGrid>
  </>
);
export default Supporters;
