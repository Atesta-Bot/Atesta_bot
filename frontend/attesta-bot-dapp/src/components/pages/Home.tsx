import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import logo from "../../assets/logos/Vector Attesta Bot Logo.png";
import BotImage from "../../assets/Images/bot and phone.jpg";
import BlocksImage from "../../assets/Images/blocks.jpg";
import { Link, useNavigate } from "react-router-dom";
import projectIcon from "../../assets/Icons/corporate_fare.png";
import botIcon from "../../assets/Icons/smart_toy.png";
import editIcon from "../../assets/Icons/border_color.png";
import openBotImage from "../../assets/Images/openBot.jpg";
function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <Flex
        justify="space-between"
        borderBottom="1px"
        borderBottomColor="#C9C9C9"
        h="5.5rem"
        pl={"6rem"}
        pr={"6rem"}
      >
        <Flex>
          <Image alignSelf="center" w="2rem" src={logo} alt="logo" />
          <Text
            ml=".4rem"
            alignSelf="center"
            style={{
              color: "#1E1E1E",
              fontFamily: "Iceland",
              fontSize: "30px",
              fontWeight: "400",
              textAlign: "center",
            }}
          >
            Attesta_Bot
          </Text>
        </Flex>
        <Flex>
          <Box ml="2rem" alignSelf="center">
            <Link to="https://github.com/Atesta-Bot/Atesta_bot">Home</Link>
          </Box>
          <Box ml="2rem" alignSelf="center">
            <Link to="https://github.com/Atesta-Bot/Atesta_bot">Docs</Link>
          </Box>
          <Box ml="2rem" alignSelf="center">
            <Link to="https://github.com/Atesta-Bot/Atesta_bot">Contact</Link>
          </Box>
        </Flex>
      </Flex>

      <Flex flexDir="column">
        <Box alignSelf="center" maxW="60rem">
          <Heading
            mt="5rem"
            fontSize="4rem"
            alignSelf="center"
            fontFamily="Inconsolata"
            color="#1E1E1E"
            textAlign={"center"}
          >
            Revolutionizing DAO Resource Management with Attesta_Bot
          </Heading>
        </Box>
        <Box mt="2rem" alignSelf="center">
          <Text alignSelf="center" color="#1E1E1E" fontSize="1.2rem">
            Elevating DAOs with off-chain expense attestations via Telegram
          </Text>
        </Box>
        <Flex mt="4rem" mb="4rem" alignSelf="center">
          <Flex>
            <Text
              color="#4A4A4A"
              fontSize="2rem"
              mr="2rem"
              mt="1.5rem"
              alignSelf="center"
            >
              ⤌
            </Text>

            <Button
              mt="2rem"
              bgColor="#45A5FF"
              color="white"
              _hover={{ bgColor: "#45A5FF" }}
              onClick={() => navigate("/dapp")}
            >
              Go to Attesta_Bot
            </Button>
          </Flex>
          <Flex>
            <Button variant="outline" onClick={() => navigate("/dapp")}>
              Go to DAO DApp
            </Button>
            <Text
              pb="2.5rem"
              color="#4A4A4A"
              fontSize="2rem"
              ml="2rem"
              alignSelf="center"
            >
              ⤍
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex mb="4rem" justify="space-around" w="100%">
        <Flex>
          <Image mr={"1rem"} w="15rem" src={BlocksImage}></Image>
          <Image ml={"1rem"} w="28rem" src={BotImage}></Image>
        </Flex>
      </Flex>
      <Flex mt={"12rem"} justify="center" w={"100%"}>
        <Heading
          alignSelf="center"
          fontFamily={"Inconsolata"}
          fontSize={"4rem"}
        >
          What is <br></br>{" "}
          <Text fontFamily={"Iceland"} color="#4A4A4A">
            Attesta_Bot ?
          </Text>
        </Heading>
        <Text pt="4rem" ml="3rem" maxW="30rem">
          Innovative Telegram Bot and DApp designed to enhance the management of
          decentralized autonomous organizations (DAOs) by providing a secure
          and straightforward way to attest off-chain expenses. By utilizing the
          Ethereum Attestation Service (EAS), AttestaBot allows DAO members and
          communities to create digital attestations for financial transactions
          that occur outside of the blockchain. This is particularly useful for
          entities that use multi-signature wallets where tracking and
          justifying off-chain expenses can be cumbersome and opaque.
        </Text>
      </Flex>
      <Flex mt="12rem" justify="center" flexDir="column">
        <Heading
          alignSelf="center"
          fontFamily={"Inconsolata"}
          fontSize={"4rem"}
        >
          Main Features
        </Heading>
        <Flex mt="4rem" alignSelf="center">
          <Box
            w="20rem"
            mr="2rem"
            border="1px"
            borderColor="#C9C9C9"
            p="1rem"
            borderRadius="1rem"
          >
            <Image src={projectIcon}></Image>
            <Heading
              mt="2rem"
              fontFamily={"Iceland"}
              color="#4A4A4A"
              fontSize="2rem"
            >
              Project Creation
            </Heading>
            <Text>
              From the web interface, users can create projects and assign a
              unique ID to each. This ID is crucial as it links subsequent
              attestations to the respective project, ensuring all activities
              are correctly cataloged and easy to manage.
            </Text>
          </Box>
          <Box
            w="20rem"
            mr="2rem"
            border="1px"
            borderColor="#C9C9C9"
            p="1rem"
            borderRadius="1rem"
          >
            <Image src={botIcon}></Image>
            <Heading
              mt="2rem"
              fontFamily={"Iceland"}
              color="#4A4A4A"
              fontSize="2rem"
            >
              Attestations via Telegram Bot
            </Heading>
            <Text>
              Project members who have DAO funds allocated to them can make
              attestations directly from Telegram, targeting the specific
              project. This seamless integration allows for real-time expense
              tracking and management within the DAO environment.
            </Text>
          </Box>
          <Box
            w="20rem"
            mr="2rem"
            border="1px"
            borderColor="#C9C9C9"
            p="1rem"
            borderRadius="1rem"
          >
            <Image src={editIcon}></Image>
            <Heading
              mt="2rem"
              fontFamily={"Iceland"}
              color="#4A4A4A"
              fontSize="2rem"
            >
              Edit, Approve, or Reject
            </Heading>
            <Text>
              Through the web interface, you can edit the amount requested in
              each attestation, approve payment, or reject it altogether. This
              feature gives you greater control over financial management,
              enhancing oversight and accountability within the project.
            </Text>
          </Box>
        </Flex>
      </Flex>
      <Flex mt="12rem" justify="center" flexDir="column">
        <Heading
          alignSelf="center"
          fontFamily={"Inconsolata"}
          fontSize={"4rem"}
          mb={"4rem"}
        >
          <Text fontFamily={"Iceland"} color="#4A4A4A">
            Attesta_Bot
          </Text>{" "}
          is proudly open source!
        </Heading>
        <Flex alignSelf="center">
          <Image w="30rem" src={openBotImage}></Image>
          <Box ml="3rem">
            <Text mt="2rem" maxW="30rem">
              Giving you the freedom to modify and improve its features to meet
              your specific DAO needs. Fork the repository, customize
              functionalities, and contribute to enhancing DAO management with
              greater transparency and efficiency. Join a community of
              developers and blockchain enthusiasts, collaborate on
              developments, and help drive the future of decentralized
              organizations. Start by forking AttestaBot today and make it your
              own!
            </Text>
            <Button
              mt="2rem"
              bgColor="#45A5FF"
              color="white"
              _hover={{ bgColor: "#45A5FF" }}
            >
              <Link to="https://github.com/Atesta-Bot"> Fork on Github</Link>
            </Button>
          </Box>
        </Flex>
      </Flex>
      <Flex>
        <Box
          mt={"12rem"}
          w="100%"
          h="5rem"
          bgColor="#1E1E1E"
          color="white"
          textAlign="center"
          pt="1rem"
        >
          <Text>© 2024 Attesta_Bot. All rights reserved.</Text>
        </Box>
      </Flex>
    </div>
  );
}

export default Home;
