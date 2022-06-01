import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Input,
  Button,
  FormControl,
  Alert,
  AlertIcon
} from "@chakra-ui/react";

export const Login: React.FC<{
  refreshData: () => Promise<void>;
}> = ({ refreshData }) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [error, setError] = React.useState<string | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    setError(undefined);
    fetch("/login", {
      body: formData,
      method: "POST",
      credentials: "include"
    }).then((response) => {
      if (response.ok) {
        refreshData();
      } else {
        setError("Invalid username or password.");
      }
    });
  };
  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <VStack spacing={3}>
          {error && (
            <Alert status="error" fontSize={"sm"}>
              <AlertIcon />
              Error: {error}
            </Alert>
          )}

          <FormControl>
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <Input
              placeholder="Password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button type="submit">Login</Button>
        </VStack>
      </form>
    </Box>
  );
};
