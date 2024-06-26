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
} from "@chakra-ui/react";

const PaymentModal = ({ makeAttestation }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amount, setAmount] = useState("");

  const handlePay = async () => {
    await makeAttestation(amount); // Assuming makeAttestation can directly accept the amount
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
