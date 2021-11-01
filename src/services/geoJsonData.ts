import axios, { AxiosResponse } from "axios";
const baseUrl = process.env.REACT_APP_BACKEND_URL;

interface GeoCodesResponse {
  message: string;
  data:
    | GeoJSON.Feature<GeoJSON.Geometry>
    | GeoJSON.FeatureCollection<GeoJSON.Geometry>
    | string;
}

const getData = async (level: number) => {
  const res: AxiosResponse<GeoCodesResponse, string> = await axios.post(
    `${baseUrl}/api/geocodes`,
    {
      level: level,
    }
  );
  return res.data.data;
};

const geoJsonDataService = { getData };

export default geoJsonDataService;
