const transformer = (datas) => {
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
};

module.exports = transformer;
