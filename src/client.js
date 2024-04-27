import { EventEmitter } from "events";
import axios from "axios";
import { Transform, Writable } from "stream";

const url = "http://localhost:3000";

async function consumo() {
  const response = await axios({
    url,
    method: "get",
    responseType: "stream",
  });

  return response.data;
}

const stream = await consumo();

stream
  .pipe(
    new Transform({
      transform(chunk, encode, callback) {
        const item = JSON.parse(chunk);
        const mynumber = /\d+/.exec(item.name)[0];
        let name = item.name;

        if (mynumber % 2 === 0) {
          name = name.concat("é  par");
        } else name = name.concat("é impar");

        item.name = name;

        callback(null, JSON.stringify(item));
      },
    })
  )
  .pipe(
    new Transform({
      transform(chunk, encode, callback) {
        callback(null, chunk.toString().toUpperCase());
      },
    })
  )
  .pipe(
    new Writable({
      write(chunk, encode, callback) {
        const item = JSON.parse(chunk);
        console.log(item);
        callback();
      },
    })
  );

const emiter = new EventEmitter();

emiter.on("limpa", () => console.clear());
emiter.emit("limpa");
