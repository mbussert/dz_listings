// var db = require('./helper_data').db

// db.backup()
// // var vv = db.get({ pass: "ynfrwbv8w" })
// // console.log(vv)
// var array = global.listings
// var err = db.push({ "id": 77, "d": 1, "title": 4, "desc": "tell tell" })
// console.log(err)
// console.log(array.length)
// var err = db.push({ "id": 77, "d": 1, "title": 4, "desc": "tell tell1" })
// console.log(err)
// console.log(array.length)
// db.persist()

// db.clean()
// console.log(array.length)

// console.log(db.get({ id: 7 }))
// console.log(db.fetch({ id: 7 }))
// console.log(db.fetchDeep("desc_", "TELL"))
// console.log(db.rejectDeep("desc", "87"))

// console.log(db.sortBy("id", true))
// console.log(db.sortBy("id", false))


const compress_images = require("compress-images");

const INPUT_path_to_your_images = "uploads/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}";
const OUTPUT_path = "compressed/";

compress_images(INPUT_path_to_your_images, OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
    { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
    { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
    function (error, completed, statistic) {
        console.log("-------------");
        console.log(error);
        console.log(completed);
        console.log(statistic);
        console.log("-------------");
    }
);