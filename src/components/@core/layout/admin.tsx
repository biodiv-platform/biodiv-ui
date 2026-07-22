import { Box } from "@chakra-ui/react";

export default function AdminLayout({ children }) {
  return (
    <Box as="main" minH="100vh" bg="gray.50">
      {children}
    </Box>
  );
}
