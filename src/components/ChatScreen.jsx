import styles from "./ChatScreen.module.css";
import React, { useState, useEffect } from "react";
import { chatSession } from "../../Utilis/GeminiAIModal";
const ChatScreen = () => {
  // store the job title entered by the user
  const [jobTitle, setJobTitle] = useState("");
  // store the list of questions and answers
  const [questionAnswer, setquestionAnswer] = useState([]);
  //store the new answer entered by the user
  const [newAnswer, setNewAnswer] = useState("");
  const [reviewAiCall, setReviewAiCall] = useState("");

  // Handler for job title input change
  const handleJobTitleChange = (e) => {
    setJobTitle(e.target.value);
    // If there are no questions yet, add the initial question
    if (questionAnswer.length == 0) {
      setquestionAnswer([
        ...questionAnswer,
        {
          id: questionAnswer.length + 1,
          question: "Tell me about yourself ?",
          answer: "",
        },
      ]);
    }
  };
  // Handler for new answer input change
  const handleNewAnswerChange = (e) => {
    setNewAnswer(e.target.value);
  };
  // Handler for sending a new message
  const handleSendMessage = () => {
    if (newAnswer.trim()) {
      // setMessages([
      //   ...messages,
      //   { id: messages.length + 1, answer: "User: "+ newMessage },
      // ]);
      // Update the last question with the new answer
      if (questionAnswer.length > 0) {
        questionAnswer[questionAnswer.length - 1].answer = newAnswer;
      }
      console.log("calling AI", questionAnswer.length)
      // Call the AI model to get a new question
      if (questionAnswer.length < 3) {
        handleAIModalCall();
      } else {
        handleReviewAICall();
      }

      // Clear the new answer input
      setNewAnswer("");
    }
    console.log(questionAnswer);
  };

  const handleReviewAICall = async () => {
    const promptToAI =
      "Job Position: " +
      jobTitle +
      "," +
      JSON.stringify(questionAnswer) +
      " Depending on the above question and ansers," +
      " Please provide me a review for the answers made by the candidate according "+
      "to the questions asked."+
      "Please provide review along with 2 tips for user improvement as HTML with seperate headers."+
      "Give review_AI as field in result";
    const result = chatSession.sendMessage(promptToAI);
    const resulttemp=(await result).response.text();
    const resultReview=JSON.parse(resulttemp).review_AI;
    console.log("review", resultReview);
    setReviewAiCall(resultReview);
  };

  // Function to call the AI model and get a new question
  const handleAIModalCall = async () => {
    const promptToAI =
      "Job Position: " +
      jobTitle +
      "," +
      JSON.stringify(questionAnswer) +
      " Depending on these information please give me 1 basic interview questions in string format." +
      " Give question_AI as field in string ";

    console.log(promptToAI);
    const result = chatSession.sendMessage(promptToAI);
    const questionText = JSON.parse((await result).response.text()).question_AI;
    console.log("questionText", questionText);
    addQuestionfromAI(questionText);
  };

  // Function to add a new question from the AI model to the list
  const addQuestionfromAI = (questionText) => {
    setquestionAnswer([
      ...questionAnswer,
      { id: questionAnswer.length + 1, question: questionText },
    ]);
    console.log(questionAnswer);
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <input
          type="text"
          placeholder="Enter Job Title"
          onBlur={handleJobTitleChange}
          className={styles.textBox}
        />
        <button className={styles.submitButton}>START INTERVIEW</button>

        <div className={styles.chatContainer}>
          {questionAnswer.map((message) => (
            <div>
              {message.question && (
                <div key={message.id} className={styles.message}>
                  {"Interviewer :" + message.question}
                </div>
              )}
              {message.answer && (
                <div key={message.id} className={styles.messageAnswer}>
                  {"User :" + message.answer}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.inputContainer}>
          {/* <input
            type="textarea"
  
            placeholder="Type your message..."
            value={newMessage}
            onChange={handleNewMessageChange}
            className={styles.messageBox}
          /> */}
          <textarea
            rows={5}
            onChange={handleNewAnswerChange}
            className={styles.messageBox}
            value={newAnswer}
          ></textarea>
          <button onClick={handleSendMessage} className={styles.sendButton}>
            SEND
          </button>
        </div>
      </div>
      <div className={styles.reviewBox}>
        <div> Interview score summery</div>
        <br />
        <div className={styles.review} dangerouslySetInnerHTML={{ __html: reviewAiCall }} ></div>
      </div>
    </div>
  );
};

export default ChatScreen;
