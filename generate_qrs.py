import qrcode
import os

# 1. Daftar URL SOP beserta Halamannya
daftar_sop = {
    "SOP_1_Halaman_8": "https://codpor.github.io/SOP_PengLab/#page=8",
    "SOP_2_Halaman_24": "https://codpor.github.io/SOP_PengLab/#page=24",
    "SOP_3_Halaman_20": "https://codpor.github.io/SOP_PengLab/#page=20",
    "SOP_4_Halaman_26": "https://codpor.github.io/SOP_PengLab/#page=26",
    "SOP_5_Halaman_32": "https://codpor.github.io/SOP_PengLab/#page=32"
}

# 2. Fungsi untuk membuat QR Code Permanen dan Berkualitas Tinggi
def buat_qr_code(nama_file, url_tujuan):
    print(f"Sedang memproses {nama_file}...")
    
    # Konfigurasi QR Code standar industri (Static & Permanen)
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H, # Ketelitian tinggi (Aman jika ingin ditempel logo di tengah)
        box_size=15, # Resolusi besar dan tajam saat dicetak
        border=4,    # Batas putih di sekitar QR Code
    )
    
    # Memasukkan URL data
    qr.add_data(url_tujuan)
    qr.make(fit=True)
    
    # Membuat gambar QR Code (Hitam dan Putih murni)
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Menyimpan file gambar
    nama_png = f"{nama_file}.png"
    img.save(nama_png)
    print(f"Sukses! Berhasil disimpan sebagai: {nama_png}\n")

# 3. Eksekusi Perulangan untuk Pembuatan Otomatis
if __name__ == "__main__":
    print("=== AUTOMATION QR CODE GENERATOR STARTED ===\n")
    
    # Looping seluruh daftar SOP
    for nama, url in daftar_sop.items():
        buat_qr_code(nama, url)
        
    print("=== SEMUA QR CODE BERHASIL DICETAK SEUMUR HIDUP ===")