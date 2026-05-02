export type PpdbStatus = 
  | "REGISTRASI"
  | "MENUNGGU_PEMBAYARAN_PENDAFTARAN"
  | "VERIFIKASI_PEMBAYARAN_PENDAFTARAN"
  | "PENGISIAN_FORMULIR"
  | "UPLOAD_BERKAS"
  | "FINALISASI"
  | "VERIFIKASI_BERKAS"
  | "PENGUMUMAN"
  | "TAGIHAN_DAFTAR_ULANG"
  | "BAYAR_DAFTAR_ULANG"
  | "VERIFIKASI_DAFTAR_ULANG"
  | "SINKRONISASI"
  | "DITOLAK";

export interface PpdbWorkflowState {
  currentStatus: PpdbStatus;
  stepNumber: number;
  label: string;
  isCompleted: boolean;
}

export function derivePpdbStatus(pendaftar: any): PpdbWorkflowState {
  // mapping status database ke workflow
  // pendaftar has: status, berkas[], tagihan[]
  
  const tagihanPendaftaran = pendaftar.tagihan?.find((t: any) => t.jenis === "PENDAFTARAN");
  const tagihanDaftarUlang = pendaftar.tagihan?.find((t: any) => t.jenis === "DAFTAR_ULANG");
  
  // 1. Ditolak
  if (pendaftar.status === "DITOLAK") {
    return { currentStatus: "DITOLAK", stepNumber: 0, label: "Pendaftaran Ditolak", isCompleted: false };
  }

  // 2. Sinkronisasi (Diterima & NIS created)
  if (pendaftar.status === "DITERIMA" && pendaftar.isSynced) {
    return { currentStatus: "SINKRONISASI", stepNumber: 12, label: "Selesai / Menjadi Siswa", isCompleted: true };
  }

  // 11. Verifikasi Daftar Ulang
  if (tagihanDaftarUlang?.status === "LUNAS" && pendaftar.status === "DITERIMA") {
     // check if sync is next
     return { currentStatus: "SINKRONISASI", stepNumber: 12, label: "Sinkronisasi Data Siswa", isCompleted: false };
  }

  // 10. Bayar Daftar Ulang
  if (tagihanDaftarUlang && tagihanDaftarUlang.status === "BELUM_LUNAS") {
    const hasPaymentPending = tagihanDaftarUlang.pembayaran?.some((p: any) => p.status === "PENDING");
    if (hasPaymentPending) {
      return { currentStatus: "VERIFIKASI_DAFTAR_ULANG", stepNumber: 11, label: "Verifikasi Daftar Ulang", isCompleted: false };
    }
    return { currentStatus: "BAYAR_DAFTAR_ULANG", stepNumber: 10, label: "Pembayaran Daftar Ulang", isCompleted: false };
  }

  // 9. Tagihan Daftar Ulang
  if (pendaftar.status === "DITERIMA" && !tagihanDaftarUlang) {
    return { currentStatus: "TAGIHAN_DAFTAR_ULANG", stepNumber: 9, label: "Menunggu Tagihan Daftar Ulang", isCompleted: false };
  }

  // 8. Pengumuman
  if (pendaftar.status === "TERVERIFIKASI") {
    return { currentStatus: "PENGUMUMAN", stepNumber: 8, label: "Menunggu Pengumuman Seleksi", isCompleted: false };
  }

  const isFinalized = pendaftar.dataFormulir?.isFinalized === true;

  // 7. Verifikasi Berkas
  if (pendaftar.status === "MENUNGGU" && isFinalized) {
    return { currentStatus: "VERIFIKASI_BERKAS", stepNumber: 7, label: "Proses Verifikasi Berkas", isCompleted: false };
  }

  // 6. Finalisasi
  if (pendaftar.dataFormulir && pendaftar.berkas?.length > 0 && !isFinalized) {
     return { currentStatus: "FINALISASI", stepNumber: 6, label: "Finalisasi Data", isCompleted: false };
  }

  // 5. Upload Berkas
  if (pendaftar.dataFormulir && (!pendaftar.berkas || pendaftar.berkas.length === 0)) {
    return { currentStatus: "UPLOAD_BERKAS", stepNumber: 5, label: "Upload Berkas Persyaratan", isCompleted: false };
  }

  // 4. Pengisian Formulir
  if (tagihanPendaftaran?.status === "LUNAS" && !pendaftar.dataFormulir) {
    return { currentStatus: "PENGISIAN_FORMULIR", stepNumber: 4, label: "Pengisian Formulir Lengkap", isCompleted: false };
  }

  // 3. Verifikasi Pembayaran Pendaftaran
  if (tagihanPendaftaran?.status === "BELUM_LUNAS") {
    const hasPaymentPending = tagihanPendaftaran.pembayaran?.some((p: any) => p.status === "PENDING");
    if (hasPaymentPending) {
      return { currentStatus: "VERIFIKASI_PEMBAYARAN_PENDAFTARAN", stepNumber: 3, label: "Verifikasi Pembayaran", isCompleted: false };
    }
    return { currentStatus: "MENUNGGU_PEMBAYARAN_PENDAFTARAN", stepNumber: 2, label: "Menunggu Pembayaran", isCompleted: false };
  }

  // Default: Registrasi awal selesai
  return { currentStatus: "MENUNGGU_PEMBAYARAN_PENDAFTARAN", stepNumber: 2, label: "Menunggu Pembayaran Pendaftaran", isCompleted: false };
}
