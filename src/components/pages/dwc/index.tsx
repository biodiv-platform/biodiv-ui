"use client";

import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  NativeSelect,
  Pagination,
  Separator,
  Spacer,
  Stack,
  Table,
  Text
} from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { LuChevronLeft, LuChevronRight, LuDownload, LuTrash2 } from "react-icons/lu";

import { axCreateDwc, axDeleteDwcFile } from "@/services/files.service";
import { formatTimeStampFromUTC } from "@/utils/date";
import notification, { NotificationType } from "@/utils/notification";

import useDwcLogsList from "./use-dwc-filter-log";

export default function GbifExportTable() {
  const { t } = useTranslation();

  const { DwcLogData, filter, setFilter, addFilter, resetFilter } = useDwcLogsList();
  const files = DwcLogData?.l || [];
  const filePath = DwcLogData?.filePath;
  const pageSize = 15;
  const currentPage = Math.floor((filter?.offset || 0) / pageSize) + 1;

  const [isCreating, setIsCreating] = useState(false);

  const hasInProgress = files.some((f) => f.status === "IN_PROGRESS");

  const lastGeneratedOn = files.length
    ? formatTimeStampFromUTC(Math.max(...files.map((f) => f.date || 0)))
    : "--";

  const handlePageChange = (page: number) => {
    setFilter((draft) => {
      draft.offset = (page - 1) * pageSize;
      draft.limit = pageSize;
    });
  };

  const handleDelete = async (file) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${file.fileName}?`);
    if (!confirmDelete) return;

    const { success } = await axDeleteDwcFile(file.fileName);
    if (success) {
      notification("Deleted DWC file", NotificationType.Success);
    }
  };

  const handleCreate = async () => {
    try {
      setIsCreating(true);

      const { success } = await axCreateDwc();

      if (success) {
        notification("Created DWC file", NotificationType.Success);
      }
    } catch (e) {
      console.error(e);
      notification("Failed to create DWC file", NotificationType.Error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleOnSort = (e) => {
    const v = e?.target?.value;

    if (v.length > 0 && v !== "All") {
      addFilter("deleted", v.toString());
    } else {
      resetFilter();
    }
  };

  return (
    <Box mb={4} className="container fadeInUp" pt={6}>
      <HStack mb={3}>
        <BoxHeading fontSize="2xl">📦 {t("admin:gbif.heading")}</BoxHeading>

        <Spacer />

        <NativeSelect.Root width="200px">
          <NativeSelect.Field onChange={handleOnSort}>
            <option value="">{t("admin:gbif.sort.All")}</option>
            <option value="false">{t("admin:gbif.sort.Active")}</option>
            <option value="true">{t("admin:gbif.sort.Deleted")}</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </HStack>

      <Separator />
      <Box p={3}>
        {/* Header */}
        <HStack justify="space-between" mb={3}>
          <Text fontSize="sm" color="gray.600">
            {t("admin:gbif.last_generated")} <strong>{lastGeneratedOn}</strong>
          </Text>

          <Button
            size="sm"
            colorPalette="green"
            disabled={hasInProgress || isCreating}
            loading={isCreating}
            onClick={handleCreate}
          >
            {t("admin:gbif.generate_new_export")}
          </Button>
        </HStack>

        {/* Table */}
        <Table.Root size="sm" variant="outline" striped>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>{t("admin:gbif.table.columns.file_name")}</Table.ColumnHeader>
              <Table.ColumnHeader>{t("admin:gbif.table.columns.status")}</Table.ColumnHeader>
              <Table.ColumnHeader>{t("admin:gbif.table.columns.created_on")}</Table.ColumnHeader>
              <Table.ColumnHeader>{t("admin:gbif.table.columns.accessed_on")}</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                {t("admin:gbif.table.columns.actions")}
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {files.map((file) => (
              <Table.Row key={file.id}>
                <Table.Cell>{file.fileName}</Table.Cell>
                <Table.Cell>
                  <Badge
                    colorScheme={
                      file.status === "READY"
                        ? "green"
                        : file.status === "IN_PROGRESS"
                        ? "orange"
                        : "red"
                    }
                  >
                    {file.status}
                  </Badge>
                </Table.Cell>

                <Table.Cell>
                  {file.createdDate ? formatTimeStampFromUTC(file.createdDate) : "--"}
                </Table.Cell>
                <Table.Cell>{file.date ? formatTimeStampFromUTC(file.date) : "--"}</Table.Cell>

                <Table.Cell>
                  <HStack justify="center" gap={2}>
                    <IconButton
                      size="xs"
                      colorScheme="blue"
                      aria-label="Download file"
                      disabled={file.isDeleted === true}
                      onClick={() => window.open(`${filePath}${file.fileName}`, "_blank")}
                      colorPalette="blue"
                    >
                      <LuDownload />
                    </IconButton>

                    <IconButton
                      size="xs"
                      colorScheme="red"
                      aria-label="Delete file"
                      disabled={file.isDeleted === true}
                      onClick={() => handleDelete(file)}
                      colorPalette="red"
                    >
                      <LuTrash2 />
                    </IconButton>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {/* Pagination */}
        <Stack mt={4} align="center">
          <Pagination.Root
            count={DwcLogData?.n || 0}
            pageSize={pageSize}
            page={currentPage}
            onPageChange={(e) => handlePageChange(e.page)}
          >
            <ButtonGroup variant="ghost" size="sm">
              <Pagination.PrevTrigger asChild>
                <IconButton aria-label="Previous page">
                  <LuChevronLeft />
                </IconButton>
              </Pagination.PrevTrigger>

              <Pagination.Items
                render={(pageItem) => (
                  <IconButton
                    key={pageItem.value}
                    variant={{ base: "ghost", _selected: "outline" }}
                  >
                    {pageItem.value}
                  </IconButton>
                )}
              />

              <Pagination.NextTrigger asChild>
                <IconButton aria-label="Next page">
                  <LuChevronRight />
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>
        </Stack>
      </Box>
    </Box>
  );
}
