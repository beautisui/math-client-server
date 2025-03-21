import { assertEquals } from "jsr:@std/assert";

const stringifyInput = (input) => {
  const [operation, ...operands] = input.trim().split(/\s+/);
  return JSON.stringify({ operation, operands });
};

const sendInputToServer = async (connection, input) => {
  const requestMsg = stringifyInput(input);
  const encoded = new TextEncoder().encode(requestMsg);
  await connection.write(encoded);
};

const getResponseFromServer = async (connection) => {
  const buff = new Uint8Array(1024);
  const size = await connection.read(buff);
  return buff.slice(0, size);
};

const test = async (connection, request, expected) => {
  await sendInputToServer(connection, request);
  const response = await getResponseFromServer(connection);
  const actualData = JSON.parse(new TextDecoder().decode(response));

  assertEquals(actualData, expected);
  console.log("All test are passed !");
};

const testClient = async (connection) => {
  await test(connection, "add 2 3", { result: 5 });
};

const main = async (port) => {
  const connection = await Deno.connect({ port });
  testClient(connection);
};

main(8080);
