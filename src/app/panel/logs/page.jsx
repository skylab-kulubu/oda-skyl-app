"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faArrowUp, faArrowDown, faRefresh, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

const UserLogs = () => {
  const [userLogs, setUserLogs] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchRfidUid, setSearchRfidUid] = useState("");
  const [searchUserId, setSearchUserId] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const router = useRouter();

  useEffect(() => {
    fetchUserLogs();
  }, []);

  useEffect(() => {
    const checkLoginAndFetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token || jwtDecode(token).role !== "ROLE_ADMIN") {
        router.push("/login");
        return;
      }

      
    };

    checkLoginAndFetchUsers();
  }, []);

  const fetchUserLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/userLogs/getAllUserLogs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sortedLogs = response.data.data.sort((a, b) => new Date(b.enterDate) - new Date(a.enterDate));
      setUserLogs(sortedLogs);
    } catch (error) {
      console.error("Error fetching user logs:", error);
    }
  };

  const handleSearchByEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/userLogs/getUserLogsByEmail/${searchEmail}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sortedLogs = response.data.data.sort((a, b) => new Date(b.enterDate) - new Date(a.enterDate));
      setUserLogs(sortedLogs);
      setSearchEmail('');
    } catch (error) {
      console.error("Error fetching user logs by email:", error);
    }
  };

  const handleSearchByRfidUid = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/userLogs/getUserLogsByRfidUid/${searchRfidUid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sortedLogs = response.data.data.sort((a, b) => new Date(b.enterDate) - new Date(a.enterDate));
      setUserLogs(sortedLogs);
      setSearchRfidUid('');
    } catch (error) {
      console.error("Error fetching user logs by RFID UID:", error);
    }
  };

  const handleSearchByUserId = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/userLogs/getUserLogsByUserId/${searchUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sortedLogs = response.data.data.sort((a, b) => new Date(b.enterDate) - new Date(a.enterDate));
      setUserLogs(sortedLogs);
      setSearchUserId('');
    } catch (error) {
      console.error("Error fetching user logs by user ID:", error);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  
    setUserLogs((prevLogs) =>
      [...prevLogs].sort((a, b) => {
        if (key === "enterDate" || key === "leaveDate") {
          const dateA = new Date(a[key]).getTime();
          const dateB = new Date(b[key]).getTime();
  
          return direction === "asc" ? dateA - dateB : dateB - dateA;
        } else {
          const valueA = a.user[key] ? a.user[key].toLowerCase() : "";
          const valueB = b.user[key] ? b.user[key].toLowerCase() : "";
  
          if (valueA < valueB) {
            return direction === "asc" ? -1 : 1;
          }
          if (valueA > valueB) {
            return direction === "asc" ? 1 : -1;
          }
          return 0;
        }
      })
    );
  };
  

  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <FontAwesomeIcon icon={faArrowUp} />
      ) : (
        <FontAwesomeIcon icon={faArrowDown} />
      );
    }
    return null;
  };

  const formatDate = (dateString) => {
    if (!dateString || new Date(dateString).getTime() === new Date(0).getTime()) {
      return "Kullanıcı çıkış yapmadı!"; 
    }
    const options = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Intl.DateTimeFormat("tr-TR", options).format(new Date(dateString));
  };

  return (
    <div className="p-8 text-[#eadaff]">
      <div className="flex justify-between items-center content-center">
      <a className="text-2xl" href="/panel"> <FontAwesomeIcon icon={faArrowLeft}/> </a>
      <h1 className="text-2xl">Kullanıcı Kayıtları</h1>
      <button className="text-2xl" onClick={fetchUserLogs} > <FontAwesomeIcon icon={faRefresh}/> </button>
      </div>
      <div className="mt-10 sm:mt-20 flex flex-col sm:flex-row sm:flex-wrap sm:gap-4 gap-0.25 sm:justify-around justify-center m-auto content-center items-center w-full ">
        <div className="mb-4 flex flex-row items-center w-full ">
          <input
            type="text"
            placeholder="Search by Email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="p-2 rounded-md bg-[#363b59] text-white sm:mb-0 sm:mr-2 w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchByEmail();
              }
            }}
          />
          <button
            onClick={handleSearchByEmail}
            className="p-2  sm:w-auto rounded text-[#8388a4] hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <div className="mb-4 flex flex-row items-center w-full">
          <input
            type="text"
            placeholder="Search by RFID UID"
            value={searchRfidUid}
            onChange={(e) => setSearchRfidUid(e.target.value)}
            className="p-2  rounded-md bg-[#363b59] text-white sm:mb-0 sm:mr-2 w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchByRfidUid();
              }
            }}
          />
          <button
            onClick={handleSearchByRfidUid}
            className="p-2  sm:w-auto rounded text-[#8388a4] hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <div className="mb-4 flex flex-row items-center w-full content-center">
          <input
            type="text"
            placeholder="Search by User ID"
            value={searchUserId}
            onChange={(e) => setSearchUserId(e.target.value)}
            className="p-2  rounded-md bg-[#363b59] text-white sm:mb-0 sm:mr-2 w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchByUserId();
              }
            }}
          />
          <button
            onClick={handleSearchByUserId}
            className="p-2  sm:w-auto rounded text-[#8388a4] hover:text-white transition-colors m-auto"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto mt-4 max-h-96">
        <div className="hidden md:block">
          <table className="min-w-full bg-[#363b59] ">
            <thead className="text-[#eadaff]">
              <tr>
                <th className="py-2 cursor-pointer" onClick={() => handleSort("firstName")}>
                  Ad {renderSortIcon("firstName")}
                </th>
                <th className="py-2 cursor-pointer" onClick={() => handleSort("lastName")}>
                  Soyad {renderSortIcon("lastName")}
                </th>
                <th className="py-2 cursor-pointer" onClick={() => handleSort("email")}>
                  Email {renderSortIcon("email")}
                </th>
                <th className="py-2 cursor-pointer" onClick={() => handleSort("rfidUid")}>
                  RFID UID {renderSortIcon("rfidUid")}
                </th>
                <th className="py-2 cursor-pointer" onClick={() => handleSort("department")}>
                  Kulüp Rolü {renderSortIcon("department")}
                </th>
                <th className="py-2 cursor-pointer" onClick={() => handleSort("isInside")}>
                  Odada mı? {renderSortIcon("isInside")}
                </th>
                <th className="py-2 cursor-pointer" onClick={() => handleSort("enterDate")}>
                  Giriş Zamanı {renderSortIcon("enterDate")}
                </th>
                <th className="py-2 cursor-pointer" onClick={() => handleSort("leaveDate")}>
                  Çıkış Zamanı {renderSortIcon("leaveDate")}
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-200 text-center">
              {userLogs.map((log, index) => (
                <tr key={log.id} className={index % 2 === 0 ? "bg-[#6770a298]" : "bg-[#363b59]"}>
                  <td className="py-2 px-4">{log.user.firstName}</td>
                  <td className="py-2 px-4">{log.user.lastName}</td>
                  <td className="py-2 px-4">{log.user.email}</td>
                  <td className="py-2 px-4">{log.user.rfidUid}</td>
                  <td className="py-2 px-4">{log.user.department}</td>
                  <td className="py-2 px-4">{log.user.isInside ? "Evet" : "Hayır"}</td>
                  <td className="py-2 px-4">{formatDate(log.enterDate)}</td>
                  <td className="py-2 px-4">{formatDate(log.leaveDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {userLogs.map((log, index) => (
            <div key={log.id} className="bg-[#363b59] text-white p-4 rounded-lg shadow w-full">
              <div className="flex items-center space-x-2 text-sm">
                <div>
                  <span className="font-bold">{log.user.firstName}</span> {log.user.lastName}
                </div>
                <p className="text-gray-500 text-xs ">{formatDate(log.enterDate)}</p>
                <div className="text-gray-500 text-xs">{formatDate(log.leaveDate)}</div>
                <div>
                  <span className={`p-1.5 text-xs font-medium uppercase tracking-wider ${
                    log.user.isInside ? "text-green-800 bg-green-200" : "text-red-800 bg-red-200"
                  } rounded-md`}>
                    {log.user.isInside ? "Inside" : "Outside"}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <div>
                  <span className="font-medium">Email:</span> {log.user.email}
                </div>
                <div>
                  <span className="font-medium">RFID UID:</span> {log.user.rfidUid}
                </div>
                <div>
                  <span className="font-medium">Department:</span> {log.user.department}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserLogs;
