import useTranslation from "@hooks/use-translation";
import styled from "@emotion/styled";
import { googleSearch } from "@utils/search";
import { Mq } from "mq-styled-components";
import React, { useRef } from "react";

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
  const queryInput = useRef(null);
  const { t } = useTranslation();

  const handleOnSearch = (e) => {
    e.preventDefault();
    googleSearch(queryInput.current.value);
  };

  return (
    <SearchForm onSubmit={handleOnSearch}>
      <input type="search" placeholder={t("HEADER.SEARCH")} ref={queryInput} />
    </SearchForm>
  );
}
