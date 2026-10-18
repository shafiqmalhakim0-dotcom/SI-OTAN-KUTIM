export interface EducationModule {
  id: string;
  title: {
    id: string;
    en: string;
    kt: string;
  };
  subtitle: {
    id: string;
    en: string;
    kt: string;
  };
  badge: string;
  readTime: string;
  iconName: string;
  content: {
    intro: {
      id: string;
      en: string;
      kt: string;
    };
    keyPoints: Array<{
      title: { id: string; en: string; kt: string };
      description: { id: string; en: string; kt: string };
      stat?: string;
    }>;
    scientificInsight: {
      chemicalFormula?: string;
      explanation: { id: string; en: string; kt: string };
    };
    practicalAction: {
      id: string;
      en: string;
      kt: string;
    };
  };
  dataSource: string;
}

export const EDUCATION_MODULES: EducationModule[] = [
  {
    id: 'dangers_of_burning',
    dataSource: 'World Health Organization (WHO) Guidelines on Air Quality & Jurnal Kesehatan Lingkungan Universitas Indonesia',
    title: {
      id: 'Bahaya Mematikan Pembakaran Sampah Terbuka',
      en: 'The Lethal Dangers of Open Waste Burning',
      kt: 'Bahaya Maut Urang Nunu Sampah Sembarangan',
    },
    subtitle: {
      id: 'Dioksin, Furan, dan Partikel PM2.5 yang Merusak Paru-Paru Manusia',
      en: 'Dioxins, Furans, and Particulate Matter Damaging Human Respiratory Systems',
      kt: 'Racun Dioksin wan Asap Pedih yang Merusak Paru-Paru',
    },
    badge: 'Kesehatan & Toksikologi',
    readTime: '4 menit baca',
    iconName: 'Flame',
    content: {
      intro: {
        id: 'Membakar sampah di pekarangan rumah tampak praktis, namun sebenarnya merupakan proses pembakaran tak sempurna dengan temperatur rendah (200°C - 400°C). Suhu rendah ini melepaskan senyawa paling beracun di bumi: Dioksin dan Furan.',
        en: 'Burning waste in backyards appears convenient, but it is actually low-temperature incomplete combustion (200°C - 400°C). This low heat releases the most hazardous airborne chemicals known to science: Dioxins and Furans.',
        kt: 'Nunu sampah di pekarangan mungkin kelihatan gampang, tapi sebenarnya api komporan itu kada panas sempurna. Asapnya mengeluarkan racun paling jahat di bumi: Dioksin wan Furan.',
      },
      keyPoints: [
        {
          title: {
            id: 'Pelepasan Racun Karsinogenik (Dioksin)',
            en: 'Carcinogenic Dioxin Emissions',
            kt: 'Racun Pemicu Kanker (Dioksin)',
          },
          description: {
            id: 'Plastik sintetis seperti PVC yang dibakar menghasilkan Polychlorinated Dibenzo-p-Dioxins (PCDD) yang bersifat karsinogen golongan 1 (penyebab kanker pasti). Senyawa ini bertahan puluhan tahun di tanah dan air.',
            en: 'Burning plastics like PVC generates Polychlorinated Dibenzo-p-Dioxins (PCDD), classified as Group 1 human carcinogens. They persist in soil and water for decades.',
            kt: 'Plastik keresek wan botol yang ditunu maulah racun PCDD pemicu penyakit kanker. Racun ini meresap ke tanah wan banyu sumur.',
          },
          stat: 'Karsinogen Golongan 1 (WHO)',
        },
        {
          title: {
            id: 'Partikulat PM2.5 Menembus Alveolus Paru',
            en: 'Microscopic PM2.5 Penetrating Alveoli',
            kt: 'Debu Halus PM2.5 Masuk ke Jantung',
          },
          description: {
            id: 'Partikel jelaga berukuran lebih kecil dari 2,5 mikrometer dapat langsung menembus filter bulu hidung, masuk ke kantung udara alveolus paru-paru, lalu masuk ke aliran darah memicu stroke dan serangan jantung.',
            en: 'Soot particulates smaller than 2.5 microns bypass nasal hairs, directly lodge into lung alveoli, and enter bloodstream triggering strokes and heart attacks.',
            kt: 'Debu asap halus kada kawa disaring hidung. Langsung masuk ke paru-paru sampai ke pembuluh darah maulah sesak wan stroke.',
          },
          stat: '30x Lebih Halus dari Sehelai Rambut',
        },
        {
          title: {
            id: 'Dampak Ekstrem pada Anak & Ibu Hamil',
            en: 'Severe Harm to Children & Mothers',
            kt: 'Bahaya Besar Gasan Kanak-Kanak wan Ibu Mengandung',
          },
          description: {
            id: 'Anak-anak bernapas 2 kali lebih cepat dibanding orang dewasa relatif terhadap berat badannya. Menghirup asap pembakaran sampah memicu stunting, asma kronis, dan cacat perkembangan saraf janin.',
            en: 'Children breathe twice as fast relative to their body weight. Inhaling open burn smoke triggers stunting, chronic asthma, and fetal neural development impairment.',
            kt: 'Kanak-kanak bernapas lebih laju. Asap nunu sampah kawa maulah anak lambat tumbuh (stunting) wan sesak napas berat.',
          },
          stat: 'Penyumbang 40% Kasus ISPA Balita',
        },
      ],
      scientificInsight: {
        chemicalFormula: 'C12H4Cl4O2 (2,3,7,8-TCDD Dioxin)',
        explanation: {
          id: 'Struktur molekul dioksin sangat stabil dan larut dalam lemak (lipofilik). Ketika ternak atau ikan menghirup atau memakan rumput yang terpapar abu pembakaran sampah, racun ini menumpuk dalam rantai makanan dan berakhir di piring makan kita.',
          en: 'Dioxin molecules are highly stable and lipophilic (fat-soluble). When livestock or fish ingest grasses contaminated by burn ash, the toxin bioaccumulates up the food chain straight to human dinner plates.',
          kt: 'Racun dioksin kada gampang hilang wan nempel di lemak daging sapi, ayam, wan iwak. Pas kita makan, racun itu masuk ke tubuh kita saurang.',
        },
      },
      practicalAction: {
        id: 'Hentikan membakar sampah plastik dan dedaunan sekarang juga! Salurkan plastik ke Bank Sampah Kutai Timur terdekat atau manfaatkan TPS 3R resmi.',
        en: 'Cease burning plastics and green waste immediately! Route dry plastics to East Kutai Waste Banks or official 3R processing depots.',
        kt: 'Stop nunu sampah plastik wan daun mulai hari ini! Kumpulkan lalu bawa ke Bank Sampah Kutim atawa TPS resmi paling parak.',
      },
    },
  },
  {
    id: 'methane_emissions',
    dataSource: 'Intergovernmental Panel on Climate Change (IPCC) Climate Change Report & Modul Pengelolaan Limbah KLHK',
    title: {
      id: 'Ancaman Senyap Gas Metana (CH4) Sampah',
      en: 'The Silent Menace of Waste Methane (CH4)',
      kt: 'Bahaya Gas Metana (CH4) dari Tumpukan Sampah',
    },
    subtitle: {
      id: 'Mengapa Timbunan Sampah Basah 28x Lebih Merusak Iklim Dibanding CO₂',
      en: 'Why Anaerobic Organic Waste Warming Impact Is 28x Stronger than CO₂',
      kt: 'Kenapa Sampah Basah Busuk Jauh Lebih Panas Merusak Bumi Dibanding CO₂',
    },
    badge: 'Dampak Perubahan Iklim',
    readTime: '3 menit baca',
    iconName: 'Wind',
    content: {
      intro: {
        id: 'Ketika sampah organik (sisa sayur, nasi, buah) ditumpuk begitu saja tanpa oksigen, bakteri anaerobik mengubahnya menjadi gas metana (CH₄). Gas metana ini memiliki kemampuan memerangkap panas atmosfer jauh lebih ganas daripada karbon dioksida biasa.',
        en: 'When organic waste is compacted without oxygen circulation, anaerobic methanogens decompose it into methane gas (CH₄). Methane traps heat in the atmosphere far more aggressively than standard carbon dioxide.',
        kt: 'Bila sisa sayur, nasi, wan buah ditumpuk mambusuk kada dapat angin, kuman di dalamnya mahasilkan gas metana (CH₄). Gas ini maulah bumi panas luar biasa dibanding asap biasa.',
      },
      keyPoints: [
        {
          title: {
            id: 'Potensi Pemanasan Global 28 Kali Lipat',
            en: '28x Global Warming Potential (GWP)',
            kt: 'Kekuatan Panas 28 Kali Lebih Kuat',
          },
          description: {
            id: 'Dalam kurun waktu 100 tahun, 1 ton gas metana memerangkap panas setara dengan 28 ton CO₂. Dalam kurun 20 tahun pertama, kekuatannya bahkan mencapai 84 kali lipat!',
            en: 'Over a 100-year timescale, 1 ton of methane traps as much heat as 28 tons of CO₂. Over the first 20 years, its warming intensity reaches an alarming 84 times!',
            kt: 'Satu ton gas metana kawa merangkap panas sama kaya 28 ton asap pabrik biasa. Di 20 tahun pertama kekuatannya sampai 84 kali lipat!',
          },
          stat: 'GWP 28x (100-Th) / 84x (20-Th)',
        },
        {
          title: {
            id: 'Risiko Ledakan & Kebakaran TPA Spontan',
            en: 'Spontaneous Combustion Hazard',
            kt: 'Bahaya Meletup Wan Menyala Sorang',
          },
          description: {
            id: 'Metana adalah gas yang sangat mudah terbakar (flammable). Kantung-kantung metana yang terperangkap di timbunan sampah liar di bawah sinar matahari terik Kutim dapat menyala secara spontan, memicu kebakaran besar yang sulit dipadamkan.',
            en: 'Methane is combustible. Trapped pockets inside illicit garbage mounds exposed to intense equatorial heat can ignite spontaneously, triggering stubborn fires.',
            kt: 'Gas metana gampang banar tebakar. Pas matahari Kutim lagi panas bedengkang, tumpukan sampah basah kawa menyala sorang tanpa disulut api!',
          },
          stat: 'Titik Nyala Metana 580°C',
        },
        {
          title: {
            id: 'Penyelamatan Dimulai dari Dapur',
            en: 'Climate Recovery in the Kitchen',
            kt: 'Kebaikan Dimulai dari Dapur Rumah',
          },
          description: {
            id: 'Lebih dari 50% komposisi sampah domestik di Kutai Timur adalah sampah organik. Jika setiap rumah tangga memisahkan sisa sayur dan buah untuk dijadikan pupuk atau eco-enzyme, kita memangkas emisi metana hingga separuh.',
            en: 'Over 50% of municipal solid waste in East Kutai is organic matter. Composting or converting it into eco-enzymes cuts local methane emissions in half.',
            kt: 'Separuh sampah di Kutim adalah sisa makanan dapur. Kalo kita pisah gasan diolah jadi pupuk atau eco-enzyme, separuh sampah kota beres!',
          },
          stat: '54% Komposisi Sampah Kutim Organik',
        },
      ],
      scientificInsight: {
        chemicalFormula: 'CH₄ (Methane) → Anaerobic Digestion',
        explanation: {
          id: 'Proses pengomposan aerobik (dengan sirkulasi udara) menghasilkan CO₂ dan humus kaya hara, bukan metana. Karena itu, mengomposkan sampah secara benar adalah bentuk aksi mitigasi iklim paling nyata di tingkat keluarga.',
          en: 'Aerobic composting with proper airflow produces harmless humic compost and minute biogenic CO₂, avoiding methane generation entirely.',
          kt: 'Maolah kompos yang dibalik-balik teratur mahasilkan pupuk subur tanpa bau busuk wan kada melepaskan gas metana berbahaya.',
        },
      },
      practicalAction: {
        id: 'Pisahkan sampah basah dapur setiap hari! Olah kulit buah menjadi cairan multiguna Eco-Enzyme atau masukkan ke komposter takakura rumah.',
        en: 'Segregate organic kitchen scraps daily! Turn fruit peels into multipurpose Eco-Enzymes or feed home composters.',
        kt: 'Pisahkan sisa sayur wan kulit buah saban hari. Olah jadi cairan ajaib Eco-Enzyme gasan bersih-bersih rumah.',
      },
    },
  },
  {
    id: 'eco_enzyme_guide',
    dataSource: 'Panduan Pengelolaan Sampah Mandiri oleh Zero Waste Indonesia & Dr. Rosukon Poompanvong Research',
    title: {
      id: 'Solusi Mandiri Rumah Tangga: Resep Eco-Enzyme',
      en: 'Household Solution: The Eco-Enzyme Formula',
      kt: 'Resep Rahasia Maolah Eco-Enzyme di Rumah',
    },
    subtitle: {
      id: 'Formula Emas 1 : 3 : 10 Mengubah Kulit Buah Jadi Pembersih Alami & Penjernih Udara',
      en: 'The Golden 1 : 3 : 10 Ratio Turning Fruit Peels into Natural Purifiers',
      kt: 'Takaran Pas 1 : 3 : 10 Manfaatkan Kulit Nanas & Jeruk Jadi Pembersih Sakti',
    },
    badge: 'Panduan Praktis DIY',
    readTime: '5 menit baca',
    iconName: 'Droplets',
    content: {
      intro: {
        id: 'Eco-Enzyme ditemukan oleh Dr. Rosukon Poompanvong dari Thailand. Ini adalah cairan fermentasi serbaguna berbahan dasar kulit buah segar, gula merah tebu/molase, dan air dengan rasio paten 1 : 3 : 10 selama 90 hari.',
        en: 'Developed by Dr. Rosukon Poompanvong from Thailand, Eco-Enzyme is a fermented bio-liquid created from fresh citrus/fruit peels, brown molasses sugar, and water at a 1 : 3 : 10 ratio over 90 days.',
        kt: 'Eco-Enzyme adalah banyu fermentasi alami yang diolah dari kulit buah manis, gula habang, wan banyu memakai takaran 1 : 3 : 10 yang diperam 3 bulan.',
      },
      keyPoints: [
        {
          title: {
            id: 'Rasio Keramat: 1 Bagian Gula : 3 Bagian Kulit Buah : 10 Bagian Air',
            en: 'Golden Formula: 1 Sugar : 3 Fruit Peels : 10 Water',
            kt: 'Takaran Pas: 1 Gula : 3 Kulit Buah : 10 Banyu',
          },
          description: {
            id: 'Contoh wadah galon 5 liter: 300 gram gula merah/molase + 900 gram kulit buah segar (jeruk, nanas, apel, pepaya) + 3.000 ml (3 liter) air bersih.',
            en: 'Example for a 5-liter container: 300g molasses + 900g raw fruit skins + 3,000ml clean water.',
            kt: 'Contoh gasan wadah galon: 300 gram gula habang + 900 gram kulit buah (nanas, limau, semangka) + 3 liter banyu bening.',
          },
          stat: 'Rasio Standar Internasional 1:3:10',
        },
        {
          title: {
            id: 'Menyerap Ozon O₃ & Menetralkan Polutan Udara',
            en: 'Airborne Pollutant Neutralization',
            kt: 'Menyegarkan Hawa Rumah & Netralkan Bau Asap',
          },
          description: {
            id: 'Larutan semprot Eco-Enzyme yang diencerkan (1 ml per 1.000 ml air) melepaskan gas ozon (O₃) dan ion negatif yang mengikat partikel asap dan bau tak sedap di udara.',
            en: 'Diluted Eco-Enzyme mist (1:1000) produces negative ions and biogenic compounds that precipitate airborne smoke particles and neutralizes odors.',
            kt: 'Disemprotkan sedikit ke hawa kamar, maulah bau sangit asap hilang wan hawa jadi sejuk segar kaya di pegunungan.',
          },
          stat: 'Pengenceran Semprot 1 : 1000',
        },
        {
          title: {
            id: 'Pembersih Lantai, Wastafel, & Pupuk Tanaman Alami',
            en: 'Multipurpose Natural Cleaner & Soil Conditioner',
            kt: 'Cairan Pel Lantai, Cuci Piring, & Pupuk Subur',
          },
          description: {
            id: 'Menggantikan pembersih kimia rumah tangga sintetik. Sisa ampas fermentasi dapat dikeringkan sebagai pupuk tanaman organik berkualitas tinggi.',
            en: 'Replaces synthetic chemical detergents entirely. Fermentation pulp can be dried into high-potency bio-fertilizer.',
            kt: 'Kada usah lagi beli sabun kimia mahal. Ampasnya kawa ditabur ke tanaman cabe wan tomat biar buahnya lebat.',
          },
          stat: '100% Biodegradable & Nol Emisi',
        },
      ],
      scientificInsight: {
        chemicalFormula: 'C6H12O6 (Glukosa) → CH3COOH (Asam Asetat) + Enzim Protease',
        explanation: {
          id: 'Proses fermentasi menghasilkan asam asetat alami, asam sitrat, dan enzim lipolitik yang memecah lemak dan kotoran secara biokimia tanpa mencemari air tanah.',
          en: 'The aerobic-anaerobic fermentation yields pure acetic acid, citric acid, and enzymes that biochemically break down greases without groundwater contamination.',
          kt: 'Hasil peraman mahasilkan asam cuka alami yang ampuh membersihkan kerak minyak tanpa merusak saluran got.',
        },
      },
      practicalAction: {
        id: 'Gunakan kalkulator interaktif di bawah untuk menghitung takaran bahan sesuai ukuran wadah yang Anda miliki di rumah!',
        en: 'Use the interactive calculator below to instantly compute exact ingredients for your home container size!',
        kt: 'Pakai kalkulator pintar di bawah gasan menakar bahan pas sama wadah yang ada di rumah pian!',
      },
    },
  },
];


