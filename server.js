const handleConneciton = async (connection) => {
  console.log("connected to the server succesfully!!!");
  const responseMsg = { result: 5 };
  await connection.write(new TextEncoder().encode(JSON.stringify(responseMsg)));
  console.log("Response sended to the client....");
};

const main = async (port) => {
  const listner = Deno.listen({ port });
  for await (const connection of listner) {
    await handleConneciton(connection);
  }
};

main(8080);
