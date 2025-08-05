import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import API from "./utils/api";
import { GiDynamite  } from "react-icons/gi";


function App() {
  const [data, setData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [serverHealthy, setServerHealthy] = useState(false);
  const [serverHealthCheckLoading, setServerHealthCheckLoading] =
    useState(true);

  const fetchBackendData = async () => {
    setDataLoading(true);
    try {
      const response = await API.get(`/api/v2/get-data`);
      if (response.status !== 200) throw new Error("Failed to fetch data");
      const { data } = response;
      if (data?.data && data?.data.length > 0) {
        setData(data?.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const checkServerHealth = async () => {
    setServerHealthCheckLoading(true);
    try {
      const res = await API.get(`/api/v1/heartbeat`);
      if (res.status !== 200) throw new Error("Server is not Alive");
      setServerHealthy(res.status === 200);
    } catch {
      setServerHealthy(false);
    } finally {
      setServerHealthCheckLoading(false);
    }
  };
  
  const startChaos= async()=>{
    try {
      const res = await API.get(`/api/v2/crash-the-server`);
      if (res.status !== 200) throw new Error("Server is not Alive");

    } catch (error) {
      console.log("Error in Start Chaos function",error)
    }
  }

  useEffect(() => {
    checkServerHealth();
  }, []);

  return (
    <div className="App">
      <header className="relative bg-gradient-to-t from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-white flex flex-col items-center justify-start min-h-screen py-10 ">
        <img
          src={logo}
          className="App-logo animate-spin"
          alt="logo"
          style={{
            animationDuration: "5s",
            width: "250px",
            height: "250px",
            marginTop: "-40px",
          }}
        />
        <div className="text-lg flex items-center gap-2 mb-4">
          <span>Server status: </span>
          {serverHealthCheckLoading ? (
            <div className="w-4 h-4 border-2 border-t-transparent border-r-transparent border-yellow-400 rounded-full animate-spin"></div>
          ) : (
            <span className={serverHealthy ? "text-green-400" : "text-red-400"}>
              {serverHealthy ? "Online ✅" : "Offline ❌"}
            </span>
          )}
        </div>
        {data && data.length > 0 ? null : (
          <button
            onClick={fetchBackendData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 cursor-pointer"
          >
            Fetch Data
          </button>
        )}
        {
          <button
            onClick={startChaos}
            className=" absolute top-5 right-5 border-4 border-red-500 hover:border-red-600 text-white px-3 py-3 rounded-full mb-4 flex items-center justify-center gap-2 cursor-pointer"
          >
            <GiDynamite className="text-red-600 hover:text-white h-8 w-8"/>
          </button>
        }

        {dataLoading ? (
          <div>Loading ...</div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 px-4">
            {data.map((item, index) => (
              <div
                key={index}
                className="border border-green-500 p-4 rounded-lg bg-white text-black py-8"
              >
                <div className="mb-4">
                  {item?.completed === true ? (
                    <span className="text-green-600 text-xl">✅</span>
                  ) : item?.completed === false ? (
                    <span className="text-red-600 text-xl">❌</span>
                  ) : (
                    <span className="text-gray-600 text-xl">⏳</span>
                  )}
                </div>
                <h2 className="text-xl font-bold">{item?.title}</h2>
                <p className="text-gray-700">{item?.description}</p>
                {/* <p className="text-sm text-gray-500">ID: {item?.id}</p> */}
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-[#61d9fa] p-2 px-4 rounded-lg">
            Data is Empty
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
