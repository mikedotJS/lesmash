import {
  FormControl,
  FormControlProps,
  FormLabel,
  HStack,
  useRadioGroup,
  UseRadioGroupProps,
} from "@chakra-ui/react";
import { SizePickerButton } from "./SizePickerButton";

interface CountryOption {
  label: string;
  value: string;
}

const countryOptions: CountryOption[] = [
  { label: "Canada", value: "CA" },
  { label: "France", value: "FR" },
  { label: "Japan", value: "JP" },
  { label: "United Kingdom", value: "UK" },
  { label: "USA", value: "US" },
];

interface CountryPickerProps extends UseRadioGroupProps {
  rootProps?: FormControlProps;
  hideLabel?: boolean;
  label?: string;
}

export const CountryPicker = ({
  rootProps,
  hideLabel,
  label,
  ...rest
}: CountryPickerProps) => {
  const { getRadioProps, getRootProps, value } = useRadioGroup(rest);
  const selectedCountry = countryOptions.find(
    (option) => option.value === value
  );

  return (
    <FormControl {...rootProps}>
      {!hideLabel && (
        <FormLabel fontSize="sm" fontWeight="medium">
          {label ?? `Country: ${selectedCountry?.label}`}
        </FormLabel>
      )}
      <HStack {...getRootProps()}>
        {countryOptions.map((option) => (
          <SizePickerButton
            key={option.value}
            label={option.label}
            {...getRadioProps({ value: option.value })}
          />
        ))}
      </HStack>
    </FormControl>
  );
};
