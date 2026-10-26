export default async function handler(req, res) {
  const key = String(process.env.FIRMS_MAP_KEY || "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .trim();

  // Diagnosis MAP_KEY yang sedang digunakan Vercel
  if (req.query?.check === "1") {
    if (!key) {
      return res.status(200).json({
        keyTersimpan: false,
        validDiNASA: false
      });
    }

    try {
      const statusUrl =
        "https://firms.modaps.eosdis.nasa.gov" +
        "/mapserver/mapkey_status/?MAP_KEY=" +
        encodeURIComponent(key);

      const result = await fetch(statusUrl, {
        cache: "no-store",
        signal: AbortSignal.timeout(15000)
      });

      const data = await result.json().catch(() => ({}));

      return res.status(200).json({
        keyTersimpan: true,
        panjangKey: key.length,
        validDiNASA:
          result.ok &&
          typeof data.transaction_limit === "number",
        nasaStatus: result.status
      });
    } catch (error) {
      return res.status(502).json({
        error: "Pemeriksaan status NASA gagal"
      });
    }
  }

  if (!key) {
    return res.status(500).json({
      error: "FIRMS_MAP_KEY belum diatur"
    });
  }

  const url =
    "https://firms.modaps.eosdis.nasa.gov" +
    "/api/area/csv/" +
    encodeURIComponent(key) +
    "/VIIRS_SNPP_NRT/115.8,-0.1,119.0,1.9/1";

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
      error: "Koneksi NASA gagal",
      jenis: error?.name === "TimeoutError"
        ? "TIMEOUT"
        : "NETWORK_ERROR"
    });
  }
}
