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
  AlertIcon,
  useDisclosure,
  Collapse
} from "@chakra-ui/react";

export const Signup: React.FC<{
  refreshData: () => Promise<void>;
}> = ({ refreshData }) => {
  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [error, setError] = React.useState<string | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    setError(undefined);
    fetch("/register", {
      body: formData,
      method: "POST",
      credentials: "include"
    }).then((response) => {
      if (response.ok) {
        refreshData();
      } else {
        response.json().then((data) => {
          setError(data.error || "Unknown error.");
        });
      }
    });
  };
  return (
    <VStack spacing={3}>
      <Button onClick={handleToggle}>Make an Account</Button>
      <Collapse in={show}>
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
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <Button type="submit">Register</Button>
          </VStack>
        </form>
      </Collapse>
    </VStack>
  );
};
