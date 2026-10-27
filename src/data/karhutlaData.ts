/**
 * Data Modul Edukasi Karhutla Kabupaten Kutai Timur
 * 
 * Meliputi:
 * 1. Konfigurasi Pemutar Video HTML5 (edukasi-karhutla-compressed.mp4 & Google Drive Full HD)
 * 2. Profil & Ulasan Resmi Kepala BPBD Kabupaten Kutai Timur (Dr. Hj. Sulastin, S.Sos., S.H., M.Kes., M.M., M.A.P.)
 * 3. Bahaya Paparan Asap PM2.5 & Kerusakan Ekosistem Gambut Lokal
 * 4. Panduan Pencegahan Dini & Standar Masker N95/KN95
 * 5. Mini-Game Kuis Cepat Tanggap Karhutla
 */

export interface KarhutlaVideoConfig {
  videoFileName: string;
  videoSrc: string;
  googleDriveFullHdUrl: string;
  duration: string;
  title: string;
  subtitle: string;
}

export interface BpbdLeaderProfile {
  name: string;
  title: string;
  agency: string;
  location: string;
  avatarUrl: string;
  officialStatement: string;
  callout: string;
  officialBadges: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctKey: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export const KARHUTLA_VIDEO_CONFIG: KarhutlaVideoConfig = {
  videoFileName: 'edukasi-karhutla-compressed.mp4',
  videoSrc: '/edukasi-karhutla-compressed.mp4',
  googleDriveFullHdUrl: 'https://drive.google.com/file/d/1edukasi-karhutla-fullhd-kutim/view?usp=sharing',
  duration: '3 Menit 32 Detik',
  title: 'Video Edukasi Pencegahan & Mitigasi Karhutla Kutai Timur',
  subtitle: 'Panduan komprehensif bahaya pembakaran lahan gambut, taktik pemadaman terpadu, dan peran aktif masyarakat dalam menjaga langit Kutim tetap biru.',
};

export const BPBD_LEADER_PROFILE: BpbdLeaderProfile = {
  name: 'Dr. Hj. Sulastin, S.Sos., S.H., M.Kes., M.M., M.A.P.',
  title: 'Kepala Pelaksana Badan Penanggulangan Bencana Daerah',
  agency: 'BPBD Kabupaten Kutai Timur',
  location: 'Kawasan Pusat Perkantoran Bukit Pelangi, Sangatta Utara',
  avatarUrl: '/kepala_bpbd_kutim.jpg',
  officialStatement:
    'Assalamu’alaikum warahmatullahi wabarakatuh. Saya Kepala BPBD Kabupaten Kutai Timur, Dr. Hj. Sulastin. Dengan ini, saya mendukung program dari siswa-siswi SMA Negeri 2 Sangatta Utara dalam proses pengembangan aplikasi deteksi kebakaran hutan dan lahan, yaitu aplikasi SI-OTAN. Semoga dengan adanya aplikasi ini dapat memberikan manfaat dan informasi mengenai data terkait kebencanaan, baik kebakaran hutan dan lahan maupun bencana lainnya. Sekian dari saya. Buat adik-adik, tetap semangat. Salam tangguh, salam kemanusiaan.',
  callout: 'Kutai Timur Tangguh, Sigap Bencana, Langit Biru Bebas Asap',
  officialBadges: [
    'Komando Operasi Satgas Karhutla Kutim',
    'Siaga Bencana 24 Jam 18 Kecamatan',
    'Pusdalops-PB Bukit Pelangi Sangatta',
  ],
};

export const KARHUTLA_HEALTH_GUIDELINES = [
  {
    title: 'Bahaya Partikel Halus PM2.5 terhadap Saluran Pernapasan',
    badge: 'Kesehatan Respirasi & Toksikologi',
    description:
      'Partikulat PM2.5 adalah partikel mikroskopis berdiameter kurang dari 2,5 mikrometer yang terkandung dalam jelaga asap Karhutla. Ukurannya yang 30x lebih kecil dari sehelai rambut membuatnya mampu lolos dari filter alami hidung, menembus langsung ke kantung udara (alveolus) paru-paru, lalu masuk ke pembuluh darah.',
    keyPoints: [
      'Memicu Infeksi Saluran Pernapasan Akut (ISPA), bronkitis akut, dan serangan asma mendadak.',
      'Sangat rentan bagi balita, wanita hamil (risiko stunting dan gangguan janin), serta lansia pengidap penyakit kardiovaskular.',
      'Paparan jangka panjang meningkatkan risiko kanker paru akibat kandungan hidrokarbon polisiklik aromatik (PAH) dalam asap kayu/gambut.',
    ],
  },
  {
    title: 'Kerusakan Kritis Ekosistem Gambut Lokal Kutai Timur',
    badge: 'Ekologi Gambut & Konservasi',
    description:
      'Lahan basah gambut di pesisir dan pedalaman Kutai Timur (seperti Sangatta Selatan, Bengalon, Muara Bengkal, dan Muara Ancalong) memiliki ketebalan lapisan organik antara 2 hingga 5 meter. Saat terbakar, terjadi fenomena Api Bawah Permukaan (Ground Fire).',
    keyPoints: [
      'Api menjalar diam-diam di bawah tanah tanpa kobaran api besar di permukaan, sehingga sangat sulit dipadamkan dan dapat menyala kembali berminggu-minggu.',
      'Melepaskan gas karbon monoksida (CO) dan metana (CH₄) dalam volume masif ke atmosfer, memperparah pemanasan global.',
      'Menghancurkan keanekaragaman hayati endemik Kalimantan, termasuk habitat jelajah orangutan dan koridor satwa lindung.',
    ],
  },
  {
    title: 'Panduan Pencegahan Dini & Standar Penggunaan Masker',
    badge: 'Protokol Perlindungan Diri',
    description:
      'Langkah mitigasi harian saat indeks kualitas udara (ISPU) menunjukkan angka Tidak Sehat atau tercium bau sangit kabut asap di lingkungan sekitar.',
    keyPoints: [
      'Gunakan Masker Standar: Sangat dianjurkan memakai masker respirator N95 atau KN95 yang mampu menyaring partikel PM2.5 hingga 95%. Jika tidak tersedia, gunakan masker medis bedah minimal 3-ply.',
      'Tutup Ventilasi Rumah: Rapatkan jendela dan celah pintu saat pagi atau sore hari ketika asap pekat turun. Manfaatkan penjernih udara atau semprotan eco-enzyme encer (1:1000).',
      'Hindari Aktivitas Fisik Luar Ruang: Kurangi olahraga lari atau bersepeda di luar ruangan saat kabut asap tebal.',
      'Banyak Minum Air Hangat: Minum minimal 2–2,5 liter air sehari untuk membantu membersihkan tenggorokan dan menjaga kelembapan selaput lendir.',
    ],
  },
];

export const KARHUTLA_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question:
      'Ketika Anda melihat titik api atau kepulan asap mencurigakan di semak belukar atau kebun pinggir jalan, tindakan darurat pertama apa yang paling tepat dilakukan?',
    options: [
      { key: 'A', text: 'Mendekat untuk merekam video media sosial tanpa melaporkan ke petugas' },
      { key: 'B', text: 'Membiarkan saja karena mengira api akan padam sendiri oleh embun malam' },
      { key: 'C', text: 'Segera telepon Posko Damkar 113 / BPBD (0549) 21113 atau lapor cepat via website SI OTAN Kutim' },
      { key: 'D', text: 'Menambah tumpukan dahan kering di atas api agar cepat habis terbakar' },
    ],
    correctKey: 'C',
    explanation:
      'Tindakan cepat melaporkan ke Posko Damkar 113, BPBD (0549) 21113, atau fitur Lapor Cepat Warga SI OTAN Kutim memungkinkan regu reaksi cepat memadamkan api sebelum merembet meluas ke hutan gambut.',
  },
  {
    id: 2,
    question:
      'Mengapa partikel asap PM2.5 dari kebakaran hutan dan lahan sangat membahayakan kesehatan manusia dibandingkan debu biasa?',
    options: [
      { key: 'A', text: 'Karena ukurannya sangat mikro (<2,5 mikrometer) sehingga dapat menembus saringan bulu hidung hingga ke alveolus paru dan peredaran darah' },
      { key: 'B', text: 'Karena partikelnya berbau harum sehingga membuat orang menghirupnya terlalu dalam' },
      { key: 'C', text: 'Karena partikel PM2.5 langsung menguap menjadi air dalam waktu 3 detik' },
      { key: 'D', text: 'Karena partikel tersebut hanya mempengaruhi orang yang tidak berolahraga' },
    ],
    correctKey: 'A',
    explanation:
      'Partikel PM2.5 berukuran 30x lebih tipis dari sehelai rambut. Bulu hidung tidak mampu menyaringnya, sehingga partikel karsinogenik ini langsung bersarang di kantung paru-paru dan memicu ISPA serta serangan jantung.',
  },
  {
    id: 3,
    question:
      'Jenis masker apa yang memiliki standar filtrasi terbaik untuk menyaring partikel halus asap kabut Karhutla (PM2.5)?',
    options: [
      { key: 'A', text: 'Masker kain tipis 1 lapis tanpa filter' },
      { key: 'B', text: 'Masker respirator standar N95 / KN95 atau masker medis minimal 3 lapis (3-ply)' },
      { key: 'C', text: 'Tisu basah yang diikat dengan karet gelang' },
      { key: 'D', text: 'Tidak perlu masker, cukup menahan napas saat berjalan di luar' },
    ],
    correctKey: 'B',
    explanation:
      'Masker N95 / KN95 dirancang khusus memiliki kerapatan serat elektrostatik yang mampu menyaring partikel mikro udara hingga 95%, memberikan perlindungan optimal bagi sistem pernapasan saat kabut asap melanda.',
  },
];
