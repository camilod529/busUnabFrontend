import { redirect } from "react-router-dom";
import { Map, Navbar } from "../components";
import { NoServicePage } from "./NoServicePage";

let date = new Date("Aug 09 2023");
let day = date.getDay();
console.log(date);

export const HomePage = () => {
  return (
    <>
      {day === 0 || day === 6 ? (
        <NoServicePage />
      ) : (
        <>
          <Navbar />
          <Map />
        </>
      )}
    </>
  );
};
