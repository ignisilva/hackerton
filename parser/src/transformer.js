const axios = require("axios");

const transformer = (datas) => {
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
        .map((v, i) => (i === 0 ? v.replaceAll(".", "-") : `T${v}.000Z`));

      const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        location.replaceAll(" ", "+")
      )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

      const geoInfo = {
        latitude: 0,
        longitude: 0,
      };

      setTimeout(() => {
        axios.get(URL).then((res) => {
          const geoLocation = res.data.results[0].geometry.location;
          geoInfo.latitude = Number(Number(geoLocation.lat).toFixed(7));
          geoInfo.longitude = Number(Number(geoLocation.lng).toFixed(7));

          const serverURL = "http://[::1]:3000/v1/announcement";
          const newData = {
            createdAt: date + time,
            companyName,
            dueDate: oldDueDate.replaceAll(".", "-") + "T00:00:00.000Z",
            career:
              oldCareer === "경력무관"
                ? 0
                : Number(oldCareer.split("년 이상")[0]),
            employType: oldEmployType === "정규직" ? "REGULAR" : "NON_REGULAR",
            location,
            latitude: geoInfo.latitude,
            longitude: geoInfo.longitude,
            jobs: oldJobs.split(", "),
          };

          setTimeout(() => {
            console.log(newData);
            axios
              .post(serverURL, newData)
              .then((res) => {
                console.log("2res");
                console.log(res.data);
              })
              .catch((error) => {
                console.log(error);
              });
          }, 500);
        });
      }, 500);
    }

    return newDatas;
  } catch (error) {
    console.log(error);
  }
};

module.exports = transformer;
