import { assertEquals } from "jsr:@std/assert";

const sendInputToServer = async (connection, input) => {
  const requestMsg = JSON.stringify(input);
  const encoded = new TextEncoder().encode(requestMsg);
  await connection.write(encoded);
};

const getResponse = async (connection) => {
  const buff = new Uint8Array(20);
  const size = await connection.read(buff);
  return buff.slice(0, size);
};

const test = async (connection, request, expected) => {
  await sendInputToServer(connection, request);
  const response = await getResponse(connection);
  const actualData = JSON.parse(new TextDecoder().decode(response));

  assertEquals(actualData, expected);
  console.log("successfully done !");
};

const testClient = async (connection) => {
  await test(connection, { operation: "Add", operand: [2, 3] }, { result: 5 });
};

const main = async (port) => {
  const connection = await Deno.connect({ port });
  testClient(connection);
};

main(8080);
