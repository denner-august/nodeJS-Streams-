import http from "http";
import { Readable } from "stream";

import { EventEmitter } from "events";
import { randomUUID } from "crypto";

const emiter = new EventEmitter();

function* run() {
  for (let index = 0; index < 99; index++) {
    const data = {
      id: randomUUID(),
      name: `denner -${index}`,
    };

    yield data;
  }
}

function handler(req, res) {
  const readble = new Readable({
    read() {
      for (const data of run()) {
        console.log(`sending`, data);
        this.push(JSON.stringify(data) + "\n");
      }
      // dados acabaram use push null
      this.push(null);
      //tem dados? o push deve ser é diferente
    },
  });

  readble.pipe(res);
}

http
  .createServer(handler)
  .listen(3000)
  .on("listening", () => console.log("servidor rodando 3000"));

emiter.on("limpa", () => console.clear());
emiter.emit("limpa");
