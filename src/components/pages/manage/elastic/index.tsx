"use client";

import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  HStack,
  IconButton,
  Pagination,
  Separator,
  Stack,
  Table,
  Text
} from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import TagsNextField from "@/components/form/simple-tag-next";
import { axUpdateObservationElastic } from "@/services/observation.service";
import { formatTimeStampFromUTC } from "@/utils/date";
import notification, { NotificationType } from "@/utils/notification";

import UserFilterInput from "./filters/name-of-user";
import useObservationList from "./use-observation-filter";

type FormValues = {
  observationIds: string[];
};

export default function ElasticComponent() {
  const { t } = useTranslation();
  const { observationData, filter, setFilter } = useObservationList();

  const observations = observationData?.l || [];
  const total = observationData?.n || 0;

  const pageSize = 15;
  const currentPage = Math.floor((filter?.offset || 0) / pageSize) + 1;

  const [loading, setLoading] = React.useState(false);

  const hForm = useForm<FormValues>({
    defaultValues: {
      observationIds: []
    }
  });

  const selectedIds = hForm.watch("observationIds") || [];

  const pageIds = observations.map((o) => String(o.id));

  const isAllSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

  const isIndeterminate = pageIds.some((id) => selectedIds.includes(id)) && !isAllSelected;

  const toggleRow = (id: number, checked: boolean) => {
    const current = hForm.getValues("observationIds") || [];

    const updated = checked
      ? [...current, String(id)]
      : current.filter((item) => item !== String(id));

    hForm.setValue("observationIds", updated, {
      shouldDirty: true
    });
  };

  const toggleSelectAll = (checked: boolean) => {
    const current = hForm.getValues("observationIds") || [];

    const updated = checked
      ? Array.from(new Set([...current, ...pageIds]))
      : current.filter((id) => !pageIds.includes(id));

    hForm.setValue("observationIds", updated, {
      shouldDirty: true
    });
  };

  const handlePageChange = (page: number) => {
    setFilter((draft) => {
      draft.offset = (page - 1) * pageSize;
      draft.limit = pageSize;
    });
  };

  const handleSubmitElastic = async (data: FormValues) => {
    if (!data.observationIds.length) return;

    try {
      setLoading(true);

      const ids = data.observationIds.join(",");

      const response = await axUpdateObservationElastic("UPDATE", ids);

      if (response.success) {
        notification("Elastic update triggered successfully", NotificationType.Success);
        hForm.reset({ observationIds: [] });
      } else {
        notification("Failed to trigger Elastic update", NotificationType.Error);
      }
    } catch (error) {
      console.error(error);
      notification("Something went wrong", NotificationType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mb={4} className="container fadeInUp" pt={6}>
      <HStack mb={3}>
        <BoxHeading fontSize="3xl"> {t("Observation list")}</BoxHeading>
        <UserFilterInput filterKey="authorId" />
      </HStack>

      <Separator />

      <Box p={3}>
        <FormProvider {...hForm}>
          <HStack align="flex-end" gap={4} mb={4}>
            <Box flex="1">
              <Text fontSize="sm" color="gray.600" mb={1}>
                {t("Total observations")} <strong>{total}</strong>
              </Text>

              <TagsNextField name="observationIds" placeholder="Add observation ids" numericOnly />
            </Box>

            <Button
              size="sm"
              colorPalette="green"
              onClick={hForm.handleSubmit(handleSubmitElastic)}
              disabled={!selectedIds.length}
              loading={loading}
            >
              {t("Update Elastic index")}
            </Button>
          </HStack>
        </FormProvider>

        <Table.Root size="sm" variant="outline" striped>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader w="6">
                <Checkbox.Root
                  size="sm"
                  mt="0.5"
                  aria-label="Select all rows"
                  checked={isIndeterminate ? "indeterminate" : isAllSelected}
                  onCheckedChange={(changes) => toggleSelectAll(!!changes.checked)}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                </Checkbox.Root>
              </Table.ColumnHeader>

              <Table.ColumnHeader>{t("ObservationId")}</Table.ColumnHeader>
              <Table.ColumnHeader>{t("AuthorId")}</Table.ColumnHeader>
              <Table.ColumnHeader>{t("admin:gbif.table.columns.created_on")}</Table.ColumnHeader>
              <Table.ColumnHeader>{t("GroupId")}</Table.ColumnHeader>
              <Table.ColumnHeader>{t("Deleted")}</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {observations.map((observation) => {
              const isChecked = selectedIds.includes(String(observation.id));

              return (
                <Table.Row key={observation.id} data-selected={isChecked ? "" : undefined}>
                  <Table.Cell>
                    <Checkbox.Root
                      size="sm"
                      mt="0.5"
                      aria-label="Select row"
                      checked={isChecked}
                      onCheckedChange={(changes) => toggleRow(observation.id, !!changes.checked)}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                    </Checkbox.Root>
                  </Table.Cell>

                  <Table.Cell>{observation.id}</Table.Cell>
                  <Table.Cell>{observation.authorId}</Table.Cell>

                  <Table.Cell>
                    {observation.createdOn ? formatTimeStampFromUTC(observation.createdOn) : "--"}
                  </Table.Cell>

                  <Table.Cell>{observation.groupId}</Table.Cell>

                  <Table.Cell>{observation.isDeleted ? "Yes" : "No"}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>

        <Stack mt={4} align="center">
          <Pagination.Root
            count={total}
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
                    variant={{
                      base: "ghost",
                      _selected: "outline"
                    }}
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
