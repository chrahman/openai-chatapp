import { Box } from "@chakra-ui/react";
import { memo } from "react";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

const Message = ({ message }) => {
  const markdown = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          hljs.configure({ tabReplace: ' ' });
          return hljs.highlight(str, { language: lang }).value;
        } catch (err) {
          console.error(err);
        }
      }
      return ''; // use external default escaping
    }
  });

  return (
    <Box bg={message.sender === "bot" ? "gray.200" : "blue.400"} py="0.75rem" px="1rem" borderRadius="20px">
      <Box as="div" color={message.sender === "bot" ? "gray.900" : "white"} dangerouslySetInnerHTML={{ __html: markdown.render(message.text) }}>
      </Box>
    </Box>
  );
};

export default memo(Message);