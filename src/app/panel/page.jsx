"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faEdit,
  faSearch,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import { useForm, Controller } from "react-hook-form";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(5px)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    height: "60%",
    backgroundColor: "#363b59",
    padding: "20px 30px",
    border: "none",
  },
};

export default function Panel() {
  const [userData, setUserData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [rfidUid, setRfidUid] = useState("");
  const [userByRfid, setUserByRfid] = useState(null);
  const [users, setUsers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const router = useRouter();

  const { handleSubmit, control, reset } = useForm();

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/panel/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const expiryDate = new Date(Date.now() + 600 * 1000);
        setUserData({ email: decodedToken.email });

        const calculateTimeRemaining = () => {
          const now = new Date();
          const timeDiff = expiryDate - now;
          if (timeDiff <= 0) {
            clearInterval(intervalId);
            handleLogout();
          } else {
            const minutes = Math.floor(timeDiff / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            setTimeRemaining(`${minutes} : ${seconds} `);

            if (minutes === 1 && seconds === 0) {
              alert("Otomatik çıkış yapılacak!");
              handleLogout();
            }
          }
        };

        calculateTimeRemaining();
        const intervalId = setInterval(calculateTimeRemaining, 1000);

        return () => clearInterval(intervalId);
      } catch (error) {
        console.error("Error decoding token:", error);
        router.push("/panel/login");
      }
    };

    window.addEventListener("popstate", () => {
      localStorage.removeItem("token");
      router.push("/panel/login");
    });

    window.addEventListener("beforeunload", () => {
      localStorage.removeItem("token");
      router.push("/panel/login");
    });

    checkLogin();

    return () => {
      window.removeEventListener("popstate", () => {
        localStorage.removeItem("token");
        router.push("/panel/login");
      });

      window.removeEventListener("beforeunload", () => {
        localStorage.removeItem("token");
        router.push("/panel/login");
      });
    };
  }, [router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users/getUsers");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/panel/login");
  };

  const handleSearchByRfid = async () => {
    try {
      const response = await axios.get(
        `/api/users/getUserByRfidUid/${rfidUid}`
      );
      const user = response.data.user;
      if (user) {
        openModal(user.id);
        setUserByRfid(user);
      } else {
        setUserByRfid(null);
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error fetching user by RFID:", error);
    }
  };

  const openModal = (userId) => {
    setSelectedUserId(userId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUserId(null);
    reset();
  };

  const handleUpdateUser = async (formData) => {
    try {
      const response = await axios.put(
        `/api/users/updateUser/${selectedUserId}`,
        formData
      );
      console.log(response.data.message);
      const usersResponse = await axios.get("/api/users/getUsers");
      setUsers(usersResponse.data.users);
      closeModal();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const renderModalContent = () => {
    if (!selectedUserId) return null;

    const selectedUser = users.find((user) => user.id === selectedUserId);

    return (
      <div className="text-[#8388a4]">
        <h2 className="text-xl font-bold mb-4 text-[#8388a4]">
          Kullanıcı Düzenle: {selectedUser.firstName} {selectedUser.lastName}
        </h2>
        <form onSubmit={handleSubmit(handleUpdateUser)}>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Email</label>
            <Controller
              name="email"
              control={control}
              defaultValue={selectedUser.email}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  className="text-gray-800 border rounded p-2 w-full"
                />
              )}
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Ad</label>
            <Controller
              name="firstName"
              control={control}
              defaultValue={selectedUser.firstName}
              render={({ field }) => (
                <input
                  {...field}
                  className="text-gray-800 border rounded p-2 w-full"
                />
              )}
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Soyad</label>
            <Controller
              name="lastName"
              control={control}
              defaultValue={selectedUser.lastName}
              render={({ field }) => (
                <input
                  {...field}
                  className="text-gray-800 border rounded p-2 w-full"
                />
              )}
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Bölüm</label>
            <Controller
              name="department"
              control={control}
              defaultValue={selectedUser.department}
              render={({ field }) => (
                <input
                  {...field}
                  className="text-gray-800 border rounded p-2 w-full"
                />
              )}
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">RFID UID</label>
            <Controller
              name="rfidUid"
              control={control}
              defaultValue={selectedUser.rfidUid}
              render={({ field }) => (
                <input
                  {...field}
                  className="text-gray-800 border rounded p-2 w-full"
                />
              )}
            />
          </div>
          <div className="flex justify-between">
            <div>
              <button
                type="button"
                className="mr-2 px-4 py-2 rounded bg-[#ed5e68] text-white hover:bg-[#c94f57] transition-colors"
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="mr-2 px-4 py-2 rounded bg-[#8388a4] text-[#363b59] hover:bg-[#5e6175] transition-colors"
                onClick={closeModal}
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#27a68e] text-white hover:bg-[#1d7c6b] transition-colors"
              >
                Kaydet
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center py-4 px-8  text-[#eadaff]">
        <h1 className="text-xl font-bold">Oda SKY LAB Panel</h1>
        <button
          onClick={handleLogout}
          className="text-[#eadaff] hover:text-red-500 transition-colors duration-300 text-xl"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="h-6 w-6" />
        </button>
      </div>

      <div className="p-8 text-[#eadaff] flex justify-between">
        <div className="max-w-full mb-4">
          <p className="text-lg">Hoşgeldiniz, {userData.email}</p>
        </div>
        <div className="mb-4">
          <p> {timeRemaining ? timeRemaining : "N/A"}</p>
        </div>
      </div>

      <div className="flex-1 p-4 h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="mb-20 flex items-center">
            <input
              type="text"
              placeholder="RFID UID"
              value={rfidUid}
              onChange={(e) => setRfidUid(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchByRfid();
                }
              }}
              className="focus:border-none bg-[#363b59] rounded p-2 text-white flex-1 mr-2"
            />
            <button
              onClick={handleSearchByRfid}
              className="p-2 rounded text-[#8388a4] hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[500px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {users.map((user) => (
                <div key={user.id} className="p-4 rounded bg-[#363b59]">
                  <p className="p-2 text-lg text-[#8388a4] font-semibold">
                    Kullanıcı: <br /> {user.firstName} {user.lastName}
                  </p>
                  <p className="p-2 text-lg text-[#8388a4] font-semibold">
                    Email: <br /> {user.email}
                  </p>
                  <button
                    onClick={() => openModal(user.id)}
                    className="text-lg mt-2 text-[#27a68e] hover:text-[#1d7c6b] transition-colors p-2"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="User Edit Modal"
        ariaHideApp={false}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
}
