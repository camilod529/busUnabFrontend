//TODO: mostrar arreglo de mensajes en http://localhost:8000/api/messages/, cuando no hay mensajes, no mostrar nada

import { useFetch } from "../hooks";

export const Message = () => {
  const { data, isLoading } = useFetch("http://localhost:8000/api/messages/");

  if (data?.length > 0) {
    console.log(data[0]);
    return (
      <>
        <div className="container-fluid">
          <div>
            {data.map((message) => {
              console.log(message);
              return (
                <div key={message.tittle}>
                  <span>
                    <b>{message.tittle}</b>
                  </span>
                  <p>{message.message}</p>
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
