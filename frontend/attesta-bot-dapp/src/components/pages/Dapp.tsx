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
  Select,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import "@fontsource/inconsolata";
import "@fontsource/iceland";
import logo from "../../assets/logos/Logo 1 Blue Attesta Bot.svg";
import React, { useEffect } from "react";
// import { useEAS } from "../../hooks/useEAS";
function DappPage() {
  // const { schemaRegistry, eas, currentAddress } = useEAS();

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
             where: {schemaId:{equals: "0x9c3afcf92221b9a0f05fc97ad0a36db27c332596bd7ddc5832975c03a98ae28f"}}
            
            ) {
              id
              attester
              recipient
              refUID
              revocable
              revocationTime
              expirationTime
              data
            }
          }
          `,
        }),
      });

      if (response.ok) {
        const { data } = await response.json();
        console.log(data.attestations);
      } else {
        console.error(`Error: ${response.status}`);
      }
    };

    getAttestations();
  }, []);
  return (
    <Flex width="100%" flexDir="row" bgColor="#EAEAEA" h="100%">
      <Tabs w="100%" h="100vh" orientation="vertical">
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

        <TabPanels w="100%" h="100%">
          <TabPanel width="100%" h="100%">
            <Flex flexDir="column" w="100%" h="100%">
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
              {/* <Flex
                p="1rem"
                borderRadius="8px"
                mt="2rem"
                h="6rem"
                bgColor="white"
                justify="space-between"
              >
                <Flex flexDir="column" ml="1rem">
                  <Text
                    fontFamily="Inconsolata"
                    color="#1E1E1E"
                    fontSize="12px"
                    fontWeight="light"
                  >
                    UID
                  </Text>
                  <Text
                    fontFamily="Inconsolata"
                    color="#45A6FF"
                    fontSize="18px"
                  >
                    ...h6f5
                  </Text>
                </Flex>
                <Flex flexDir="column" ml="1rem">
                  <Text
                    fontFamily="Inconsolata"
                    color="#1E1E1E"
                    fontSize="12px"
                    fontWeight="light"
                  >
                    From
                  </Text>
                  <Text
                    fontFamily="Inconsolata"
                    color="#45A6FF"
                    fontSize="18px"
                  >
                    0xVat0...h6f5
                  </Text>
                </Flex>
                <Flex flexDir="column" ml="1rem">
                  <Text
                    fontFamily="Inconsolata"
                    color="#1E1E1E"
                    fontSize="12px"
                    fontWeight="light"
                  >
                    Description
                  </Text>
                  <Text
                    fontFamily="Inconsolata"
                    color="#1E1E1E"
                    fontSize="18px"
                  >
                    Some Chicken Wings for the team...
                  </Text>
                </Flex>
                <Flex flexDir="column" ml="1rem">
                  <Text
                    fontFamily="Inconsolata"
                    color="#1E1E1E"
                    fontSize="12px"
                    fontWeight="light"
                  >
                    Amount
                  </Text>
                  <Text
                    fontFamily="Inconsolata"
                    color="#1E1E1E"
                    fontSize="18px"
                    alignSelf="center"
                  >
                    186.25
                  </Text>
                </Flex>
                <Select
                  ml="1rem"
                  alignSelf="center"
                  w="5rem"
                  placeholder="USDT"
                >
                  <option value="ETH">ETH</option>
                  <option value="OPT">OPT</option>
                  <option value="ARB">ARB</option>
                </Select>
                <Button ml="1rem" colorScheme="blue">
                  PAY
                </Button>
              </Flex> */}

              <Accordion
                borderRadius="8px"
                mt="2rem"
                bgColor="white"
                allowToggle
                p="1rem"
              >
                <AccordionItem borderColor="transparent">
                  <Flex w="100%" justify="space-between">
                    <Flex flexDir="column" ml="1rem">
                      <Text
                        fontFamily="Inconsolata"
                        color="#1E1E1E"
                        fontSize="12px"
                        fontWeight="light"
                      >
                        UID
                      </Text>
                      <Text
                        fontFamily="Inconsolata"
                        color="#45A6FF"
                        fontSize="18px"
                      >
                        ...h6f5
                      </Text>
                    </Flex>
                    <Flex flexDir="column" ml="1rem">
                      <Text
                        fontFamily="Inconsolata"
                        color="#1E1E1E"
                        fontSize="12px"
                        fontWeight="light"
                      >
                        From
                      </Text>
                      <Text
                        fontFamily="Inconsolata"
                        color="#45A6FF"
                        fontSize="18px"
                      >
                        0xVat0...h6f5
                      </Text>
                    </Flex>
                    <Flex flexDir="column" ml="1rem">
                      <Text
                        fontFamily="Inconsolata"
                        color="#1E1E1E"
                        fontSize="12px"
                        fontWeight="light"
                      >
                        Description
                      </Text>
                      <Text
                        fontFamily="Inconsolata"
                        color="#1E1E1E"
                        fontSize="18px"
                      >
                        Some Chicken Wings for the team...
                      </Text>
                    </Flex>
                    <Flex flexDir="column" ml="1rem">
                      <Text
                        fontFamily="Inconsolata"
                        color="#1E1E1E"
                        fontSize="12px"
                        fontWeight="light"
                      >
                        Amount
                      </Text>
                      <Text
                        fontFamily="Inconsolata"
                        color="#1E1E1E"
                        fontSize="18px"
                        alignSelf="center"
                      >
                        186.25
                      </Text>
                    </Flex>
                    <Select
                      ml="1rem"
                      alignSelf="center"
                      w="5rem"
                      placeholder="USDT"
                    >
                      <option value="ETH">ETH</option>
                      <option value="OPT">OPT</option>
                      <option value="ARB">ARB</option>
                    </Select>
                    <Button ml="1rem" colorScheme="blue">
                      PAY
                    </Button>
                    <AccordionButton w="4rem">
                      <AccordionIcon />
                    </AccordionButton>
                  </Flex>
                  <AccordionPanel pb={4}>
                    <Flex justify="space-evenly">
                      <Flex flexDir="column" ml="1rem">
                        <Text
                          fontFamily="Inconsolata"
                          color="#1E1E1E"
                          fontSize="12px"
                          fontWeight="light"
                        >
                          Organization
                        </Text>
                        <Text
                          fontFamily="Inconsolata"
                          color="#45A6FF"
                          fontSize="18px"
                        >
                          Attesta Bot
                        </Text>
                      </Flex>
                      <Flex flexDir="column" ml="1rem">
                        <Text
                          fontFamily="Inconsolata"
                          color="#1E1E1E"
                          fontSize="12px"
                          fontWeight="light"
                        >
                          Date
                        </Text>
                        <Text
                          fontFamily="Inconsolata"
                          color="#45A6FF"
                          fontSize="18px"
                        >
                          14/05/2021
                        </Text>
                      </Flex>
                      <Button>View Ticket</Button>
                      <Button ml="1rem" colorScheme="orange">
                        Reject
                      </Button>
                    </Flex>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
              <Accordion
                borderRadius="8px"
                mt="2rem"
                bgColor="white"
                allowToggle
                p="1rem"
              >
                <AccordionItem borderColor="transparent">
                  <Flex w="100%" justify="space-between">
                    <Flex flexDir="column" ml="1rem">
                      <Text
                        fontFamily="Inconsolata"
                        color="#1E1E1E"
                        fontSize="12px"
                        fontWeight="light"
                      >
                        UID
                      </Text>
                      <Text
                        fontFamily="Inconsolata"
                        color="#45A6FF"
                        fontSize="18px"
                      >
                        ...h6f5
                      </Text>
                    </Flex>
                    <Flex flexDir="column" ml="1rem">
                      <Text
                        fontFamily="Inconsolata"
                        color="#1E1E1E"
                        fontSize="12px"
                        fontWeight="light"
                      >
                        From
                      </Text>
                      <Text
                        fontFamily="Inconsolata"
                        color="#45A6FF"
                        fontSize="18px"
                      >
                        0xVat0...h6f5
                      </Text>
                    </Flex>
                    <Flex flexDir="column" ml="1rem">
                      <Text
                        fontFamily="Inconsolata"
                        color="#1E1E1E"
                        fontSize="12px"
                        fontWeight="light"
                      >
                        Description
                      </Text>
                      <Text
                        fontFamily="Inconsolata"
                        color="#1E1E1E"
                        fontSize="18px"
                      >
                        Some Chicken Wings for the team...
                      </Text>
                    </Flex>
                    <Flex flexDir="column" ml="1rem">
                      <Text
                        fontFamily="Inconsolata"
                        color="#1E1E1E"
                        fontSize="12px"
                        fontWeight="light"
                      >
                        Amount
                      </Text>
                      <Text
                        fontFamily="Inconsolata"
                        color="#1E1E1E"
                        fontSize="18px"
                        alignSelf="center"
                      >
                        186.25
                      </Text>
                    </Flex>
                    <Select
                      ml="1rem"
                      alignSelf="center"
                      w="5rem"
                      placeholder="USDT"
                    >
                      <option value="ETH">ETH</option>
                      <option value="OPT">OPT</option>
                      <option value="ARB">ARB</option>
                    </Select>
                    <Button ml="1rem" colorScheme="blue">
                      PAY
                    </Button>
                    <AccordionButton w="4rem">
                      <AccordionIcon />
                    </AccordionButton>
                  </Flex>
                  <AccordionPanel pb={4}>
                    <Flex justify="space-evenly">
                      <Flex flexDir="column" ml="1rem">
                        <Text
                          fontFamily="Inconsolata"
                          color="#1E1E1E"
                          fontSize="12px"
                          fontWeight="light"
                        >
                          Organization
                        </Text>
                        <Text
                          fontFamily="Inconsolata"
                          color="#45A6FF"
                          fontSize="18px"
                        >
                          Attesta Bot
                        </Text>
                      </Flex>
                      <Flex flexDir="column" ml="1rem">
                        <Text
                          fontFamily="Inconsolata"
                          color="#1E1E1E"
                          fontSize="12px"
                          fontWeight="light"
                        >
                          Date
                        </Text>
                        <Text
                          fontFamily="Inconsolata"
                          color="#45A6FF"
                          fontSize="18px"
                        >
                          14/05/2021
                        </Text>
                      </Flex>
                      <Button>View Ticket</Button>
                      <Button ml="1rem" colorScheme="orange">
                        Reject
                      </Button>
                    </Flex>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>

              <Flex
                borderRadius="8px"
                mt="2rem"
                h="6rem"
                bgColor="white"
              ></Flex>
              <Flex
                borderRadius="8px"
                mt="2rem"
                h="6rem"
                bgColor="white"
              ></Flex>
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
