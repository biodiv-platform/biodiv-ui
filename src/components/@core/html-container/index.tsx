import styled from "@emotion/styled";

const HTMLContainer = styled.div`
  width: 100%;
  word-break: break-word;

  a {
    color: var(--chakra-colors-blue-500);
    border-bottom: 1px dotted var(--chakra-colors-blue-500);
    &:hover {
      border-bottom-style: solid;
    }
  }

  ul,
  ol {
    margin-left: 1.3rem;
  }
  ol {
    list-style-type: decimal;
  }

  p,
  ul,
  ol {
    margin-bottom: 0.75rem;
  }

  hr {
    margin: 1.6rem 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  h1 {
    font-size: 2.25rem;
  }
  h2 {
    font-size: 2rem;
  }
  h3 {
    font-size: 1.875rem;
  }
  h5 {
    font-size: 1.25rem;
  }
  h6 {
    font-size: 0.875rem;
  }

  img,
  iframe,
  .table-responsive {
    overflow-x: auto;
    max-width: 86vw;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    border: 1px solid var(--chakra-colors-gray-300);
  }

  th,
  td {
    text-align: left;
    padding: 8px;
  }

  .user-profile {
    border-radius: 0.5rem;
    border: 1px solid #cbd5e0;
    padding: 0.75rem;
    background-color: #fff;
    display: flex;
    align-items: flex-start;
    margin-bottom: 1rem;

    img {
      width: 64px;
      height: 64px;
      border-radius: 0.25rem;
      margin-right: 0.75rem;
      object-fit: contain;
    }

    .name {
      font-size: 20px;
      margin-bottom: 0.5rem;
      line-height: 1rem;
    }

    .info {
      margin-bottom: 0.4rem;
      font-size: small;
      font-weight: bold;
    }

    .description {
      color: #4a5568;
      font-size: small;
    }
  }

  .user-others span {
    color: #4a5568;
    font-size: small;
  }
`;

export default HTMLContainer;
