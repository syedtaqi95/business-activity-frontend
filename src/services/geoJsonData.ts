import axios from "axios";
const baseUrl = process.env.REACT_APP_BACKEND_URL;

const getData = async (level: string) => {
  const res = await axios.get(`${baseUrl}/geocodes`);
  return res.data;
};

const geoJsonDataService = { getData };

export default geoJsonDataService;
