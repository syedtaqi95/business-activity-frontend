import axios from "axios";
const baseUrl = process.env.REACT_APP_BACKEND_URL;

const getAll = async () => {
  const res = await axios.get(`${baseUrl}/industryGroups`);
  return res.data;
};

const industryGroupsService = { getAll };

export default industryGroupsService;
