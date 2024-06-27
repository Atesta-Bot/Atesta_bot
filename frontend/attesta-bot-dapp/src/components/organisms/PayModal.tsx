import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { SchemaEncoder, EAS } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

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

  const handlePay = async () => {
    makeAttestation;
    onClose(); // Close the modal after payment
  };

  return (
    <>
      <Button onClick={onOpen}>PAY</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="Inconsolata">Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Total Amount:{attestedAmount}</Text>
            <Input
              placeholder="Enter payment amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button variant="ghost" onClick={handlePay}>
              Pay
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PaymentModal;
