"use client"

import React, { useEffect, useState } from "react";
import { TransaksiProps } from "@/interfaces";
import { CategoryOption, TransactionFormData } from "@/interfaces/ITransaction";
import { fetchAllCategories } from "@/services/category";
import convertNumRupiah from "@/utils/convertNumRupiah";

const TransactionForm: React.FC<TransaksiProps> = ({initialData, onSubmit}) => {
    const [form, setForm] = useState<TransactionFormData>({
        type: "expense",
        amount: "",
        date: new Date().toISOString().slice(0, 10),
        note: "",
        categoryId: "",
    });

    const [categories, setCategories] = useState<CategoryOption[]>([]);

    const loadCategories = async () => {
        try {
            const res = await fetchAllCategories();
            setCategories(res.data);
        } catch (error) {
            if (error instanceof Error) {
                console.error({ message: error.message, type: "danger" });
            } else {
                console.error({ message:"Terjadi Kesalahan" , type: "danger" });
            }
        }
    }

    useEffect(() => {
        if(initialData) {
            setForm({
                ...initialData,
                categoryId: String(initialData.categoryId),
                amount: String(initialData.amount)
            })
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, []);

    const handleChage = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === "amount") {
            const clean = value.replace(/\D/g, "");
            const formatted = convertNumRupiah(clean);
            setForm(prev => ({ ...prev, amount: formatted}))
            return;
        }

        setForm(prev => ({...prev, [name]: value}))
    };

    const handleSubmit = (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        const cleanedAmount = form.amount.replace(/\D/g, "");

        const payload: TransactionFormData = {
            ...form,
            amount: cleanedAmount,
            categoryId: parseInt(String(form.categoryId)),
        }

        onSubmit(payload);
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div>
                <label htmlFor="tipe" className="block mb-1 text-sm">Tipe</label>
                <select 
                    id="tipe"
                    name="type"
                    value={form.type}
                    onChange={handleChage}
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="income">Pemasukan</option>
                    <option value="expense">Pengeluaran</option>
                </select>
            </div>

            <div>
                <label htmlFor="jumlah" className="block mb-1 text-sm">Jumlah</label>
                <input 
                    id="jumlah"
                    type="text"
                    name="amount"
                    value={form.amount}
                    onChange={handleChage}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Contoh: Rp.10.000"
                    required
                />
            </div>

            <div>
                <label htmlFor="tanggal" className="block mb-1 text-sm">Tanggal</label>
                <input 
                    id="tanggal"
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChage}
                    className="w-full border px-3 py-2 rounded"
                    placeholder=""
                    required
                />
            </div>

            <div>
                <label htmlFor="catatan" className="block mb-1 text-sm">Catatan</label>
                <input 
                    id="catatan"
                    type="text"
                    name="note"
                    value={form.note}
                    onChange={handleChage}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Masukan Catatan..."
                    required
                />
            </div>

            <div>
                <label htmlFor="category" className="block mb-1 text-sm">Kategori</label>
                <select 
                    id="category"
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChage}
                    className="w-full border px-3 py-2 rounded"
                    required
                >
                    <option value="">-- Pilih Category --</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
                Simpan
            </button>
        </form>
    )
}

export default TransactionForm;