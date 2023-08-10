//TODO: mostrar arreglo de mensajes en http://localhost:8000/api/messages/, cuando no hay mensajes, no mostrar nada

import { useEffect, useState } from "react";
import { useFetch } from "../hooks";

export const Message = () => {
  const { data, isLoading } = useFetch("http://localhost:8000/api/messages/");

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!isLoading) setMessages(data);
  }, [data]);

  console.log(messages);
  const deleteNotification = (id) => {
    console.log(id);
    setMessages((current) => current.splice(id, 1));
  };

  if (messages?.length > 0) {
    // console.log(messages[0]);
    return (
      <>
        <div className="container-fluid">
          <div>
            {messages.map((message, index) => {
              // console.log(message);
              console.log(index);
              return (
                <div key={message.tittle} className="row">
                  <div className="col-10">
                    <span>
                      <b>{message.tittle}</b>
                    </span>
                    <p>{message.message}</p>
                  </div>
                  <span className="col-2 mt-2" onClick={() => deleteNotification(index)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      fill="currentColor"
                      className="bi bi-x-circle"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                  </span>
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
