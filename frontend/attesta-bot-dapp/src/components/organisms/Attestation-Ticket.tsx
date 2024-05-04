import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  Select,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface AttestationTicketProps {
  uid: string;
  from: string;
  amount: string;
  description: string;
  organization: string;
  date: string;
  imageLink: string;
}

const AttestationTicket: React.FC<AttestationTicketProps> = ({
  uid,
  from,
  amount,
  description,
  organization,
  date,
  imageLink,
}) => {
  const useNavigate = () => {
    window.open(imageLink, "_blank");
  };

  return (
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
            <Text fontFamily="Inconsolata" color="#45A6FF" fontSize="18px">
              {uid}
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
            <Text fontFamily="Inconsolata" color="#45A6FF" fontSize="18px">
              {from}
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
            <Text fontFamily="Inconsolata" color="#1E1E1E" fontSize="18px">
              {description}
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
              {amount}
            </Text>
          </Flex>
          <Select ml="1rem" alignSelf="center" w="5rem" placeholder="USDT">
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
              <Text fontFamily="Inconsolata" color="#45A6FF" fontSize="18px">
                {organization}
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
              <Text fontFamily="Inconsolata" color="#45A6FF" fontSize="18px">
                {date}
              </Text>
            </Flex>
            <Button onClick={useNavigate}>View Ticket</Button>
            <Button ml="1rem" colorScheme="orange">
              Reject
            </Button>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default AttestationTicket;
