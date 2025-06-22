export default function formatRupiah(harga: number) {
    return `Rp. ${harga.toLocaleString("id-ID")}`;
}