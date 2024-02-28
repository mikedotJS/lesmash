import {
  AspectRatio,
  Box,
  HStack,
  Image,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiMapPin, FiClock, FiUser } from "react-icons/fi";
import dayjs from "dayjs";
import { Tournament } from "./types";

interface Props {
  tournament: Tournament;
}

export const TournamentCard: React.FC<Props> = ({ tournament }) => {
  return (
    <Stack
      spacing={{ base: "3", md: "5" }}
      borderRadius="lg"
      shadow="md"
      borderWidth="1px"
      overflow="hidden"
      cursor="pointer"
      _hover={{
        transform: "scale(1.01)",
        shadow: "lg",
        transition: "0.2s ease-in-out",
      }}
    >
      <Box position="relative">
        <AspectRatio ratio={16 / 9}>
          <Image
            src={tournament.images[0]?.url ?? "https://via.placeholder.com/200"}
            alt={tournament.name}
            draggable="false"
            fallback={<Skeleton />}
          />
        </AspectRatio>
      </Box>
      <Stack p={4}>
        <Stack spacing="2">
          <HStack spacing="1">
            <FiMapPin />
            <Text
              fontSize="sm"
              color={useColorModeValue("gray.600", "gray.300")}
            >
              {tournament.venueName}
            </Text>
          </HStack>
          <HStack spacing="1">
            <FiClock />
            <Text
              fontSize="sm"
              color={useColorModeValue("gray.600", "gray.300")}
            >
              {dayjs(tournament.startAt * 1000).format("DD/MM")} -{" "}
              {dayjs(tournament.endAt * 1000).format("DD/MM, YYYY")}
            </Text>
          </HStack>
          <HStack spacing="1">
            <FiUser />
            <Text
              fontSize="sm"
              color={useColorModeValue("gray.600", "gray.300")}
            >
              {tournament.numAttendees}
            </Text>
          </HStack>
          <Text fontWeight="medium">{tournament.name}</Text>
        </Stack>
      </Stack>
    </Stack>
  );
};
