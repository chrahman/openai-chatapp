import ChatBot from "./components/ChatBot";
import { ChakraProvider } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <ChakraProvider>
      <ChatBot />
      <ToastContainer />
    </ChakraProvider>
  );
}

export default App;
