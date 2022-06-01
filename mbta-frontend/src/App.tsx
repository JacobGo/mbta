import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  Code,
  Grid,
  theme,
  Heading,
  Divider,
  HStack,
  Spinner,
  Spacer,
  Button,
  Center
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Signup } from "./Signup";
import { Login } from "./Login";
import { Ride } from "./Ride";

export const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [username, setUsername] = React.useState<string | undefined>(undefined);
  const [rides, setRides] = React.useState<any[]>([]);

  const refreshData = async () => {
    try {
      const response = await fetch("/private/me", { credentials: "include" });
      const data = await response.json();
      setUsername(data.user.username);
      setRides(data.rides);
    } catch (e) {}
    setIsLoading(false);
  };
  React.useEffect(() => {
    refreshData();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Box
        textAlign="center"
        fontSize="xl"
        h="calc(100vh - env(safe-area-inset-bottom))"
      >
        <HStack>
          <Heading p={4}>MBTA Ride Tracker</Heading>
          <Spacer />
          {username && (
            <Button
              onClick={() => {
                fetch("/logout", { credentials: "include" });
                setUsername(undefined);
                setRides([]);
              }}
            >
              Logout
            </Button>
          )}

          <ColorModeSwitcher />
        </HStack>
        <Grid p={3}>
          {username ? (
            <Ride username={username} rides={rides} refreshData={refreshData} />
          ) : (
            <VStack spacing={8}>
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  <Login refreshData={refreshData} />
                  <Signup refreshData={refreshData} />
                </>
              )}
            </VStack>
          )}
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
