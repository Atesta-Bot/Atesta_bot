import React, { useState, useEffect, useCallback } from "react";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Text,
  Image,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import receiptIcon from "../../assets/Icons/receipt.png";

import { SchemaEncoder, EAS } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { loadStripeOnramp } from "@stripe/crypto";
import { CryptoElements, OnrampElement } from "./StripeFiat";

const stripeOnrampPromise = loadStripeOnramp(
  "pk_test_51Hjzj6H0FO59ioJ3X5qXYwDqGuRsSCWD8bMYJGthOw6Xi24DzlMBLIjFVZfLpeoPuk2SqB7uYZN0Lymci50P9P1400eUytv3lz"
);

interface PaymentModalProps {
  attester: string;
  fullUid: string;
  attestedAmount: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  attester,
  fullUid,
  attestedAmount,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amount, setAmount] = useState("");
  const [comments, setComments] = useState("no comments");
  const [clientSecret, setClientSecret] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetches an onramp session and captures the client secret
    fetch(
      "https://stripe-sessions-production.up.railway.app/create-onramp-session",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_details: {
            wallet_address: attester,
            destination_currency: "usdc",
            destination_currencies: ["usdc", "eth"],
            destination_exchange_amount: 100,
            destination_network: "avalanche",
          },
          customer_information: {
            email: "john@doe.com",
            first_name: "John",
            last_name: "Doe",
            dob: {
              day: 4,
              month: 4,
              year: 1990,
            },
          },
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const onChange = useCallback(
    ({ session }: { session: { status: string; transaction_id: string } }) => {
      console.log("session", session);
      setMessage(`OnrampSession is now in ${session.status} state.`);
    },
    []
  );

  console.log("clientSecret", clientSecret);

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
      { name: "comments", value: comments, type: "string" },
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
    onClose();
  };

  // const handlePay = async () => {
  //   makeAttestation;
  //   onClose(); // Close the modal after payment
  // };

  return (
    <>
      <Button colorScheme="blue" bgColor="#45A6FF" onClick={onOpen}>
        PAY
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            justifyItems="center"
            textAlign="center"
            alignSelf="center"
          >
            <Flex>
              <Image alignSelf="center" w="2.5rem" src={receiptIcon} />
              <Text pt=".2rem">Pay Attestation</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="#45A6FF">
              Attested Amount:
              <Text fontSize="2rem" color="black">
                ${attestedAmount}
              </Text>
            </Text>

            <Flex>
              <Tabs variant="enclosed">
                <TabList>
                  <Tab>Pay with Stripe</Tab>
                  <Tab>Pay onChain</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <CryptoElements stripeOnramp={stripeOnrampPromise}>
                      {clientSecret && (
                        <OnrampElement
                          id="onramp-element"
                          clientSecret={clientSecret}
                          appearance={{ theme: "light" }}
                          onChange={onChange}
                          onReady={() => {}}
                        />
                      )}
                    </CryptoElements>
                  </TabPanel>
                  <TabPanel>
                    <Input
                      mt="2rem"
                      borderColor="#45A6FF"
                      placeholder="Enter payment amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <Input
                      mt="2rem"
                      mb="2rem"
                      borderColor="#45A6FF"
                      placeholder="Enter comments"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    />
                    <Button colorScheme="blue" onClick={makeAttestation}>
                      Pay
                    </Button>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Flex>
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme="red" mr={3} onClick={onClose}>
              Cancel
            </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PaymentModal;