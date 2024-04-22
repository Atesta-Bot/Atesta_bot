import { Button, Flex, Heading, Image } from "@chakra-ui/react";
import logo from "../../assets/logos/Logo 1 Blue Attesta Bot.svg";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Home</h1>
      <Flex flexDir="column">
        <Image src={logo} alt="logo" />
        <Heading> WELCOME TO TETILLAS-BOT!!</Heading>
      </Flex>
      <Button onClick={() => navigate("/dapp")}> Go to DApp</Button>
    </div>
  );
}

export default Home;
