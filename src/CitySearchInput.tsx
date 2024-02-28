import React, { useState, useEffect, MutableRefObject, LegacyRef } from "react";
import {
  Input,
  Box,
  List,
  ListItem,
  ListIcon,
  useOutsideClick,
} from "@chakra-ui/react";
import { MdLocationCity } from "react-icons/md";
import mapboxSdk from "@mapbox/mapbox-sdk/services/geocoding";

const mapboxToken =
  "pk.eyJ1IjoibWljaGFlbHJvbWFpbiIsImEiOiJjbHQ1dmJqaDgwNXk3MmtvMTY5dThtMnp1In0.MjOkwSAn5i9APRmPfYcTKQ"; // Replace with your Mapbox access token
const geocodingClient = mapboxSdk({ accessToken: mapboxToken });

interface CitySearchInputProps {
  onSelect: (place: {
    name: string;
    id: string;
    latitude: number;
    longitude: number;
  }) => void;
}

export const CitySearchInput: React.FC<CitySearchInputProps> = ({
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    { name: string; id: string; latitude: number; longitude: number }[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = React.useRef<HTMLElement>();

  useOutsideClick({
    ref: ref as MutableRefObject<HTMLElement>,
    handler: () => setIsOpen(false),
  });

  useEffect(() => {
    if (searchQuery.length > 2) {
      geocodingClient
        .forwardGeocode({
          query: searchQuery,
          types: ["place"],
          limit: 5,
        })
        .send()
        .then((response) => {
          const matches = response.body.features.map((feature) => {
            console.log("🚀 ~ matches ~ feature:", feature);

            return {
              id: feature.id,
              name: feature.place_name,
              latitude: feature.geometry.coordinates[0],
              longitude: feature.geometry.coordinates[1],
            };
          });
          setSuggestions(matches);
          setIsOpen(true);
        });
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [searchQuery]);
  return (
    <Box ref={ref as LegacyRef<HTMLDivElement> | undefined} position="relative">
      <Input
        placeholder="Search for a city..."
        borderColor="gray.800"
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchQuery(e.target.value)
        }
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && suggestions.length > 0 && (
        <List
          bg="bg.surface"
          shadow="md"
          position="absolute"
          width="full"
          zIndex="dropdown"
          borderRadius="lg"
          overflow="hidden"
          mt="0.5"
        >
          {suggestions.map((suggestion) => (
            <ListItem
              key={suggestion.id}
              cursor="pointer"
              _hover={{ bg: "gray.700" }}
              onClick={() => {
                onSelect(suggestion);
                setSearchQuery(suggestion.name);
                setIsOpen(false);
              }}
              p="2"
            >
              <ListIcon as={MdLocationCity} />
              {suggestion.name}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};
