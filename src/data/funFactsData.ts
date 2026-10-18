export interface FunFactItem {
  id: string;
  category: 'rainforest' | 'wind_smoke' | 'recycling_impact';
  icon: string;
  badge: {
    id: string;
    en: string;
    kt: string;
  };
  headline: {
    id: string;
    en: string;
    kt: string;
  };
  highlightStat: string;
  highlightLabel: {
    id: string;
    en: string;
    kt: string;
  };
  story: {
    id: string;
    en: string;
    kt: string;
  };
  triviaBox: {
    id: string;
    en: string;
    kt: string;
  };
  dataSource: string;
}

export const FUN_FACTS: FunFactItem[] = [
  {
    id: 'ff_rainforest',
    category: 'rainforest',
    icon: 'Trees',
    badge: {
      id: 'Paru-Paru Tropis Dunia',
      en: 'Global Tropical Lungs',
      kt: 'Hutan Rimba Warisan Bumi',
    },
    headline: {
      id: 'Kutai Timur Menyimpan Pohon Ulin Raksasa Berusia Lebih dari 1.000 Tahun!',
      en: 'East Kutai Harbors 1,000-Year-Old Giant Ironwood (Ulin) Trees!',
      kt: 'Kutim Menyimpan Pohon Ulin Keramat Berusia 1.000 Tahun Lebih!',
    },
    highlightStat: '198.000 Ha',
    highlightLabel: {
      id: 'Luas Taman Nasional Kutai & Hutan Lindung Wehea',
      en: 'Total Area of Kutai National Park & Wehea Sanctuary',
      kt: 'Luas Hutan TNK Wan Hutan Adat Wehea',
    },
    story: {
      id: 'Taman Nasional Kutai (TNK) dan Hutan Lindung Wehea di Kutai Timur merupakan benteng hayati paling krusial di garis khatulistiwa. Satu hektar hutan hujan tropis Kutai Timur mampu menyerap hingga 300 ton karbon dioksida per tahun dan menghasilkan oksigen murni untuk ratusan jiwa manusia. Hutan ini juga merupakan rumah bagi Orangutan Kalimantan (Pongo pygmaeus morio) yang memiliki sistem pernapasan sangat sensitif terhadap asap karhutla.',
      en: 'Kutai National Park and Wehea Forest Sanctuary stand as crucial equatorial biodiversity bastions. A single hectare of East Kutai rainforest sequesters up to 300 tons of CO2 annually while venting pure oxygen. This ancient canopy shelters the East Bornean Orangutan, an endemic species whose delicate respiratory tract is easily devastated by particulate haze.',
      kt: 'Taman Nasional Kutai wan Hutan Adat Wehea adalah paru-paru dunia pas di garis khatulistiwa. Sehektar hutan rimba Kutim kawa menyedot 300 ton hawa panas kotor saban tahun. Di sini wadah hidup Orangutan Morio yang kada tahan bila ada asap kebakaran hutan.',
    },
    triviaBox: {
      id: 'Tahukah Anda? Pohon Ulin (Eusideroxylon zwageri) di Sangatta Selatan dijuluki "Kayu Besi" karena kayunya tenggelam dalam air dan tahan rayap selama ratusan tahun. Jika terbakar api semak, dibutuhkan waktu berabad-abad untuk menggantikannya kembali!',
      en: 'Did you know? Ironwood trees in South Sangatta are so dense that their timber sinks in water. If destroyed by wildfire, it takes over three centuries for a sapling to mature!',
      kt: 'Tahukah Pian? Kayu Ulin di Sangatta Selatan kalo dicemplungkan ke banyu langsung tenggelam saking padatnya. Mun pohon ini hangus terbakar api semak, ratusan tahun hanyar kawa tumbuh sebesar itu pulang!',
    },
    dataSource: 'WWF Indonesia & Kajian Ekosistem Hutan Kalimantan Timur',
  },
  {
    id: 'ff_wind_smoke',
    category: 'wind_smoke',
    icon: 'Wind',
    badge: {
      id: 'Dinamika Angin & Asap',
      en: 'Wind & Smoke Dispersion',
      kt: 'Laluan Angin Wan Asap',
    },
    headline: {
      id: 'Asap Pembakaran di Bengalon Bisa Sampai ke Pemukiman Sangatta Hanya dalam 2 Jam!',
      en: 'Smoke from Bengalon Can Reach Sangatta Town Within Just 2 Hours!',
      kt: 'Asap Tebakar di Bengalon Kawa Tertiup ke Sangatta Cuma dalam 2 Jam!',
    },
    highlightStat: '45 - 60 Km',
    highlightLabel: {
      id: 'Jarak Jangkau Partikel Asap PM2.5 via Angin Muson',
      en: 'Reach of PM2.5 Smoke Trajectory via Monsoon Winds',
      kt: 'Jauhnya Jelaga Asap Tertiup Angin Musim',
    },
    story: {
      id: 'Geografi Kutai Timur yang diapit perbukitan pedalaman dan pesisir Selat Makassar menciptakan sirkulasi angin darat-laut yang dinamis. Pada siang hari, pemanasan daratan menarik angin laut yang membawa partikel asap pembakaran ke arah pedalaman, sementara pada malam hari, angin katabatik meniup kabut asap pekat kembali ke lembah pemukiman padat. Inilah sebabnya mengapa pembakaran sampah liar di satu desa menjadi ancaman bagi seluruh kabupaten.',
      en: 'East Kutai topography flanked between interior hills and Makassar Strait coast creates continuous thermal sea-land breezes. Daytime thermal draws carry coastal smoke plumes inland, while nocturnal cooling deposits settled smog right onto populous river valley settlements.',
      kt: 'Kutim diapit bukit wan laut Selat Makassar. Siang hari angin laut mendorong asap ke kampung pedalaman, malam hari pas hawa dingin kabut asap turun menyelubungi rumah-rumah warga. Makanya nunu sampah di sebuting desa, orang se-Kecamatan kawa sesak napas!',
    },
    triviaBox: {
      id: 'Fenomena Inversi Suhu: Pada dini hari menjelang subuh di Kutim, udara dingin di permukaan tanah memerangkap partikel jelaga di ketinggian rendah (inversi), membuat bau sangit terasa paling pekat saat warga beribadah subuh atau berolahraga pagi.',
      en: 'Thermal Inversion Phenomenon: At dawn in Kutai, cooler ground-level air locks particulate smoke close to the surface, explaining why smoke odor smells strongest during dawn walks.',
      kt: 'Habar Subuh: Pas subuh hawa tanah dingin banar maulah asap kada kawa naik ke atas langit, tatumpuk di bawah sampai hidung kita pedih pas bangun tidur.',
    },
    dataSource: 'Stasiun Klimatologi BMKG Kalimantan Timur',
  },
  {
    id: 'ff_recycling',
    category: 'recycling_impact',
    icon: 'Recycle',
    badge: {
      id: 'Kekuatan Daur Ulang & TPS',
      en: 'Waste Diversion Dividend',
      kt: 'Berkah Wadah TPS Resmi',
    },
    headline: {
      id: 'Jika 1 Desa di Kutim Berhenti Membakar Sampah, 120 Ton Emisi Beracun Tercegah!',
      en: 'When 1 Village Stops Open Burning, 120 Tons of Toxic Emissions Are Prevented!',
      kt: 'Bila 1 Kampung di Kutim Stop Nunu Sampah, 120 Ton Asap Racun Kada Jadi Keluar!',
    },
    highlightStat: '120 Ton CO2e',
    highlightLabel: {
      id: 'Emisi Tercegah per Desa per Tahun',
      en: 'GHG Emissions Abated per Village Annually',
      kt: 'Asap Kotor yang Berhasil Dicegah Saban Tahun',
    },
    story: {
      id: 'Satu desa berpenduduk 2.500 jiwa rata-rata menghasilkan 1,5 ton sampah per hari. Jika seluruh sampah tersebut dibakar di halaman atau parit, tercipta sekitar 120 ton emisi setara gas rumah kaca serta 45 kg abu karsinogenik. Namun, jika sampah tersebut dialihkan ke fasilitas TPS 3R dan Bank Sampah Kutai Timur, 60% menjadi pupuk organik dan 30% material bernilai ekonomi!',
      en: 'A village of 2,500 residents produces approx 1.5 tons of waste daily. Open-burning this yield vents ~120 tons of CO2-equivalent emissions and 45 kg of hazardous ash. Diverting it to official 3R processing points yields 60% high-grade compost and 30% circular economy materials!',
      kt: 'Kampung dengan 2.500 urang mahasilkan kira-kira 1,5 ton sampah saban hari. Kalo ditunu semuaan di pekarangan, keluar 120 ton asap kotor wan abu racun. Tapi kalo dibuang ke TPS 3R, 60% jadi pupuk subur wan 30% plastik kawa dijual jadi duit kas desa!',
    },
    triviaBox: {
      id: 'Daur Ulang 1 Ton Plastik = Hemat 16,3 Barel Minyak Bumi & 5.774 kWh Listrik! Mengolah sampah dengan benar bukan hanya menjaga langit Kutim tetap biru, tapi juga menggerakkan ekonomi sirkular warga lokal.',
      en: 'Recycling 1 ton of plastic saves 16.3 barrels of crude oil and 5,774 kWh of electricity, powering local green livelihoods!',
      kt: 'Mendaur ulang 1 ton plastik sama hematnya lawan 16 barel minyak bumi! Langit Kutim tetap biru, warga dapat duit tabungan.',
    },
    dataSource: 'Direktorat Jenderal Pengelolaan Sampah, Limbah, dan B3 (PSLB3 KLHK)',
  },
];
