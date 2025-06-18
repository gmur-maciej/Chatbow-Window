import React, { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react'; // Using lucide-react for icons
import { type AcceptedLanguages } from './models/AcceptedLanguages';
import { FlowiseClient } from 'flowise-sdk'

// Define an interface for the message object structure
interface Message {
  text: string;
  sender: 'user' | 'other'; // Or a more complex user type
}

const allLabels = {
  pl: {
    send: 'Wyślij',
    type: "Wpisz pytanie..."
  },
  en: {
    send: 'Send',
    type: "Type a question..."
  },
  cs: {
    send: 'Odeslat',
    type: "Napište otázku..."
  },
  de: {
    send: 'Senden',
    type: "Frage eingeben..."
  }
}

interface IProps {
  lang: AcceptedLanguages
}

// Define the ChatWindow functional component
const ChatWindow: React.FC<IProps> = (props: IProps) => {
  // State to hold the list of messages, explicitly typed as an array of Message
  const [messages, setMessages] = useState<Message[]>([]);
  // State to hold the current message being typed, explicitly typed as string
  const [newMessage, setNewMessage] = useState<string>('');
  // State to control the visibility of the chat window body
  const [isOpen, setIsOpen] = useState<boolean>(true);
  // State to track the direction of the toggle arrow icon
  const [arrowDirection, setArrowDirection] = useState<'up' | 'down'>('down');
  // Ref to automatically scroll to the latest message, typed as HTMLDivElement
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [writtenMessage, setWrittenMessage] = useState<Message>();

  const client = useRef(new FlowiseClient({ baseUrl: 'http://localhost:3000' })).current;

  async function query(question: string) {
    const prediction = await client.createPrediction({
      chatflowId: '8be872a9-0b90-45e4-b9c0-68a94b7e4141',
      question,
      streaming: true,
    });
    return prediction;
  }

  let labels = allLabels.en;

  if (props.lang === 'cs')
    labels = allLabels.cs;
  else if (props.lang === 'de')
    labels = allLabels.de;
  else if (props.lang === 'pl')
    labels = allLabels.pl;

  // Effect hook to scroll to the bottom of the message list whenever messages change and window is open
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]); // Dependency array: runs when messages or isOpen changes

  // Function to handle scrolling to the bottom of the message list
  const scrollToBottom = () => {
    // Use optional chaining (?) and check if current is not null before calling scrollIntoView
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to handle sending a new message
  // Explicitly type the event as FormEvent<HTMLFormElement>
  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior (page reload)
    // Check if the new message is not empty or just whitespace
    if (newMessage.trim() !== '') {
      // Add the new message to the messages state
      // We'll simulate a 'user' sender for simplicity
      setMessages(prevMessages => [...prevMessages, { text: newMessage, sender: 'user' }]);
      query(newMessage).then(async (response) => {
        const writtenMessage: Message = { text: '', sender: 'other' };
        for await (const chunk of response) {
          if (chunk.event === 'start') {
            setWrittenMessage({ ...writtenMessage });
          } else if (chunk.event === 'token') {
            writtenMessage.text += chunk.data;
            setWrittenMessage({ ...writtenMessage });
          } else if (chunk.event === 'end') {
            setMessages(prevMessages => [...prevMessages, { ...writtenMessage }]);
            setWrittenMessage(undefined);
          }
        }
      });

      // Clear the input field after sending
      setNewMessage('');
    }
  };

  // Function to handle changes in the input field
  // Explicitly type the event as ChangeEvent<HTMLInputElement>
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value); // Update the newMessage state with the input value
  };

  // Function to toggle the chat window open/closed state
  const toggleChatWindow = () => {
    setIsOpen(!isOpen); // Toggle the isOpen state
    setArrowDirection(isOpen ? 'up' : 'down'); // Change arrow direction based on new state
  };

  // Calculate the height of the chat body based on isOpen state
  // Header height is 20px, border is 1px top/bottom, total 22px
  const chatBodyHeight = isOpen ? 'calc(500px - 22px)' : '0px'; // Adjust 350px to desired open height

  return (
    // Main container for the chat window
    // Applying the positioning styles directly to this element
    <div style={{
      ...styles.chatContainer,
      height: isOpen ? '500px' : '22px', // Animate height based on isOpen state
      transition: 'height 0.3s ease-in-out', // Add transition for smooth sliding
    }}>
      {/* Header bar */}
      <div style={styles.header} onClick={toggleChatWindow}>
        <span style={styles.headerTitle}>UPNV</span>
        {/* Toggle button */}
        <button style={styles.toggleButton} aria-label={isOpen ? "Collapse chat window" : "Expand chat window"}>
          {/* Render arrow icon based on arrowDirection state */}
          {arrowDirection === 'down' ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>

      {/* Chat body (message list and input) - only render if isOpen is true */}
      <div style={{
        ...styles.chatBody,
        height: chatBodyHeight, // Control height for sliding effect
        overflowY: isOpen ? 'auto' : 'hidden', // Hide overflow when closed
      }}>
        {/* Area to display the list of messages */}
        <div style={styles.messageList}>
          {/* Map over the messages array and render each message */}
          {(writtenMessage ? messages.concat(writtenMessage) : messages).map((message, index) => (
            <div
              key={index} // Unique key for each message element (important for lists in React)
              style={{
                ...styles.message, // Apply base message styles
                // Apply specific styles based on the sender
                ...(message.sender === 'user' ? styles.userMessage : styles.otherMessage),
              }}
            >
              {message.text} {/* Display the message text */}
            </div>
          ))}
          {/* Empty div used as a reference point for scrolling to the bottom */}
          <div ref={messagesEndRef} />
        </div>

        {/* Form for typing and sending new messages */}
        <form onSubmit={handleSendMessage} style={styles.inputContainer}>
          {/* Input field for typing messages */}
          <input
            type="text"
            value={newMessage} // Bind input value to the newMessage state
            onChange={handleInputChange} // Call handleInputChange when the input value changes
            placeholder={labels.type} // Placeholder text
            style={styles.messageInput} // Apply input field styles
            aria-label="Message input" // Accessibility label
          />
          {/* Button to send the message */}
          <button type="submit" style={styles.sendButton}>
            {labels.send}
          </button>
        </form>
      </div>
    </div>
  );
};

