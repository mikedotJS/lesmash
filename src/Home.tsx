import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Container,
  Flex,
  HStack,
  Heading,
  IconButton,
  Image,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { useQuery } from "urql";
import logo from "./assets/logo.png";
import { TournamentCard } from "./TournamentCard";
import { Tournament } from "./types";
import { CountryFilterPopover, DateRangeFilterPopover } from "./Filter";
import { useEffect, useState } from "react";
import { Pagination } from "./Pagination";
import dayjs from "dayjs";
import { CitySearchInput } from "./CitySearchInput";
import { FaLinkedin, FaGithub } from "react-icons/fa";

interface TournamentsQueryResponse {
  tournaments: {
    nodes: Tournament[];
  };
}

const TOURNAMENTS_QUERY = `
query TournamentsByVideogame($countryCode: String, $perPage: Int!, $videogameId: ID!, $page: Int!, $afterDate: Timestamp, $beforeDate: Timestamp, $location: TournamentLocationFilter, $featured: Boolean!) {
    tournaments(query: {
      perPage: $perPage
      page: $page
      filter: {
        upcoming: true
        countryCode: $countryCode
        videogameIds: [
          $videogameId
        ]
        afterDate: $afterDate
        beforeDate: $beforeDate
        location: $location
        isFeatured: $featured
      }
    }) {
      nodes {
        id
        name
        numAttendees
        slug
        images {
            id
            url
        }
        startAt
        endAt
        url
        venueName
        venueAddress
      }
    }
  }
`;

export const Home = () => {
  const [countryCode, setCountryCode] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [dateRange, setDateRange] = useState<{
    startDate: number;
    endDate: number;
  }>({
    startDate: dayjs().startOf("month").unix(), // Example start date in milliseconds
    endDate: dayjs().endOf("month").unix(), // Example end date in milliseconds
  });
  const [place, setPlace] = useState<{
    name: string;
    id: string;
    latitude: number;
    longitude: number;
  }>();

  const [featured, setFeatured] = useState<boolean>(false);

  const handleToggleFeatured = () => {
    setFeatured(!featured);
  };

  const [result] = useQuery<TournamentsQueryResponse>({
    query: TOURNAMENTS_QUERY,
    variables: {
      perPage: 6,
      videogameId: 1386,
      page,
      countryCode,
      afterDate: dateRange.startDate,
      beforeDate: dateRange.endDate,
      featured,
      ...(place?.latitude &&
        place?.longitude && {
          location: {
            distanceFrom: `${place?.longitude},${place?.latitude}`,
            distance: "50mi",
          },
        }),
    },
  });

  const { data, fetching, error } = result;

  useEffect(() => {
    if (place) {
      setCountryCode("");
    }
  }, [place, setCountryCode]);

  useEffect(() => {
    if (countryCode) {
      setPlace(undefined);
    }
  }, [countryCode, setPlace]);

  if (error) return <p>Oh no... {error.message}</p>;

  const upcomingTournaments = data?.tournaments.nodes.sort(
    (a, b) => b.numAttendees - a.numAttendees
  );

  return (
    <Box
      as="section"
      minH="md"
      display="flex"
      flexDirection="column"
      flex="1"
      height="100vh"
    >
      <Box borderBottomWidth="1px" bg="bg.surface">
        <Container py="4">
          <HStack justify="center">
            <HStack>
              <Image src={logo} w="50px" h="auto" />
              <Text
                fontSize="xx-large"
                style={{ fontFamily: "'Misery Gymnast', sans-serif" }}
              >
                Le Smash
              </Text>
            </HStack>
          </HStack>
        </Container>
      </Box>
      <Container flex="1" display="flex" flexDirection="column">
        <Box
          as="section"
          pt={{ base: "4", md: "8" }}
          pb={{ base: "6", md: "12" }}
        >
          <Stack spacing="1">
            <Heading size={{ base: "xs", md: "sm" }} fontWeight="medium">
              Tournaments
            </Heading>
            <Text color="fg.muted">
              A comprehensive list of upcoming tournaments
            </Text>
          </Stack>
        </Box>
        <Flex
          justify="space-between"
          align="center"
          display={{ base: "none", md: "flex" }}
          py="4"
          borderWidth="1px"
          borderRadius="lg"
          px="4"
          mb="4"
          shadow="md"
        >
          <HStack spacing="6">
            <Text
              color={mode("gray.600", "gray.400")}
              fontWeight="medium"
              fontSize="sm"
            >
              Filter by
            </Text>
            <SimpleGrid display="inline-grid" spacing="4" columns={4}>
              <CountryFilterPopover
                onSubmit={setCountryCode}
                value={countryCode}
              />
              <DateRangeFilterPopover
                onSubmit={setDateRange}
                value={dateRange}
              />
              <Button
                variant={featured ? "solid" : "ghost"}
                onClick={() => handleToggleFeatured()}
              >
                Featured
              </Button>
            </SimpleGrid>
          </HStack>

          <HStack flexShrink={0}>
            <CitySearchInput onSelect={(place) => setPlace(place)} />
          </HStack>
        </Flex>
        {fetching ? (
          <Center flex="1">
            <Spinner size="xl" />
          </Center>
        ) : (
          <>
            <SimpleGrid
              columns={{ sm: 2, md: 3, lg: 3 }}
              spacing="4"
              rowGap="8"
            >
              {upcomingTournaments?.map((tournament) => {
                return (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                );
              })}
            </SimpleGrid>
          </>
        )}
        <Box mt="auto">
          <Pagination
            currentPage={page}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </Box>
      </Container>
      <Container as="footer" role="contentinfo" py={{ base: "12", md: "16" }}>
        <Stack spacing={{ base: "4", md: "5" }}>
          <Stack justify="space-between" direction="row" align="center">
            <HStack>
              <Image src={logo} w="35px" h="auto" />
              <Text
                fontSize="x-large"
                style={{ fontFamily: "'Misery Gymnast', sans-serif" }}
              >
                Le Smash
              </Text>
            </HStack>
            <ButtonGroup variant="tertiary">
              <IconButton
                as="a"
                href="https://www.linkedin.com/in/michael-romain/"
                aria-label="LinkedIn"
                icon={<FaLinkedin />}
              />
              <IconButton
                as="a"
                href="https://github.com/WeirdScience-dev"
                aria-label="GitHub"
                icon={<FaGithub />}
              />
            </ButtonGroup>
          </Stack>
          <Text fontSize="sm" color="fg.subtle">
            &copy; {new Date().getFullYear()} Weird Science. All rights
            reserved.
          </Text>
        </Stack>
      </Container>
    </Box>
  );
};
