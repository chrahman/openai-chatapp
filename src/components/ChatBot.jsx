import { memo, useState } from "react";
import { Container, Box, Textarea, Button, VStack, HStack, Avatar, useColorModeValue, Text, Input, FormControl, Link, Heading } from "@chakra-ui/react";
import Message from "./Message";
import { apiService } from "./api/apiService";
import { toast } from 'react-toastify';
import ScrollToBottom from 'react-scroll-to-bottom';

const ChatBot = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey") || "");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hi there!",
      sender: "user",
    },
    {
      id: "2",
      text: "Hi there! How can I help you?",
      sender: "bot",
    },
  ]);

  const toastOptions = {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputSubmit = async () => {
    if (inputValue === "") {
      toast.error('Please enter a prompt', toastOptions);
    } else {
      setMessages((messages) => [
        ...messages,
        {
          id: messages.length + 1,
          text: inputValue,
          sender: "user",
        },
      ]);
      setIsLoading(true);
      apiService(apiKey, inputValue, (data) => {
        // console.log(data)
        if (data) {
          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            if (lastMessage && lastMessage.sender === "bot" && lastMessage.text && data) {
              const updatedMessage = {
                sender: "bot",
                text: lastMessage.text + data,
              };
              return [...prevMessages.slice(0, -1), updatedMessage];
            } else if (data) {
              return [
                ...prevMessages,
                { sender: "bot", text: data },
              ];
            } else {
              return prevMessages;
            }
          });
        }
        setIsLoading(false);
      });
      setInputValue("");
    }
  };

  const botAvatar = (
    <Avatar
      size="sm"
      name="Bot"
      src=""
      bg={useColorModeValue("gray.200", "gray.700")}
    />
  );

  const userAvatar = (
    <Avatar
      size="sm"
      name="User"
      src=""
      bg={useColorModeValue("blue.200", "blue.700")}
    />
  );

  const onSubmit = (e) => {
    e.preventDefault();
    const value = e.target[0].value;
    if (value === "") {
      toast.warn('Please enter API Key!', toastOptions);
    } else {
      const testAPIKey = apiService(value, inputValue, (data) => {
        if (data) {
          setApiKey(value);
          localStorage.setItem("apiKey", value);
        }
      });
      toast.promise(
        testAPIKey,
        {
          pending: 'Please wait, API Authenticating...',
          success: 'Authentication successfull 👌',
          error: `Authentication failed! 🤯 API key invalid`
        },
        toastOptions
      );
    }
  };

  return (
    <Box bg="rgb(103 86 189 / 1)" overflowY="auto">
      <Container maxW='container.sm' bg="#fff6" px={{ base: "0px", md: "20px" }} py={{ base: "0px", md: "20px" }} borderRadius="xl" m={{ base: "0px", md: "10px auto" }}>
        {apiKey === "" ? (
          <Box borderWidth="1px" bg="#fff" borderRadius={{ base: "", md: "xl" }} height={{ base: "100vh", md: "calc(100vh - 60px)" }} px={{ base: "15px", md: "50px" }} py="40"  textAlign="center">
            <Heading as="h2" size="lg" mb="5">OpenAI Chat Application</Heading>
            <Text my="5">Please Enter API Key First</Text>
            <Text my="5">You can find or create your API key <Link color="blue.500" href="https://platform.openai.com/account/api-keys" target="_blank">here</Link></Text>
            <Text my="5">Once you authenticate Key, It will be stored in LocalStorage</Text>
            <FormControl position="relative" as="form" onSubmit={onSubmit}>
              <Input placeholder="Enter API Key" pe="130px"/>
              <Button colorScheme="blue" type="submit" position="absolute" right="0" bottom="0" zIndex="1" mt="5">
                Authenticate
              </Button>
            </FormControl>
          </Box>
        ): (
          <Box borderWidth="1px" bg="#fff" borderRadius={{ base: "0px", md: "xl" }}>
            <ScrollToBottom className="h-full">
              <Box p={4}>
                <VStack spacing={4}>
                  {messages.map((message, index) => (
                    <HStack key={index} alignSelf={message.sender === "bot" ? "start" : "end"}>
                      {message.sender === "bot" ? botAvatar : userAvatar}
                      <Message key={index} message={message} />
                    </HStack>
                  ))}
                  {isLoading && (
                    <HStack alignSelf="start">
                      {botAvatar}
                      <Text as="i">Waiting for Response...</Text>
                    </HStack>
                  )}
                </VStack>
              </Box>
            </ScrollToBottom>
            <Box p={4} bg="white" position="relative" borderRadius="lg">
              <HStack position="relative">
                <Textarea
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Type your message here..."
                />
                <Button colorScheme="blue" onClick={handleInputSubmit} position="absolute" right="4" bottom="5" zIndex="1">
                  Send
                </Button>
              </HStack>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default memo(ChatBot);
