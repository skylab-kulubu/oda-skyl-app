"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears } from "@fortawesome/free-solid-svg-icons";

import PeopleIntheRoom from "./components/PeopleInTheRoom";
export default function Home() {
  const isInitialRender = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [roomStatus, setRoomStatus] = useState({
    isEmpty: null,
    eventName: null,
    endTime: null,
  });
  const [nextEvents, setNextEvents] = useState([]);

  useEffect(() => {
    const fetchOngoingEvents = async () => {
      try {
        const response = await axios.get(
          //"http://localhost:3000/api/ongoingevents"
          //"https://oda.yildizskylab.com/api/ongoingevents"
          `/api/ongoingevents`
        );
        setOngoingEvents(response.data.ongoing_events || []);
      } catch (error) {
        console.error("Error fetching ongoing events:", error);
      }
    };

    const fetchNextEvents = async () => {
      try {
        const response = await axios.get(
          //"http://localhost:3000/api/nextevents"
          //"https://oda.yildizskylab.com/api/nextevents"
          `/api/nextevents`
        );
        const allNextEvents = response.data.next_events || [];

        // Filter out ongoing events and events not on the current day
        const filteredNextEvents = allNextEvents.filter((event) => {
          const eventDate = new Date(event.start.dateTime).toLocaleDateString();
          const currentDate = new Date().toLocaleDateString();
          const isEventOngoing =
            new Date(event.start.dateTime) <= new Date() &&
            new Date() <= new Date(event.end.dateTime);
          return !isEventOngoing && eventDate === currentDate;
        });

        setNextEvents(filteredNextEvents);
      } catch (error) {
        console.error("Error fetching next events:", error);
      }
    };

    fetchOngoingEvents();
    fetchNextEvents();

    isInitialRender.current = false;
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (ongoingEvents.length > 0) {
        const nextEvent = ongoingEvents[0];
        setRoomStatus({
          isEmpty: false,
          eventName: nextEvent.summary,
          endTime: nextEvent.end.dateTime,
        });
      } else {
        setRoomStatus({
          isEmpty: true,
          eventName: null,
          endTime: null,
        });
      }
    }
  }, [ongoingEvents]);

  useEffect(() => {
    if (!isInitialRender.current) {
      setIsLoading(false);
    }
  }, [roomStatus.isEmpty, roomStatus.eventName, roomStatus.endTime]);

  const isEventOngoing = (event) => {
    const currentDateTime = new Date();
    const eventStartDateTime = new Date(event.start.dateTime);
    const eventEndDateTime = new Date(event.end.dateTime);
    return (
      eventStartDateTime <= currentDateTime &&
      currentDateTime <= eventEndDateTime
    );
  };

  const renderEventCard = (event) => (
    <div key={event.id} className="bg-white rounded shadow p-4">
      <p className="font-bold text-xl mb-2">{event.summary}</p>
      <p className="text-gray-600">
        <span className="font-bold">Start Time:</span>{" "}
        {new Date(event.start.dateTime).toLocaleTimeString()}
      </p>
      <p className="text-gray-600">
        <span className="font-bold">End Time:</span>{" "}
        {new Date(event.end.dateTime).toLocaleTimeString()}
      </p>
    </div>
  );

  return (
    <div className="relative">
      <div className="min-h-screen transition-all font-inter flex items-center justify-center pb-8 flex-col sm:flex-row overflow-hidden ">
        <div className="sm:block hidden z-[1000]">
        <a
          href="http://yildizskylab.com"
          className="absolute p-10 tracking-[0.25rem] text-xl sm:-rotate-90 sm:left-4 top-2 sm:top-9 font-bebasNeue text-[#eadaff] hover:text-[#27a68e] transition-colors duration-300 left-0 "
        >
          SKY LAB
        </a>

        <a
          href="/panel"
          className="block sm:hidden p-10 absolute top-2 text-2xl text-[#eadaff] hover:text-[#27a68e] transition-colors duration-300 right-0"
        >
          <FontAwesomeIcon icon={faGears} />
        </a>

        <a
          href="/panel"
          className="absolute p-10 cursor-pointer tracking-[0.25rem] text-xl sm:-rotate-90 sm:left-7 sm:bottom-10 font-bebasNeue text-[#eadaff] hover:text-[#27a68e] transition-colors duration-300 sm:block hidden"
        >
          PANEL
        </a>
        </div>

        <header className="w-full flex justify-between items-center p-10 top-0 sm:hidden">
        <a
          href="http://yildizskylab.com"
          className="tracking-[0.25rem] text-xl sm:-rotate-90 sm:left-4 font-bebasNeue text-[#eadaff] hover:text-[#27a68e] transition-colors duration-300"
        >
          SKY LAB
        </a>

        <a
          href="/panel"
          className="block sm:hidden text-2xl text-[#eadaff] hover:text-[#27a68e] transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faGears} />
        </a>

        <a
          href="/panel"
          className="tracking-[0.25rem] text-xl sm:-rotate-90 font-bebasNeue text-[#eadaff] hover:text-[#27a68e] transition-colors duration-300 sm:block hidden"
        >
          PANEL
        </a>
      </header>
        

        <main className="relative grid grid-cols-6 max-lg:gap-6 lg:gap-8 px-8 md:pr-7 place-content-center place-items-center overflow-y-hidden pb-20 top-10">
          <section className="flex flex-col justify-between items-center col-start-1 col-end-7 row-start-1 text-center">
            <div className="flex flex-col items-center justify-center">
              {roomStatus.isEmpty == null && (
                <>
                  <span className="loader"></span>
                  <h1 className="text-[#eadaff] my-6 font-bold text-4xl sm:text-5xl md:text-7xl">
                    Yükleniyor...
                  </h1>
                </>
              )}
              {roomStatus.isEmpty != null && (
                <div className="bg-white flex justify-center items-center w-60 sm:w-80 aspect-square overflow-hidden rounded-[50%]">
                  <Image
                    src={`/${roomStatus.isEmpty ? "happy" : "sad"}.svg`}
                    alt="Skylab"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              )}
              {roomStatus.isEmpty == true && (
                <h1 className="text-[#eadaff] my-6 lg:mb-10 font-bold text-4xl sm:text-5xl md:text-7xl">
                  Odada bir etkinlik yok.
                </h1>
              )}
              {roomStatus.isEmpty == false && (
                <p className="mt-2 md:mt-6 w-80 md:w-96 font-bold text-lg md:text-xl text-center text-[#eadaff]">
                  Şu anda: {roomStatus.eventName} etkinliği mevcut.{" "}
                  {roomStatus.endTime
                    ? `Oda en erken ${new Date(
                        roomStatus.endTime
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })} saatinde kullanılabilir.`
                    : "Oda gün boyunca kullanımda olacak."}
                </p>
              )}

              <a
                href="https://calendar.google.com/calendar/embed?src=33d9d22de488b646f863a248f328b5e9a6fb20a3b3a9bfb14b8e676a5d9bc05b%40group.calendar.google.com&ctz=Europe%2FIstanbul"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg py-4 px-20 md:hover:scale-110 transition-transform flex justify-center items-center dark:text-darkBlue bg-[#eadaff] mt-5"
              >
                Takvime Git
              </a>
            </div>
          </section>
          <PeopleIntheRoom />
        </main>
      </div>
    </div>
  );
}
