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
  faFileLines,
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
    width: "80%",
    height: "60%",
    backgroundColor: "#363b59",
    padding: "20px 30px",
    border: "none",
  },
};

export default function Panel() {
  const [userData, setUserData] = useState(null);
  const [rfidUid, setRfidUid] = useState("");
  const [email, setEmail] = useState("");
  const [userByRfid, setUserByRfid] = useState(null);
  const [userByMail, setUserByMail] = useState(null);
  const [users, setUsers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const router = useRouter();
  const { handleSubmit, control, reset } = useForm();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkLoginAndFetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token || jwtDecode(token).role !== "ROLE_ADMIN") {
        router.push("/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        setUserData({ email: decodedToken.email });

        // Fetch users
        const response = await axios.get("/api/users/getUsers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error decoding token or fetching users:", error);
        router.push("/login");
      }
    };

    checkLoginAndFetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    try {
      const response = await axios.delete(
        `/api/users/deleteUser/${selectedUserId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data.message);
      const usersResponse = await axios.get("/api/users/getUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(usersResponse.data.users);
      closeModal();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleSearchByRfid = async () => {
    try {
      const response = await axios.get(
        `/api/users/getUserByRfidUid/${rfidUid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
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

  const handleSearchByEmail = async () => {
    try {
      const response = await axios.get(`/api/users/getUserByEmail/${email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const user = response.data.user;
      if (user) {
        openModal(user.id);
        setUserByMail(user);
      } else {
        setUserByMail(null);
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error fetching user by mail:", error);
    }
  };

  const openModal = (userId) => {
    setSelectedUserId(userId);
    const selectedUser = users.find((user) => user.id === userId);
    setIsAdmin(selectedUser.role === "ROLE_ADMIN");
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUserId(null);
    reset();
  };

  const handleUpdateUser = async (formData) => {
    try {
      formData.role = isAdmin ? "ROLE_ADMIN" : "ROLE_USER";
      const response = await axios.put(
        `/api/users/updateUser/${selectedUserId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data.message);
      const usersResponse = await axios.get("/api/users/getUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(usersResponse.data.users);
      closeModal();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleAdminCheckboxChange = (event) => {
    setIsAdmin(event.target.checked);
  };

  const renderModalContent = () => {
    if (!selectedUserId) return null;

    const selectedUser = users.find((user) => user.id === selectedUserId);

    return (
      <div className="text-[#8388a4]">
        <h2 className="sm:text-xl font-bold mb-4 text-[#8388a4] text-lg ">
          Kullanıcı Düzenle: {selectedUser.firstName} {selectedUser.lastName}
        </h2>
        <form className="" onSubmit={handleSubmit(handleUpdateUser)}>
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
            <label className="mb-1 block text-sm font-medium">
              Kulüpdeki Rol
            </label>
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
          <div className="flex justify-between items-center flex-col gap-4 sm:flex-row sm:gap-0">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="mr-2 px-4 py-2 rounded bg-[#ed5e68] text-white hover:bg-[#c94f57] transition-colors"
                onClick={handleDeleteUser}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
              <div className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 rounded-sm p-2 appearance-none w-4 h-4 border-2 border-[#8388a4] checked:bg-[#27a68e] checked:border-[#27a68e] transition-colors "
                onChange={handleAdminCheckboxChange}
                checked={isAdmin}
              />
              <span className={`mr-2 ${isAdmin ? 'text-[#27a68e]' : 'text-[#8388a4]'} transition-colors `}>Admin</span>
    
              </div>
              
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
    <div className="flex flex-col h-screen sm:p-8">
      <div className="flex justify-between items-center  p-8  text-[#27a68e]">
        <h1 className="text-xl sm:text-2xl font-bebasNeue">Oda SKY LAB Panel</h1>
        <a
              href="/panel/logs"
              className="text-2xl sm:hidden text-[#eadaff] hover:text-[#1d7c6b] transition-colors p-2 cursor-pointer"
            >
              <FontAwesomeIcon icon={faFileLines} />
            </a>
        <button
          onClick={handleLogout}
          className="text-[#eadaff] hover:text-red-500 transition-colors duration-300 text-2xl"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="h-6 w-6" />
        </button>
        
      </div>

      <div className="px-8 text-[#eadaff] flex justify-between">
        <div className="max-w-full mb-4">
          <p className="text-lg">Hoşgeldiniz, {userData.email}</p>
        </div>
      </div>

      <div className="flex-1 px-8 h-screen">
        <div className="flex-col max-w-5xl mx-auto items-center justify-center">
          <div className="mb-10 sm:mb-20 flex items-center">
            <input
              type="text"
              placeholder="EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchByEmail();
                }
              }}
              className="focus:border-none bg-[#363b59] rounded p-2 text-white flex-1 mr-2"
            />
            <button
              onClick={handleSearchByEmail}
              className="p-2 rounded text-[#8388a4] hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[500px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {users.map((user) => (
                <div key={user.id} className="p-4 rounded bg-[#363b59]">
                  <p className="p-2 text-lg text-[#eadaffc9] font-bebasNeue">
                    Kullanıcı: <br /> {user.firstName} {user.lastName}
                  </p>
                  <p className="p-2 text-lg text-[#eadaffc9] font-bebasNeue">
                    Email: <br /> {user.email}
                  </p>
                  <button
                    onClick={() => openModal(user.id)}
                    className="text-2xl mt-2 text-[#27a68e] hover:text-[#1d7c6b] transition-colors p-2"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center mt-8">
            <a
              href="/panel/logs"
              className="hidden sm:block text-lg text-[#27a68e] hover:text-[#1d7c6b] transition-colors p-2 cursor-pointer"
            >
              Kullanıcı Kayıtları <FontAwesomeIcon icon={faFileLines} />
            </a>
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
