import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: "CloneTabNews <rafa@rafapmeneses.dev.br>",
      to: "contato@rafapmeneses.dev.br",
      subject: "Teste de assunto",
      text: "Teste de corpo.",
    });

    await email.send({
      from: "CloneTabNews <rafa@rafapmeneses.dev.br>",
      to: "contato@rafapmeneses.dev.br",
      subject: "Último email enviado",
      text: "Corpo do último email.",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<rafa@rafapmeneses.dev.br>");
    expect(lastEmail.recipients[0]).toBe("<contato@rafapmeneses.dev.br>");
    expect(lastEmail.subject).toBe("Último email enviado");
    expect(lastEmail.text).toBe("Corpo do último email.\r\n");
  });
});
