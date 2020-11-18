import { Box, Heading, IconButton, useDisclosure } from "@chakra-ui/react";
import HTMLContainer from "@components/@core/html-container";
import useGlobalState from "@hooks/use-global-state";
import EditIcon from "@icons/edit";
import { Role } from "@interfaces/custom";
import { hasAccess } from "@utils/auth";
import { getInjectableHTML } from "@utils/text";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

const FieldEditor = dynamic(() => import("../editor"), { ssr: false });

interface IFieldsProps {
  childs: any[];
  size?;
  ml?;
}

export default function LandscapeFields({ childs = [], size = "lg", ml = 0 }: IFieldsProps) {
  const { isLoggedIn } = useGlobalState();
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setCanEdit(hasAccess([Role.Admin]));
    }
  }, [isLoggedIn]);

  return (
    <div>
      {childs.map((child) => {
        const { isOpen, onClose, onToggle } = useDisclosure();
        const [content, setContent] = useState(child.content);

        useEffect(() => {
          setContent(child.content);
        }, [child]);

        return (
          <>
            <Box pb={6} ml={ml} hidden={!content && !canEdit && ml}>
              <Heading mb={3} size={size}>
                {child.header}
                {canEdit && (
                  <IconButton
                    variant="link"
                    colorScheme="blue"
                    aria-label={`Edit ${child.header}`}
                    icon={<EditIcon />}
                    onClick={onToggle}
                  />
                )}
              </Heading>
              {isOpen ? (
                <FieldEditor
                  id={child.pageFieldId}
                  onChange={setContent}
                  onClose={onClose}
                  initialContent={content}
                />
              ) : (
                content && (
                  <HTMLContainer
                    className="article"
                    dangerouslySetInnerHTML={{
                      __html: getInjectableHTML(content)
                    }}
                  />
                )
              )}
            </Box>
            {child.childs.length > 0 && <LandscapeFields childs={child.childs} size="md" ml={4} />}
          </>
        );
      })}
    </div>
  );
}
