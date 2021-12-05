import axios from "axios";
import { GeoCodesResponseType } from "../types";

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const getData = async (level: number) => {
  const { data } = await axios.post<GeoCodesResponseType>(
    `${baseUrl}/api/geocodes`,
    {
      level: level,
    }
  );
  return data.data;
};

const geoJsonDataService = { getData };

export default geoJsonDataService;
