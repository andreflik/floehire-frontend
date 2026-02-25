import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../services/api";

export default function RecruiterRegister() {
    const navigate = useNavigate();

    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/recruiter/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    company_name: companyName,
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Erro ao criar conta");
            }

            alert("Conta criada com sucesso! Faça login para continuar.");
            navigate("/login/recruiter");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erro inesperado");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm relative">
                    <button
                        onClick={() => navigate("/")}
                        className="
              absolute top-4 left-4
              w-9 h-9
              flex items-center justify-center
              rounded-full
              bg-[#FFD700] text-black
              shadow-sm
              hover:opacity-90
              transition
            "
                        title="Voltar"
                    >
                        ←
                    </button>

                    <div className="text-center mb-6 mt-4">
                        <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-yellow-100 mb-3">
                            <span className="text-xl">🏢</span>
                        </div>
                        <h1 className="text-2xl font-bold text-black">
                            Criar conta de Empresa
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Cadastre sua empresa no FloeHire
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome da empresa
                            </label>
                            <input
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="Minha Empresa LTDA"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                E-mail
                            </label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="empresa@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Senha
                            </label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FFD700] text-black font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-60"
                        >
                            {loading ? "Criando conta..." : "Criar conta"}
                        </button>
                    </form>

                    <div className="text-center text-sm text-gray-600 mt-6">
                        Já tem conta?{" "}
                        <span
                            onClick={() => navigate("/login/recruiter")}
                            className="text-yellow-500 font-medium cursor-pointer hover:underline"
                        >
                            Entrar como empresa
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}