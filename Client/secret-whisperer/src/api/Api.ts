const baseUri = process.env.REACT_APP_API_BASE_URI;

interface IPostDataResponse {
  token: string;
}

export async function postData(data: ArrayBuffer) {
  var headers = new Headers();
  headers.append("Content-Type", "application/octet-stream");

  const resp = await fetch(`${baseUri}data`, {
    method: "POST",
    headers: headers,
    body: data
  });

  const response = await resp.json();
  return response as IPostDataResponse;
}

export async function fetchData(token: string) {
  const resp = await fetch(`${baseUri}data?token=${token}`, {
    method: "GET"
  });

  if (resp.status != 404) {
    if (resp.body) {
      const reader = resp.body.getReader();
      const data = await reader.read();

      return data.value.buffer as ArrayBuffer;
    }
    return null;
  }
}
