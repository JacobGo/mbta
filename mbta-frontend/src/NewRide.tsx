import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import * as React from "react";

export const NewRide: React.FC<{
  refreshData: () => Promise<void>;
}> = ({ refreshData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [number, setNumber] = React.useState("");
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isLoading, setLoading] = React.useState(false);

  const [info, setInfo] = React.useState<any | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/private/car/${number}`, {
        method: "POST",
        credentials: "include"
      });
      const data = await response.json();
      setInfo(data.series);
      await refreshData();
    } catch (e) {
      setError("Train car number not found.");
      setTimeout(() => {
        setError(undefined);
      }, 2000);
    }
    setLoading(false);
  };
  return (
    <>
      <Button onClick={onOpen} width={{ base: "100%", sm: "auto" }} size="lg">
        Take a Ride
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>

          <ModalCloseButton />
          <ModalBody p={5}>
            {error && (
              <Alert status="error">
                <AlertIcon />
                Error: {error}
              </Alert>
            )}

            {info ? (
              <>
                <Heading textAlign="center" size="md">
                  Series {info.series_start} - {info.series_end}
                </Heading>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Tbody>
                      <Tr>
                        <Td>Manufacturer</Td>
                        <Td>{info.manufacturer}</Td>
                      </Tr>
                      <Tr>
                        <Td>Electrical</Td>
                        <Td>{info.electrical}</Td>
                      </Tr>
                      <Tr>
                        <Td>Year Built</Td>
                        <Td>{info.year_built}</Td>
                      </Tr>
                      <Tr>
                        <Td>Year Rebuilt</Td>
                        <Td>{info.year_rebuilt || "N/A"}</Td>
                      </Tr>
                      <Tr>
                        <Td>Material</Td>
                        <Td>{info.material}</Td>
                      </Tr>
                      <Tr>
                        <Td>Seats</Td>
                        <Td>{info.seats}</Td>
                      </Tr>
                      <Tr>
                        <Td>Width</Td>
                        <Td>{info.width}"</Td>
                      </Tr>
                      <Tr>
                        <Td>Length</Td>
                        <Td>{info.length}"</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel htmlFor="number">Train Number</FormLabel>
                    <Input
                      id="number"
                      placeholder="01523"
                      type="number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                    />
                  </FormControl>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    type="submit"
                    isLoading={isLoading}
                  >
                    Submit
                  </Button>
                </VStack>
              </form>
            )}
          </ModalBody>

          <ModalFooter>
            {info && (
              <Button
                onClick={() => {
                  onClose();
                  setInfo(undefined);
                }}
              >
                Proceed
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
