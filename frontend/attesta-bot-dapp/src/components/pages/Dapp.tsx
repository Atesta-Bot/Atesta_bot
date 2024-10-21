import {
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Box,
  Center,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AttestationTicket from "../organisms/Attestation-Ticket";
import { useAccount } from 'wagmi';
import logo from "../../assets/logos/Vector Attesta Bot Logo.png";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Attestation } from "../../lib/types";

function DappPage() {
  const { address, isConnected } = useAccount();
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clear attestations when the wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setAttestations([]);
      setLoading(false);
    }
  }, [isConnected]);

  useEffect(() => {
    const getAttestations = async () => {
      if (!address || !isConnected) return;  // Ensure user is connected and address is available

      setLoading(true);
      try {
        const response = await fetch("https://base-sepolia.easscan.org/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: `
              query Attestation($signerAddress: String!) {
                attestations(
                  orderBy: { time: desc },
                  where: {
                    schemaId: { equals: "0xdb1b4ddf7e76efab3770ddc544f1edf3443b01251747aa8f008137f4bb1d12c4" },
                    attester: { equals: $signerAddress }
                  }
                ) {
                  id
                  attester
                  recipient
                  refUID
                  revocable
                  revocationTime
                  expirationTime
                  decodedDataJson
                  timeCreated
                }
              }
            `,
            variables: {
              signerAddress: address,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const { data } = await response.json();
        setAttestations(data.attestations);
      } catch (error) {
        setError((error as Error).message || String(error));
      } finally {
        setLoading(false);
      }
    };

    if (isConnected) {
      getAttestations();
    }
  }, [address, isConnected]);

  return (
    <Flex width="100%" height="100vh" flexDir="column" bgColor="#EAEAEA">
      <Tabs w="100%" h="100%" orientation="vertical" flex="1">
        <TabList
          bgColor="white"
          style={{ fontFamily: "Inconsolata" }}
          w="22rem"
        >
          <Flex flexDir="column" style={{ padding: "1rem", justifyContent: "center" }}>
            <Image alignSelf="center" w="4rem" src={logo} alt="Logo" />
            <Text
              style={{
                color: "#45A5FF",
                fontFamily: "Iceland",
                fontSize: "36px",
                fontWeight: "400",
                textAlign: "center",
              }}
            >
              Attesta Bot
            </Text>
          </Flex>

          <Tab _selected={{ color: "#45A5FF", bgColor: "white" }}>Pending Tickets</Tab>
          <Tab _selected={{ color: "#45A5FF", bgColor: "white" }}>Whitelist</Tab>
          <Tab _selected={{ color: "#45A5FF", bgColor: "white" }}>History</Tab>
          <Tab _selected={{ color: "#45A5FF", bgColor: "white" }}>Register your DAO</Tab>
        </TabList>

        <TabPanels w="100%" h="100%">
          <TabPanel width="100%" h="100%">
            <Flex flexDir="column" w="100%" h="100%" justifyContent="flex-start" overflowY="auto">
              <Flex
                borderRadius="8px"
                padding="2rem"
                justify="space-between"
                bgColor="#45A5FF"
              >
                <Box>
                  <Heading color="white" fontSize="4rem" fontFamily="Iceland">
                    Welcome to Attesta Bot
                  </Heading>
                  <Text fontSize="1.5rem" color="white">
                    Review and pay your pending tickets{" "}
                  </Text>
                </Box>
                <DynamicWidget />
              </Flex>

              {!isConnected && (
                <Center flex="1">
                  <Alert status="warning" mt="2rem" w="50%">
                    <AlertIcon />
                    Please connect your wallet to view your tickets.
                  </Alert>
                </Center>
              )}

              {loading && isConnected && (
                <Flex justifyContent="center" alignItems="center" flex="1">
                  <Spinner size="xl" />
                </Flex>
              )}

              {error && (
                <Alert status="error" mt="2rem" w="50%" mx="auto">
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              {!loading && !error && isConnected && attestations.length === 0 && (
                <Center flex="1">
                  <Text fontSize="2xl" color="#1E1E1E">
                    No attestations found for your account.
                  </Text>
                </Center>
              )}

              {!loading && !error && isConnected && attestations.map((attestation) => {
                const decodedData = JSON.parse(attestation.decodedDataJson);
                const daoName = decodedData[0].value.value;
                const description = decodedData[2].value.value;
                const usdtAmount = decodedData[3].value.value;
                const ticketUrl = decodedData[4].value.value;
                const attester = decodedData[5].value.value;

                const attesterSlice = "..." + attester.slice(-4);
                const timeCreated = attestation.timeCreated;
                const date = new Date(timeCreated * 1000);
                const humanReadableDate = date.toLocaleString();

                const uid = "..." + attestation.id.slice(-4);
                const fullUid = attestation.id;

                return (
                  <AttestationTicket
                    key={attestation.id}
                    uid={uid}
                    from={attesterSlice}
                    amount={usdtAmount}
                    description={description}
                    organization={daoName}
                    date={humanReadableDate}
                    imageLink={ticketUrl}
                    fullUid={fullUid}
                    attester={attester}
                  />
                );
              })}
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default DappPage;
