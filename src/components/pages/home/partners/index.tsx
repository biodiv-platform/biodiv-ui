import { Heading, Link, SimpleGrid } from "@chakra-ui/core";
import styled from "@emotion/styled";
import useTranslation from "@hooks/use-translation";
import partnersData from "@static/partners";
import React from "react";
import LazyLoad from "react-lazyload";

const PartnerImage = styled.img`
  width: 100%;
  height: 5rem;
  border-radius: 0.5rem;
  background: var(--gray-200);
  overflow: hidden;
  border: 2px solid var(--gray-200);
`;

export default function Partners() {
  const { t } = useTranslation();

  return (
    <>
      <Heading as="h2" mb={6} fontSize="2rem">
        {t("HOME.PARTNERS")}
      </Heading>
      <LazyLoad once={true}>
        <SimpleGrid className="fade" columns={[2, 2, 4, 7]} spacing={6} mb={10}>
          {partnersData.map(({ image, name, link }) => (
            <Link href={link} title={name} key={link}>
              <PartnerImage alt={name} loading="lazy" src={`/partners-images/${image}`} />
            </Link>
          ))}
        </SimpleGrid>
      </LazyLoad>
    </>
  );
}
