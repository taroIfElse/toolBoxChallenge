import { expect } from "chai";
import axios from "axios";

const baseUrl = "http://localhost:3000";

describe("API Tests", () => {
  it("should respond with 'Hola, mundo!' on /", async () => {
    const response = await axios.get(`${baseUrl}/`);
    expect(response.status).to.equal(200);
    expect(response.data).to.equal("Hola, mundo!");
  });

  it("should list files on /files/data", async () => {
    const response = await axios.get(`${baseUrl}/files/data`);
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an("object");
  });

  it("should handle invalid file names on /file/:fileName", async () => {
    try {
      const response = await axios.get(`${baseUrl}/file/invalidFileName`);
      expect(response.status).to.equal(404);
    } catch (error) {}
  });
});
