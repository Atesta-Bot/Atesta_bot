import { Button, Link, VStack, Flex } from "@chakra-ui/react";

function DappPage() {
  return (
    <Flex width="100%" flexDir="row" bgColor="#EAEAEA">
      <VStack as="nav" spacing={4} align="start" p={5} bg="white">
        <Link to="/">
          <Button variant="ghost">Logo</Button>
        </Link>
        <Link to="/pending-tickets">
          <Button variant="ghost">Pending Tickets</Button>
        </Link>
        <Link to="/whitelist">
          <Button variant="ghost">Whitelist</Button>
        </Link>
        <Link to="/history">
          <Button variant="ghost">History</Button>
        </Link>
      </VStack>
    </Flex>
  );
}

export default DappPage;
