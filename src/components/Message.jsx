//TODO: colores

import { useEffect, useState } from "react";
import { useFetch } from "../hooks";
import "../css/message.css";

export const Message = () => {
  // const { data, isLoading } = useFetch("https://bus.unab.edu.co/control/api/messages/");
  const { data, isLoading } = useFetch("http://localhost:8000/api/messages/");

  //
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!isLoading) setMessages(data);
  }, [data]);

  // console.log(messages);
  const deleteNotification = (id) => {
    const newList = messages.filter((message) => message.id !== id);

    setMessages(newList);
  };

  if (messages?.length > 0) {
    // console.log(messages);
    return (
      <>
        <div className="container-fluid">
          <div>
            {messages.map((message) => {
              // console.log(message);
              return (
                <div key={message.id} className="row justify-content-between">
                  <div className="col-10">
                    <span>
                      <b>{message.tittle}</b>
                    </span>
                    <p>{message.message}</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    fill="currentColor"
                    className="bi bi-x-circle col right mt-2"
                    viewBox="0 0 16 16"
                    onClick={() => deleteNotification(message.id)}
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  } else {
    return <></>;
  }
};
