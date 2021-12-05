import axios, { AxiosResponse } from "axios";
import { GeoCodesResponseType } from "../types";

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const getData = async (level: number) => {
  const res: AxiosResponse<GeoCodesResponseType, string> = await axios.post(
    `${baseUrl}/api/geocodes`,
    {
      level: level,
    }
  );
  return res.data.data;
};

const geoJsonDataService = { getData };

export default geoJsonDataService;
