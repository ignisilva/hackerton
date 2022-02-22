const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${process.env.GCP_API_KEY}`;

const { Client } = require("@googlemaps/google-maps-services-js");

async function getGeoData(address) {
  const geocodingClient = new Client({});
  let param = {
    address,
    components: "country:KR",
    key: process.env.GOOGLE_MAPS_API_KEY,
  };

  geocodingClient
    .geocode({
      params,
    })
    .then((res) => {
      console.log("status: " + Response.data.status);
      console.log(response.data.results[0].geometry.location.lat);
      console.log(response.data.results[0].geometry.location.lng);
      return res;
    })
    .catch((error) => {
      console.log("error: " + error);
    });
}

const transformer = async (datas) => {
  try {
    let newDatas = [];

    for (let i = 0; i < datas.length; i++) {
      const data = datas[i];
      const {
        createdAt: oldCreatedAt,
        companyName,
        dueDate: oldDueDate,
        career: oldCareer,
        employType: oldEmployType,
        location,
        jobs: oldJobs,
      } = data;

      const [date, time] = String(oldCreatedAt)
        .split(" ")
        .map((v, i) => (i === 0 ? v.replace(".", "-") : `T${v}.000Z`));

      await getGeoData(location);

      const newData = {
        createdAt: date + time,
        companyName,
        dueDate: oldDueDate.replace(".", "-") + "T00:00:00.000Z",
        career:
          oldCareer === "경력무관" ? 0 : Number(oldCareer.split("년 이상")[0]),
        employType: oldEmployType === "정규직" ? "REGULAR" : "NON_REGULAR",
        location,
        jobs: oldJobs.split(", "),
      };

      console.log(newData);
    }

    return newDatas;
  } catch (error) {}
};

module.exports = transformer;
