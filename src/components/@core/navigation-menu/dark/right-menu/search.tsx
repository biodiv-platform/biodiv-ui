import styled from "@emotion/styled";
import { googleSearch } from "@utils/search";
import { Mq } from "mq-styled-components";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const SearchForm = styled.form`
  input {
    padding: 0.25rem 1rem;
    border: 0;
    line-height: 1.8;
    border-radius: 2rem;
    width: 11rem;
    background: var(--gray-700);
    color: var(--white);
    &:focus {
      background: var(--white);
      color: initial;
    }
  }
  ${Mq.max.sm} {
    width: 100%;
    margin-bottom: 1rem;
    input {
      width: 100%;
    }
  }
  ${Mq.max.md} {
    input {
      width: 6.5rem;
    }
  }
`;

export default function Search() {
  const { t } = useTranslation();

  const handleOnSearch = (e) => {
    e.preventDefault();
    googleSearch(e.target.elements["search"].value);
  };

  return (
    <SearchForm onSubmit={handleOnSearch}>
      <input name="search" type="search" placeholder={t("header:search")} />
    </SearchForm>
  );
}
