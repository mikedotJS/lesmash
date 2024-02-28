import { Box, Button, HStack, Tag } from "@chakra-ui/react";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, onPageChange }: PaginationProps) => {
  return (
    <HStack spacing="2" py="4" justifyContent="space-between">
      <Button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        variant="ghost"
      >
        Previous
      </Button>
      <Box
        cursor="pointer"
        padding="2"
        borderRadius="md"
        color="white"
        onClick={() => onPageChange(currentPage)}
      >
        <Tag>{currentPage}</Tag>
      </Box>
      <Button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage + 1)}
        variant="ghost"
      >
        Next
      </Button>
    </HStack>
  );
};
