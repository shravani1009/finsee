# FinSee: Voice-Driven Financial Assistant

**FinSee** is an innovative, fully voice-driven financial application designed for users with visual impairments or those seeking hands-free interaction. By integrating cutting-edge technologies like WebKit Speech-to-Text, BERT for Intent Recognition, and Quantized FinLLaMA for personalized financial advice, FinSee empowers users to manage their finances seamlessly with just their voice. It operates through a Progressive Web App (PWA) built using **Next.js**, ensuring a smooth experience across all devices.

---

## **Features**

### **1. Secure Dynamic Authentication**
- **Dynamic Voice-based Biometric Authentication**:  
  FinSee employs a voice-based authentication model where the user is asked to speak a changing number aloud for secure access. This ensures robust security while enhancing user experience, as it constantly changes the input, making it difficult for unauthorized users to gain access.

### **2. Intent Recognition (BERT Model)**
- **Fine-Tuned BERT Model for Intent Detection**:  
  FinSee uses a fine-tuned BERT (Bidirectional Encoder Representations from Transformers) model to process spoken inputs and accurately determine user intentions. Whether users want to check their bank balance, manage their accounts, or get specific details, BERT interprets the voice commands to perform the desired actions.

### **3. Real-Time Narration (WebKit Text-to-Speech)**
- **Text-to-Speech Integration**:  
  Using WebKit's Text-to-Speech, FinSee ensures that all content on the page is read aloud, providing accessibility for users with visual impairments. Whenever the user navigates to a new page, all the content on the page is instantly read to them, making interactions effortless and inclusive.

### **4. No Touch Interaction**
- **Voice-Only Navigation**:  
  FinSee eliminates the need for touch interaction, offering a hands-free user experience. All actions, from logging in to checking balances, are performed using voice commands, making it ideal for users who prefer or require hands-free navigation.

### **5. AI-Powered Financial Advice (Quantized FinLLaMA)**
- **Personalized Financial Assistance**:  
  FinSee integrates **Quantized FinLLaMA**, a fine-tuned AI model specifically trained for financial tasks. Users can ask for personalized financial advice, investment recommendations, or answers to finance-related queries, and the app responds with intelligent, relevant insights.

---

## **Technologies Used**

- **Next.js**:  
  A powerful React-based framework that allows for server-side rendering and static site generation, enhancing the app's performance and responsiveness.

- **Progressive Web App (PWA)**:  
  FinSee is built as a PWA, ensuring that it can be accessed like a native app on any device without requiring installation. It works seamlessly across browsers, provides offline capabilities, and delivers a fast, reliable user experience.

- **WebKit Speech-to-Text**:  
  This browser-based speech recognition API converts spoken words into text, enabling users to input commands and queries easily.

- **BERT (Fine-Tuned Model)**:  
  The BERT model is fine-tuned for intent recognition, enabling the app to accurately interpret the user's spoken commands and execute the corresponding actions, such as fetching account balances or making payments.

- **Quantized FinLLaMA**:  
  Quantized FinLLaMA provides personalized financial advice based on user queries. It understands complex financial data and delivers actionable insights in real-time.

- **WebKit Text-to-Speech**:  
  This feature reads aloud the content of the page, ensuring accessibility for visually impaired users.

---

## **How It Works**

1. **Authentication**:  
   The user speaks a dynamic number for authentication. The WebKit Speech-to-Text API transcribes the voice input, and it is cross-verified using a voice recognition model for secure access to the app.

2. **Intent Recognition**:  
   Once authenticated, the user provides voice input for actions such as "Check my bank balance," or "Show my recent transactions." This input is passed to the fine-tuned BERT model, which recognizes the user's intent and processes the command.

3. **Action Execution**:  
   Depending on the recognized intent, the system fetches relevant data, like a bank balance or transaction details, and provides the response using WebKit's Text-to-Speech API. The content is read aloud to the user.

4. **Personalized Financial Advice**:  
   Users can request financial advice, such as investment recommendations. The Quantized FinLLaMA model processes the query and returns personalized financial insights based on the user's preferences and financial situation.

5. **Real-Time Narration**:  
   As users navigate between different pages within the app, all page content is read aloud, ensuring a fully voice-driven experience.

---

## **Installation**

### **Pre-requisites**
- Node.js (version 14 or higher)
- npm or yarn package manager
- Git for version control


