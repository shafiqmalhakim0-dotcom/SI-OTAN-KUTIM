export default async function handler(req, res) {
  const key = process.env.FIRMS_MAP_KEY;

  if (!key) {
    return res.status(500).json({
      error: "FIRMS_MAP_KEY belum diatur"
    });
  }

  const url =
    `https://firms.modaps.eosdis.nasa.gov` +
    `/api/area/csv/${key}/VIIRS_SNPP_NRT/115.8,-0.1,119.0,1.9/1`;

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      return res.status(502).json({
        error: "NASA menolak permintaan",
        nasaStatus: response.status
      });
    }

    const csv = await response.text();

    res.setHeader(
      "Content-Type",
      "text/csv; charset=utf-8"
    );

    res.setHeader(
      "Cache-Control",
      "s-maxage=900, stale-while-revalidate=600"
    );

    return res.status(200).send(csv);
  } catch (error) {
    return res.status(502).json({
      error: "koneksi ke NASA gagal",
      jenis: error?.name == "TimeoutError"
      ? "TIMEOUT"
        : NETWORK_ERROR"
    });
  }
}
