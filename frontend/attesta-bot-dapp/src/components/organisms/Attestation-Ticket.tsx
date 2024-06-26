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
import { SchemaEncoder, EAS } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import PaymentModal from "./PayModal";

interface AttestationTicketProps {
  uid: string;
  from: string;
  amount: string;
  description: string;
  organization: string;
  date: string;
  imageLink: string;
  fullUid: string;
  attester: string;
}

const AttestationTicket: React.FC<AttestationTicketProps> = ({
  uid,
  from,
  amount,
  description,
  organization,
  date,
  imageLink,
  fullUid,
  attester,
}) => {
  const useNavigate = () => {
    window.open(imageLink, "_blank");
  };

  const makeAttestation = async () => {
    // base sepolia eas 0x4200000000000000000000000000000000000021
    // sepolia  0xC2679fBD37d54388Ce493F1DB75320D236e1815e
    const eas = new EAS("0x4200000000000000000000000000000000000021");
    // Gets a default provider (in production use something else like infura/alchemy)
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    eas.connect(signer);

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder(
      "string granteeAddress, uint256 amount, string comments"
    );
    const encodedData = schemaEncoder.encodeData([
      {
        name: "granteeAddress",
        value: attester,
        type: "string",
      },
      { name: "amount", value: BigInt(amount), type: "uint256" },
      { name: "comments", value: "no comments", type: "string" },
    ]);

    //eth sepolia schema: 0xa51bb919ff8236abd4689317eaeb03fcaae3defb487623eebf08284264af1218

    //Base schema UID
    const schemaUID =
      "0xa51bb919ff8236abd4689317eaeb03fcaae3defb487623eebf08284264af1218";

    const transaction = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: attester,
        expirationTime: BigInt(0),
        revocable: true, // Be aware that if your schema is not revocable, this MUST be false
        refUID: fullUid,
        data: encodedData,
      },
    });

    const newAttestationUID = await transaction.wait();

    console.log("New attestation UID:", newAttestationUID);
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
            <PaymentModal makeAttestation={makeAttestation} />
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
