import { useState, useEffect } from "react";
import axios from "axios";

export default function PeopleInTheRoom() {
  const [person, setPerson] = useState([]);

  useEffect(() => {
    const fetchPeopleInTheRoom = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/room/getInsideUsers"
          // "https://oda.yildizskylab.com/api/room/getInsideUsers"
        );
        setPerson(response.data.users || []);
        console.log(person);
        // console.log(person[0]);
      } catch (error) {
        console.error("Error fetching people in the room:", error);
      }
    };
    fetchPeopleInTheRoom();
  }, []);

  return (
    // absolute -right-[80%] top-[10%]
    <div className=" bg-slate-300 bg-opacity-20 rounded-lg py-3 px-4 max-w-80 max-h-96 box-border overflow-y-scroll scrollbarThin scrollbarWebkit">
      {person && person.length > 0 ? (
        <div className="opacity-70">
          <h1 className="text-darkBlue dark:text-white mb-6 font-bold text-lg sm:text-xl md:text-2xl">
            Odada kimler var?
          </h1>
          <ul>
            {person.map((person) => (
              <li
                key={person.id}
                className="text-darkBlue dark:text-white mt-4 text-sm sm:text-base md:text-lg grid col-span-2"
              >
                {person.firstName} {person.lastName}{" "}
                <span>{person.department}</span>
              </li>
            ))}
          </ul>
          <p className="text-darkBlue dark:text-white mt-4 text-sm sm:text-base md:text-lg">
            Kişi sayı: {person.length}
          </p>
        </div>
      ) : (
        <p className="text-darkBlue dark:text-white font-bold text-lg sm:text-xl md:text-2xl opacity-70 text-center">
          Odada kimse yok.
        </p>
      )}
    </div>
  );
}
