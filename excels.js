const fs= require("fs");
const testfolder = "../../Downloads";


(async () => {
    try {
        const files =await fs.readdirSync(testfolder);

        files.forEach(file=> {
            console.log(typeof(file));
        })
    } catch (err) {
      console.log(err);
    }
  })();