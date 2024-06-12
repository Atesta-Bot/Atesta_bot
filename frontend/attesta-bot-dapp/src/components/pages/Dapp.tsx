import {
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
  Heading,
  Button,
  Text,
  Box,
} from "@chakra-ui/react";
import "@fontsource/inconsolata";
import "@fontsource/iceland";
import logo from "../../assets/logos/Logo 1 Blue Attesta Bot.svg";
import { useEffect, useState } from "react";
import AttestationTicket from "../organisms/Attestation-Ticket";

// import { useEAS } from "../../hooks/useEAS";

function DappPage() {
  // const { schemaRegistry, eas, currentAddress } = useEAS();

  const [attestations, setAttestations] = useState([]);

  //Fetch all Attestations by schemaId Using graphql Query
  useEffect(() => {
    const getAttestations = async () => {
      const response = await fetch("https://sepolia.easscan.org/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: `
          query Attestation {
            attestations(
              orderBy: {time: desc},
             where: {schemaId:{equals: "0x9c3afcf92221b9a0f05fc97ad0a36db27c332596bd7ddc5832975c03a98ae28f"}}
            
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
        }),
      });

      if (response.ok) {
        const { data } = await response.json();

        setAttestations(data.attestations);
      } else {
        console.error(`Error: ${response.status}`);
      }
    };

    getAttestations();
  }, []);

  console.log("attestations", attestations);
  return (
    <Flex width="100%" flexDir="row" bgColor="#EAEAEA">
      {/* Side Menu */}
      <Tabs w="100%" h="auto" orientation="vertical">
        <TabList
          bgColor="white"
          style={{
            fontFamily: "Inconsolata",
          }}
          w="22rem"
        >
          <Flex
            flexDir="column"
            style={{ padding: "1rem", justifyContent: "center" }}
            justifyItems="center"
          >
            <Image alignSelf="center" boxSize="4rem" src={logo} alt="Logo" />
            <p
              style={{
                color: "#45A5FF",
                fontFamily: "Iceland",
                fontSize: "36px",
                fontWeight: "400",
                textAlign: "center",
              }}
            >
              Attesta Bot
            </p>
          </Flex>

          <Tab _selected={{ color: "#45A5FF", bgColor: "white" }}>
            Pending Tickets
          </Tab>
          <Tab _selected={{ color: "#45A5FF", bgColor: "white" }}>
            Whitelist
          </Tab>
          <Tab _selected={{ color: "#45A5FF", bgColor: "white" }}>History</Tab>
        </TabList>
        {/* Pages */}
        <TabPanels w="100%" h="auto">
          <TabPanel width="100%">
            <Flex flexDir="column" w="100%">
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

                <Button color="white" variant={"outline"} ml="8rem">
                  Connect Wallet
                </Button>
              </Flex>
              {/* Mapping of Attestations */}
              {attestations.map((attestation) => {
                const decodedData = JSON.parse(attestation.decodedDataJson);
                const amount = decodedData[3].value.value;
                const attester = decodedData[5].value.value;
                const attesterSlice = "..." + attester.slice(-4);
                const description = decodedData[2].value.value;
                const organization = decodedData[0].value.value;
                const timeCreated = attestation.timeCreated;
                const date = new Date(timeCreated * 1000); // JavaScript uses milliseconds, so multiply by 1000
                const humanReadableDate = date.toLocaleString(); // Converts to a string like "12/19/2021, 7:35:22 PM"
                const imageLink = decodedData[4].value.value;
                console.log("decodedData", decodedData);
                const uid = "..." + attestation.id.slice(-4);
                return (
                  <AttestationTicket
                    key={attestation.id}
                    uid={uid}
                    from={attesterSlice}
                    amount={amount}
                    description={description}
                    organization={organization}
                    date={humanReadableDate}
                    imageLink={imageLink}
                  />
                );
              })}
            </Flex>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default DappPage;
