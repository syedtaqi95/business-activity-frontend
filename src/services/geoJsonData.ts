import axios from "axios";
const baseUrl = process.env.REACT_APP_BACKEND_URL;

const getData = async (level: string) => {
  const suffix =
    level === "country"
      ? "countries"
      : level === "county"
      ? "counties"
      : level === "district"
      ? "districts"
      : null;
  const res = await axios.get(`${baseUrl}/${suffix}`);
  return res.data;
};

const geoJsonDataService = { getData };

export default geoJsonDataService;
