// fetcher.js
import axios from "axios";

export async function fetchRankingPage() {
  const url = "https://www.cnyes.com/twstock/ranking2.aspx";

  const res = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (KC-WebTrace Dashboard Bot)"
    }
  });

  return res.data; // HTML string
}
