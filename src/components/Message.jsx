//TODO: colores

// const test = [
//   { id: 1, tittle: "titulo de prueba", message: "Mensaje de prueba" },
//   {
//     id: 2,
//     tittle: "titulo de pureba 2",
//     message:
//       "Mensaje de prueba 2 Mensaje de prueba 2 Mensaje de prueba 2 Mensaje de prueba 2 Mensaje de prueba 2 Mensaje de prueba 2",
//   },
//   { id: 3, tittle: "titulo de pureba 3", message: "Mensaje de prueba 3" },
//   { id: 4, tittle: "titulo de pureba 4", message: "Mensaje de prueba 4" },
//   { id: 5, tittle: "titulo de pureba 5", message: "Mensaje de prueba 5" },
//   { id: 6, tittle: "titulo de pureba 6", message: "Mensaje de prueba 6" },
//   { id: 7, tittle: "titulo de pureba 7", message: "Mensaje de prueba 7" },
//   { id: 8, tittle: "titulo de pureba 8", message: "Mensaje de prueba 8" },
//   { id: 9, tittle: "titulo de pureba 9", message: "Mensaje de prueba 9" },
// ];

const styles = [
  {
    // naranja
    backgroundColor: "#ffeee2",
    color: "#fb837e",
  },
  {
    // morado
    backgroundColor: "#f4e3f5",
    color: "#ce61d1",
  },
  {
    // verde
    backgroundColor: "#A5e4bb",
    color: "#049529",
  },
  {
    // azul
    backgroundColor: "#Aae5f6",
    color: "#047295",
  },
];

import { useEffect, useState } from "react";
import { useFetch } from "../hooks";
import "../css/message.css";

export const Message = () => {
  // const { data, isLoading } = useFetch("https://bus.unab.edu.co/control/api/messages/");
  const { data, isLoading } = useFetch("http://localhost:8000/api/messages/");
  // const [data, isLoading] = [test, false];

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
        <div className="container-fluid" style={{}}>
          <div>
            {messages.map((message, index) => {
              // console.log(message);
              return (
                <div
                  key={message.id}
                  className="row justify-content-between"
                  style={styles[index % 4]}
                >
                  <div className="col-10">
                    <div className="mt-3">
                      <b>{message.tittle}</b>
                    </div>
                    <p className="mt-1 mb-3">{message.message}</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="35"
                    height="35"
                    fill="currentColor"
                    className="bi bi-x-circle col right mt-4"
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
