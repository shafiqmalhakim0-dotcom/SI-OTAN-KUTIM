/**
 * Konfigurasi Video Edukasi Sampah (SI OTAN KUTIM)
 * 
 * Silakan atur URL file video MP4 langsung dan tautan Google Drive Anda di sini:
 * 1. videoSrc:
 *    - Jalur file lokal di folder /public (contoh: '/video-edukasi-sampah.mp4')
 *    - ATAU URL file MP4 langsung dari hosting/server penyimpanan Anda (Direct Link)
 * 2. googleDriveUrl:
 *    - Tautan berbagi (sharing link) Google Drive Anda (contoh: 'https://drive.google.com/file/d/.../view?usp=sharing')
 *    - Pastikan izin akses Google Drive disetel ke "Siapa saja yang memiliki tautan" agar pengunjung dapat membuka video.
 */

export interface VideoEdukasiConfig {
  // Sumber file video langsung untuk pemutar HTML5 (<video>)
  videoSrc: string;
  // Tautan cadangan ke Google Drive (dibuka di tab baru)
  googleDriveUrl: string;
  // Judul dan keterangan video
  title: string;
  subtitle: string;
  duration?: string;
}

export const USER_VIDEO_CONFIG: VideoEdukasiConfig = {
  // Masukkan URL file video MP4 langsung atau simpan file di folder public/ lalu isi '/nama-file.mp4'
  videoSrc: '/video-edukasi-sampah.mp4',

  // Masukkan link Google Drive video Anda di sini:
  googleDriveUrl: 'https://drive.google.com/',

  title: 'Video Edukasi Sampah: Inovasi Olah Sampah Menjadi Manfaat',
  subtitle: 'Edukasi animasi SI OTAN KUTIM tentang pemilahan sampah rumah tangga, pembuatan eco-enzyme, budidaya maggot, dan penyetoran bahan daur ulang ke Bank Sampah.',
  duration: '1 Menit',
};
