import axios from "axios";

export const fetchTask = async () => {
  try {
    const request = await axios.get(
      "https://raw.githubusercontent.com/farizrifqi/Blum-Satset/main/src/lib/tasks.json"
    );
    return request?.data;
  } catch (err) {
    return false;
  }
};
