const decodeRequest = () => {
  return new TransformStream({
    transform(chunk, controller) {
      const request = JSON.parse(new TextDecoder().decode(chunk));
      controller.enqueue(request);
    },
  });
};

const processRequest = () => {
  return new TransformStream({
    transform(chunk, controller) {
      const responseMsg = { result: 5 };
      controller.enqueue(responseMsg);
    },
  });
};

const encodeResponse = () => {
  return new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(new TextEncoder().encode(chunk));
    },
  });
};

const convertInJson = () => {
  return new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(JSON.stringify(chunk));
    },
  });
};
const handleConneciton = async (connection) => {
  console.log("connected to the server succesfully!!!");
  await connection.readable
    .pipeThrough(decodeRequest())
    .pipeThrough(processRequest())
    .pipeThrough(convertInJson())
    .pipeThrough(encodeResponse())
    .pipeTo(connection.writable);

  console.log("Piping is done !");
};

const main = async (port) => {
  const listner = Deno.listen({ port });
  for await (const connection of listner) {
    await handleConneciton(connection);
  }
};

main(8080);
