import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <StatusInfo />
    </>
  );
}

function StatusInfo() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let carregando = "Carregando...";
  let max_connections, opened_connections, version, updatedAtText;

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
    ({
      dependencies: {
        database: { max_connections, opened_connections, version },
      },
    } = data);
  }

  return (
    <>
      <div>Última atualização: {updatedAtText ?? carregando}</div>
      <div>Conexões máximas: {max_connections ?? carregando}</div>
      <div>Conexões abertas: {opened_connections ?? carregando}</div>
      <div>Versão: {version ?? carregando}</div>
    </>
  );
}
