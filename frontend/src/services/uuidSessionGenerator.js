import { v4 as uuidv4 } from "uuid";

const getSessionId = () => {
  let sessionId = localStorage.getItem("user_session_id");
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem("user_session_id", sessionId);
  }
  return sessionId;
};

export default getSessionId;
