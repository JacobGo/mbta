import {
  Box,
  Heading,
  HStack,
  Input,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack
} from "@chakra-ui/react";

import { formatRelative } from "date-fns";
import { NewRide } from "./NewRide";

export const Ride: React.FC<{
  username: string;
  rides: any[];
  refreshData: () => Promise<void>;
}> = ({ username, rides, refreshData }) => {
  const getLastRide = (): string => {
    if (rides.length === 0) {
      return "No rides yet";
    }
    const lastRide = rides[rides.length - 1];
    return formatRelative(new Date(lastRide.created_at), new Date());
  };
  return (
    <Box>
      <Heading size="md">
        Welcome back, <Text as="u">{username}</Text>
        <VStack p={8} spacing={2}>
          <Stat>
            <StatLabel>Rides</StatLabel>
            <StatNumber>{rides.length}</StatNumber>
            <StatHelpText fontSize="sm">Latest: {getLastRide()}</StatHelpText>
          </Stat>

          <NewRide refreshData={refreshData} />
        </VStack>
      </Heading>
    </Box>
  );
};
