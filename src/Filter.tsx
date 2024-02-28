import { HStack, Popover, SimpleGrid, Text } from "@chakra-ui/react";
import { CountryPicker } from "./CountryPicker";
import { FilterPopoverButton, FilterPopoverContent } from "./FilterPopover";
import { useFilterState } from "./useFilterState";
import { Box, Button } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

interface CountryFilterPopoverProps {
  onSubmit: Dispatch<SetStateAction<string>>;
  value: string;
}

export const CountryFilterPopover = ({
  onSubmit,
  value,
}: CountryFilterPopoverProps) => {
  const state = useFilterState({
    defaultValue: value,
    onSubmit,
  });

  return (
    <Popover placement="bottom-start">
      <FilterPopoverButton label="Country" />
      <FilterPopoverContent
        isCancelDisabled={!state.canCancel}
        onClickApply={state.onSubmit}
        onClickCancel={state.onReset}
      >
        <CountryPicker
          hideLabel
          value={state.value}
          onChange={state.onChange}
        />
      </FilterPopoverContent>
    </Popover>
  );
};

interface DateRangeFilterPopoverProps {
  onSubmit: Dispatch<SetStateAction<{ startDate: number; endDate: number }>>;
  value: { startDate: number; endDate: number };
}

export const DateRangeFilterPopover = ({
  onSubmit,
  value,
}: DateRangeFilterPopoverProps) => {
  const state = useFilterState({
    defaultValue: value,
    onSubmit,
  });

  return (
    <Popover placement="bottom-start">
      <FilterPopoverButton label="Date Range" />
      <FilterPopoverContent
        isCancelDisabled={!state.canCancel}
        onClickApply={state.onSubmit}
        onClickCancel={state.onReset}
      >
        {state.value && state.onChange && (
          <DateRangePicker value={state.value} onChange={state.onChange} />
        )}
      </FilterPopoverContent>
    </Popover>
  );
};

interface DateRangePickerProps {
  value: { startDate: number; endDate: number };
  onChange: (value: { startDate: number; endDate: number }) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
}) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(
    value.startDate ? dayjs(value.startDate) : null
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(
    value.endDate ? dayjs(value.endDate) : null
  );

  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));

  useEffect(() => {
    if (startDate && endDate)
      onChange({ startDate: startDate.unix(), endDate: endDate.unix() });
  }, [endDate, onChange, startDate]);

  const handleDateSelection = (date: Dayjs) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate && date.isAfter(startDate)) {
      setEndDate(date);
    } else {
      setStartDate(date);
      setEndDate(null);
    }
  };

  const renderDays = () => {
    const days = [];
    const startDay = dayjs(currentMonth).startOf("month").startOf("week");
    const endDay = dayjs(currentMonth).endOf("month").endOf("week");
    let day = startDay;

    while (day.isSameOrBefore(endDay, "day")) {
      days.push({ day: day.toString() });
      day = day.add(1, "day");
    }

    return days.map((_day) => {
      const __day = dayjs(_day.day);

      return (
        <Button
          border="1px"
          borderColor="bg.surface"
          key={__day.toString()}
          onClick={() => handleDateSelection(__day)}
          colorScheme={
            __day.isSame(startDate, "day") || __day.isSame(endDate, "day")
              ? "teal"
              : ""
          }
          color={
            __day.isSame(startDate, "day") || __day.isSame(endDate, "day")
              ? "black"
              : ""
          }
          isDisabled={
            __day.isBefore(dayjs(currentMonth).startOf("month")) ||
            __day.isAfter(dayjs(currentMonth).endOf("month"))
          }
        >
          {__day.date()}
        </Button>
      );
    });
  };

  return (
    <Box>
      <HStack justifyContent="space-between" mb={4}>
        <Button
          size="xs"
          onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
          variant="ghost"
        >
          <FiArrowLeft />
        </Button>
        <Text>{currentMonth.format("MMMM YYYY")}</Text>
        <Button
          size="xs"
          onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
          variant="ghost"
        >
          <FiArrowRight />
        </Button>
      </HStack>
      <SimpleGrid columns={7} spacing={2}>
        {renderDays()}
      </SimpleGrid>
    </Box>
  );
};
