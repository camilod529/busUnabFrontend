import { Map, Navbar } from "../components";
import { NoServicePage } from "./NoServicePage";
import { Message } from "../components/Message";

let date = new Date();
let day = date.getDay();
// console.log(date);

export const HomePage = () => {
  return (
    <>
      {!day === 0 || day === 6 ? (
        <NoServicePage />
      ) : (
        <>
          <Navbar />
          <div className="d-flex position-relative">
            <Message />
            <Map />
          </div>
        </>
      )}
    </>
  );
};
