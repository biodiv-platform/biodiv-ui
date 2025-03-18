import { Button, Collapse, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import Loading from "@components/pages/common/loading";
import useGlobalState from "@hooks/use-global-state";
import MenuIcon from "@icons/menu";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React, { Suspense } from "react";

import { PagesList } from "./pages-list";
import usePages from "./use-pages-sidebar";

const ReOrderPagesModal = dynamic(() => import("../reorder-pages-modal"), { ssr: false });

export default function PagesSidebar() {
  const { canEdit } = usePages();
  const { pages } = useGlobalState();
  const { t } = useTranslation();

  const isDesktop = useBreakpointValue({ base: false, md: true });
  const { isOpen, onToggle } = useDisclosure();

  return pages.length ? (
    <div>
      {!isDesktop && (
        <Button colorPalette="blue" w="full" mb={4} onClick={onToggle} leftIcon={<MenuIcon />}>
          {t("page:sidebar.toggle")}
        </Button>
      )}
      <Collapse in={isDesktop || isOpen} unmountOnExit={true}>
        {canEdit && (
          <Suspense fallback={<Loading />}>
            <ReOrderPagesModal />
          </Suspense>
        )}
        <PagesList items={pages} isParent={true} />
      </Collapse>
    </div>
  ) : null;
}