// Define inline styles for the components
const styles: { [key: string]: React.CSSProperties } = {
  chatContainer: {
    // Positioning styles to keep the window in the bottom right corner
    position: 'fixed', // Fix the position relative to the viewport
    bottom: '20px',    // Position 20 pixels from the bottom
    right: '20px',     // Position 20 pixels from the right
    zIndex: 1000,      // Ensure it stays on top of other content

    // Existing styles for the chat window appearance
    width: '800px', // Fixed width for the chat window
    // height is now controlled by the state and transition
    border: '1px solid #ccc', // Border around the container
    borderRadius: '8px', // Rounded corners
    display: 'flex', // Use flexbox for layout
    flexDirection: 'column', // Stack children vertically
    overflow: 'hidden', // Hide overflow content (important for the sliding effect)
    fontFamily: 'Arial, sans-serif', // Set a default font
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', // Add a subtle shadow
    backgroundColor: '#f9f9f9', // Light background color
  },
  header: {
    height: '22px', // Height of the header bar (20px + 1px top/bottom border)
    backgroundColor: '#e0e0e0', // Slightly grey background color
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 10px', // Padding on the sides
    borderBottom: '1px solid #ccc', // Border at the bottom of the header
    cursor: 'pointer', // Indicate that the header is clickable
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#333',
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    display: 'flex', // Use flexbox to center the icon
    alignItems: 'center',
    justifyContent: 'center',
    color: '#555', // Color for the arrow icon
  },
  chatBody: {
    display: 'flex',
    flexDirection: 'column',
    // height and overflowY are controlled inline based on isOpen state
    transition: 'height 0.3s ease-in-out', // Add transition for smooth sliding
  },
  messageList: {
    flex: 1, // Allow message list to grow and take available space
    padding: '15px', // Padding inside the message list area
    // overflowY is controlled by chatBody
    display: 'flex', // Use flexbox for message alignment
    flexDirection: 'column', // Stack messages vertically
  },
  message: {
    marginBottom: '10px', // Space between messages
    padding: '8px 12px', // Padding inside each message bubble
    borderRadius: '15px', // More rounded corners for message bubbles
    maxWidth: '85%', // Limit message bubble width
    wordBreak: 'break-word', // Break long words
  },
  userMessage: {
    alignSelf: 'flex-end', // Align user messages to the right
    backgroundColor: '#007bff', // Blue background for user messages
    color: 'white', // White text for user messages
    marginLeft: 'auto', // Push user messages to the right
    borderBottomRightRadius: '5px', // Slightly less round corner on the bottom right
  },
  otherMessage: {
    alignSelf: 'flex-start', // Align other messages to the left
    backgroundColor: '#e9e9eb', // Light grey background for other messages
    color: '#333', // Dark text for other messages
    marginRight: 'auto', // Push other messages to the left
    borderBottomLeftRadius: '5px', // Slightly less round corner on the bottom left
  },
  inputContainer: {
    display: 'flex', // Use flexbox for input and button layout
    padding: '15px', // Padding around the input area
    borderTop: '1px solid #eee', // Border at the top of the input area
    backgroundColor: '#fff', // White background for the input area
  },
  messageInput: {
    flex: 1, // Allow input field to grow
    padding: '10px', // Padding inside the input field
    border: '1px solid #ccc', // Border around the input field
    borderRadius: '20px', // Rounded corners for the input field
    marginRight: '10px', // Space between input and button
    fontSize: '14px', // Font size for input text
  },
  sendButton: {
    padding: '10px 20px', // Padding inside the button
    backgroundColor: '#28a745', // Green background for the button
    color: 'white', // White text for the button
    border: 'none', // Remove default border
    borderRadius: '20px', // Rounded corners for the button
    cursor: 'pointer', // Show pointer cursor on hover
    fontSize: '14px', // Font size for button text
    fontWeight: 'bold', // Bold text
    transition: 'background-color 0.2s ease', // Smooth transition for background color
  },
  // Add hover effect for the send button
  // Note: Inline styles don't directly support :hover, this would typically be done with CSS classes
  // For a simple example, we'll omit the hover effect here, but it's good practice in CSS.
};

// Export the component for use in other parts of the application
export default ChatWindow;
