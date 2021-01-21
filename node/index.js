if (!process.env.EDUFLOW_API_KEY) {
  console.error(`Enter your EDUFLOW_API_KEY:

  env EDUFLOW_API_KEY=<api_key> node index.js`);
  return;
}

const http =
  process.env.EDUFLOW_API_PROTOCOL === "http"
    ? require("http")
    : require("https");

const query = JSON.stringify({
  query: `{
    institution {
      name
    }
  }`,
});

const options = {
  hostname: process.env.EDUFLOW_API_HOSTNAME || "app.eduflow.com",
  path: "/api/graphql",
  port: process.env.EDUFLOW_API_PORT || 443,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": query.length,
    Authorization: "Bearer " + process.env.EDUFLOW_API_KEY,
    "User-Agent": "Node",
  },
};

const req = http.request(options, (res) => {
  let data = "";
  console.log(`statusCode: ${res.statusCode}`);

  res.on("data", (d) => {
    data += d;
  });
  res.on("end", () => {
    console.log(JSON.parse(data).data);
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.write(query);
req.end();
